export interface AuthResponse {
  ok: boolean;
  user?: {
    username: string;
  };
  error?: string;
}

interface AuthPayload {
  mode: 'signup' | 'login' | 'updateProfile';
  username?: string;
  password?: string;
  currentUsername?: string;
  newUsername?: string;
  newPassword?: string;
}

async function authRequest(payload: AuthPayload): Promise<AuthResponse> {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as AuthResponse;
  if (!response.ok) {
    throw new Error(data.error || 'Authentication request failed.');
  }

  return data;
}

export async function signUp(username: string, password: string): Promise<AuthResponse> {
  return authRequest({ mode: 'signup', username, password });
}

export async function signIn(username: string, password: string): Promise<AuthResponse> {
  return authRequest({ mode: 'login', username, password });
}

export async function updateProfile(
  currentUsername: string,
  updates: { newUsername?: string; newPassword?: string }
): Promise<AuthResponse> {
  return authRequest({
    mode: 'updateProfile',
    currentUsername,
    newUsername: updates.newUsername,
    newPassword: updates.newPassword,
  });
}