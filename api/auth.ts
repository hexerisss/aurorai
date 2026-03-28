import bcrypt from 'bcryptjs';
import postgres from 'postgres';

type AuthMode = 'signup' | 'login' | 'updateProfile';

type RequestBody = {
  mode?: AuthMode;
  username?: string;
  password?: string;
  currentUsername?: string;
  newUsername?: string;
  newPassword?: string;
};

let cachedSql: ReturnType<typeof postgres> | null = null;

function getDbClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }

  if (!cachedSql) {
    cachedSql = postgres(databaseUrl, { max: 1 });
  }

  return cachedSql;
}

async function ensureUsersTable() {
  const sql = getDbClient();
  await sql`
    CREATE TABLE IF NOT EXISTS aurora_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(64) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

function parseBody(rawBody: unknown): RequestBody {
  if (!rawBody) {
    return {};
  }

  if (typeof rawBody === 'string') {
    try {
      return JSON.parse(rawBody) as RequestBody;
    } catch {
      return {};
    }
  }

  return rawBody as RequestBody;
}

function trimValue(value?: string) {
  return value?.trim() || '';
}

function sendJson(res: any, statusCode: number, payload: Record<string, unknown>) {
  res.status(statusCode).json(payload);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed.' });
    return;
  }

  try {
    await ensureUsersTable();
    const body = parseBody(req.body);
    const mode = body.mode;

    if (!mode) {
      sendJson(res, 400, { ok: false, error: 'Missing mode.' });
      return;
    }

    const sql = getDbClient();

    if (mode === 'signup') {
      const username = trimValue(body.username);
      const password = trimValue(body.password);

      if (username.length < 3) {
        sendJson(res, 400, { ok: false, error: 'Username must be at least 3 characters.' });
        return;
      }

      if (password.length < 4) {
        sendJson(res, 400, { ok: false, error: 'Password must be at least 4 characters.' });
        return;
      }

      const existing = await sql<{ id: number }[]>`
        SELECT id FROM aurora_users WHERE username = ${username} LIMIT 1;
      `;

      if (existing.length > 0) {
        sendJson(res, 409, { ok: false, error: 'Username already exists.' });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      await sql`
        INSERT INTO aurora_users (username, password_hash)
        VALUES (${username}, ${passwordHash});
      `;

      sendJson(res, 201, { ok: true, user: { username } });
      return;
    }

    if (mode === 'login') {
      const username = trimValue(body.username);
      const password = trimValue(body.password);

      const rows = await sql<{ username: string; password_hash: string }[]>`
        SELECT username, password_hash
        FROM aurora_users
        WHERE username = ${username}
        LIMIT 1;
      `;

      if (rows.length === 0) {
        sendJson(res, 401, { ok: false, error: 'Invalid username or password.' });
        return;
      }

      const user = rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        sendJson(res, 401, { ok: false, error: 'Invalid username or password.' });
        return;
      }

      sendJson(res, 200, { ok: true, user: { username: user.username } });
      return;
    }

    if (mode === 'updateProfile') {
      const currentUsername = trimValue(body.currentUsername);
      const newUsername = trimValue(body.newUsername);
      const newPassword = trimValue(body.newPassword);

      if (!currentUsername) {
        sendJson(res, 400, { ok: false, error: 'Missing current username.' });
        return;
      }

      const rows = await sql<{ id: number }[]>`
        SELECT id FROM aurora_users WHERE username = ${currentUsername} LIMIT 1;
      `;

      if (rows.length === 0) {
        sendJson(res, 404, { ok: false, error: 'User not found.' });
        return;
      }

      if (!newUsername && !newPassword) {
        sendJson(res, 400, { ok: false, error: 'No profile updates were provided.' });
        return;
      }

      if (newUsername && newUsername.length < 3) {
        sendJson(res, 400, { ok: false, error: 'Username must be at least 3 characters.' });
        return;
      }

      if (newPassword && newPassword.length < 4) {
        sendJson(res, 400, { ok: false, error: 'Password must be at least 4 characters.' });
        return;
      }

      if (newUsername && newUsername !== currentUsername) {
        const exists = await sql<{ id: number }[]>`
          SELECT id FROM aurora_users WHERE username = ${newUsername} LIMIT 1;
        `;

        if (exists.length > 0) {
          sendJson(res, 409, { ok: false, error: 'Username is already taken.' });
          return;
        }
      }

      const finalUsername = newUsername || currentUsername;

      if (newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await sql`
          UPDATE aurora_users
          SET username = ${finalUsername}, password_hash = ${passwordHash}, updated_at = NOW()
          WHERE username = ${currentUsername};
        `;
      } else {
        await sql`
          UPDATE aurora_users
          SET username = ${finalUsername}, updated_at = NOW()
          WHERE username = ${currentUsername};
        `;
      }

      sendJson(res, 200, { ok: true, user: { username: finalUsername } });
      return;
    }

    sendJson(res, 400, { ok: false, error: 'Invalid mode.' });
  } catch (error) {
    console.error('Auth API error:', error);
    const message = error instanceof Error ? error.message : 'Unexpected server error.';
    sendJson(res, 500, { ok: false, error: message });
  }
}