import type { ApiError, Hero, HeroPayload, Superpower } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  });

  if (!response.ok) {
    let message = 'Erro inesperado';
    try {
      const body = await response.json();
      message = body?.message ?? message;
    } catch {
      message = response.statusText || message;
    }
    const error: ApiError = { message, status: response.status };
    throw error;
  }

  const isJson =
    (response.headers.get('content-type') || '').includes('application/json') &&
    response.status !== 204;

  return (isJson ? response.json() : ({} as T)) as T;
}

export async function fetchHeroes(): Promise<Hero[]> {
  return request<Hero[]>('/api/Heroes');
}

export async function fetchHero(id: string): Promise<Hero> {
  return request<Hero>(`/api/Heroes/${id}`);
}

export async function createHero(payload: HeroPayload): Promise<Hero> {
  return request<Hero>('/api/Heroes', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function updateHero(id: string, payload: HeroPayload): Promise<Hero> {
  return request<Hero>(`/api/Heroes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export async function deleteHero(id: string): Promise<void> {
  return request<void>(`/api/Heroes/${id}`, { method: 'DELETE' });
}

export async function fetchSuperpowers(): Promise<Superpower[]> {
  return request<Superpower[]>('/api/Superpowers');
}
