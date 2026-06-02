const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
const authStorageKey = 'band-meshi-auth';
const authRequestTimeoutMs = 15_000;

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export function getStoredAuthSession() {
  const rawSession = window.localStorage.getItem(authStorageKey);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(authStorageKey);
    return null;
  }
}

export function getAccessToken() {
  return getStoredAuthSession()?.accessToken;
}

export function storeAuthSession(session: AuthSession) {
  window.localStorage.setItem(authStorageKey, JSON.stringify(session));
}

export function clearAuthSession() {
  window.localStorage.removeItem(authStorageKey);
}

export async function fetchCurrentUser() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('ログインが必要です');
  }

  const url = new URL('/auth/me', apiBaseUrl);
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('ユーザー情報の取得に失敗しました');
  }

  const user = (await response.json()) as AuthUser;
  const currentSession = getStoredAuthSession();

  if (currentSession) {
    storeAuthSession({
      ...currentSession,
      user,
    });
  }

  return user;
}

export async function login(email: string, password: string, recaptchaToken: string) {
  return authRequest('/auth/login', { email, password, recaptchaToken });
}

export async function register(
  email: string,
  password: string,
  recaptchaToken: string,
  name?: string,
) {
  return authRequest('/auth/register', { email, password, name, recaptchaToken });
}

async function authRequest(path: string, body: Record<string, string | undefined>) {
  const url = new URL(path, apiBaseUrl);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, authRequestTimeoutMs);

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('認証リクエストがタイムアウトしました');
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error('サーバー設定を確認してください');
    }

    throw new Error('認証に失敗しました');
  }

  const session = (await response.json()) as AuthSession;
  storeAuthSession(session);

  return session;
}
