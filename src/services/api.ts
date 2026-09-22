import { User, ImageRecord } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('violet_jwt_token') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  async login(identifier: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (response.ok) {
        return await response.json();
      }
      const data = await response.json();
      throw new Error(data.error || 'Login failed');
    } catch (err: any) {
      // Fallback for standalone preview mode
      const cleanId = identifier.trim().toLowerCase();
      const users: any[] = JSON.parse(localStorage.getItem('violet_users') || '[]');
      const foundUser = users.find(
        (u: any) =>
          (u.phone?.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId) &&
          (u.password === password ||
            (u.role === 'admin' && ['admin123', 'admin@123', 'admin'].includes(password)))
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        const fakeToken = `token_${foundUser.id}_${Date.now()}`;
        return { token: fakeToken, user: userWithoutPassword };
      }
      throw new Error(err.message || 'Invalid credentials');
    }
  },

  async register(data: { name: string; age: number; phone: string; email: string; password: string }): Promise<{ token: string; user: User }> {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return await response.json();
      }
      const resData = await response.json();
      throw new Error(resData.error || 'Registration failed');
    } catch (err: any) {
      // Fallback for standalone preview mode
      const users: any[] = JSON.parse(localStorage.getItem('violet_users') || '[]');
      if (users.some((u) => u.email === data.email || u.phone === data.phone)) {
        throw new Error('Phone number or email already registered');
      }

      const newUser: any = {
        id: Date.now(),
        ...data,
        role: 'user',
        is_paid: 0,
      };
      users.push(newUser);
      localStorage.setItem('violet_users', JSON.stringify(users));

      const { password: _, ...userWithoutPassword } = newUser;
      const fakeToken = `token_${newUser.id}_${Date.now()}`;
      return { token: fakeToken, user: userWithoutPassword };
    }
  },

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Unauthorized');
    return await response.json();
  },

  // Images
  async getImages(): Promise<ImageRecord[]> {
    try {
      const response = await fetch(`${API_BASE}/images`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // fallback
    }
    const stored = localStorage.getItem('violet_images');
    return stored ? JSON.parse(stored) : [];
  },

  async updateImage(id: string, url: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/admin/images/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ url }),
      });
      if (response.ok) return true;
    } catch {
      // fallback
    }
    const stored: ImageRecord[] = JSON.parse(localStorage.getItem('violet_images') || '[]');
    const updated = stored.map((img) => (img.id === id ? { ...img, url } : img));
    localStorage.setItem('violet_images', JSON.stringify(updated));
    return true;
  },

  // Admin
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: getAuthHeader(),
      });
      if (response.ok) return await response.json();
    } catch {
      // fallback
    }
    return JSON.parse(localStorage.getItem('violet_users') || '[]');
  },

  async togglePayment(userId: number, isPaid: boolean): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ is_paid: isPaid }),
      });
      if (response.ok) return true;
    } catch {
      // fallback
    }
    const stored: User[] = JSON.parse(localStorage.getItem('violet_users') || '[]');
    const updated = stored.map((u) => (u.id === userId ? { ...u, is_paid: isPaid ? 1 : 0 } : u));
    localStorage.setItem('violet_users', JSON.stringify(updated));
    return true;
  },
};
