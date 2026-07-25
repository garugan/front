import {
  type Friend,
  type FriendDetails,
  type FriendRequest,
  type FriendSearchResult,
} from '../components/data';
import { getAccessToken } from './auth';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export async function fetchFriends(): Promise<Friend[]> {
  return friendRequest('/friends');
}

export async function fetchFriendRequests(): Promise<FriendRequest[]> {
  return friendRequest('/friends/requests');
}

export async function searchFriendByEmail(
  email: string,
): Promise<FriendSearchResult | null> {
  const params = new URLSearchParams({ email });
  return friendRequest(`/friends/search?${params.toString()}`);
}

export async function sendFriendRequest(
  userId: string,
): Promise<{ id: string; status: 'PENDING' | 'ACCEPTED' }> {
  return friendRequest('/friends/requests', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function respondToFriendRequest(
  requestId: string,
  action: 'accept' | 'reject',
) {
  return friendRequest(`/friends/requests/${encodeURIComponent(requestId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}

export async function fetchFriendDetails(
  friendId: string,
): Promise<FriendDetails> {
  return friendRequest(
    `/friends/${encodeURIComponent(friendId)}/restaurants`,
  );
}

export async function removeFriend(friendId: string) {
  return friendRequest(`/friends/${encodeURIComponent(friendId)}`, {
    method: 'DELETE',
  });
}

async function friendRequest<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('ログインが必要です');
  }

  const response = await fetch(new URL(path, apiBaseUrl), {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(body?.message)
      ? body.message.join('、')
      : body?.message;

    if (response.status === 409) {
      throw new Error('このユーザーにはすでに申請済みです');
    }

    throw new Error(message || 'フレンド情報の更新に失敗しました');
  }

  return response.json() as Promise<T>;
}
