export type Book = {
  id: string
  title: string
  author: string
  publisher?: string
  genre?: string
  available: boolean
  coverUrl?: string
  year: number
  price: number
  createdAt: string
  updatedAt: string
}

export async function api<T>(path: string, opts: RequestInit = {}, token?: string | null): Promise<T> {
  const res = await fetch(path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    }
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json() as Promise<T>
  return res.text() as Promise<T>
}

export async function login(email: string, password: string): Promise<{ access_token: string }> {
  return api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export type BooksQuery = {
  q?: string; genre?: string; publisher?: string; author?: string; available?: string;
  sort?: string; page?: number; limit?: number;
}
export async function getBooks(q: BooksQuery, token: string) {
  const params = new URLSearchParams()
  Object.entries(q).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v))
  })

  const url = `/books?${params.toString()}`
  console.log('📡 Query URL:', url)  
  console.log('📋 Query params:', q) 

  return api<{ items: any[]; page: number; limit: number; total: number; totalPages: number }>(`/books?${params.toString()}`, {}, token)
}

export async function getBook(id: string, token: string) {
  return api<any>(`/books/${id}`, {}, token)
}

export async function createBook(data: FormData, token: string) {
  const res = await fetch('/books', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: data
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
  }
  return res.json()
}

export async function deleteBook(id: string, token: string) {
  const res = await fetch(`/books/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
  }
  return res.json()
}

export async function restoreBook(id: string, token: string) {
  const res = await fetch(`/books/${id}/restore`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
  }
  return res.json()
}

export async function updateBook(id: string, data: FormData, token: string) {
  const res = await fetch(`/books/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: data
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`)
  }
  return res.json()

  
}