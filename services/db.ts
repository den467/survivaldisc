
import { FileItem, UserProfile } from '../types';

const USERS_KEY = 'sd_users_db';
const SESSION_KEY = 'sd_active_session';
const FILES_PREFIX = 'sd_files_';

export const db = {
  // Authentication
  register: (user: UserProfile, password: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u: any) => u.email === user.email)) return false;
    
    // Если это первый пользователь, делаем его админом
    const role = users.length === 0 ? 'admin' : 'user';
    users.push({ ...user, password, role });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  login: (email: string, password: string): UserProfile | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      const { password, ...profile } = user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
      return profile;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getSession: (): UserProfile | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  // File Management
  saveFiles: (email: string, files: FileItem[]) => {
    localStorage.setItem(`${FILES_PREFIX}${email}`, JSON.stringify(files));
  },

  getFiles: (email: string): FileItem[] | null => {
    const files = localStorage.getItem(`${FILES_PREFIX}${email}`);
    return files ? JSON.parse(files) : null;
  },

  // ADMIN SQL-like Queries
  getAllUsers: (): UserProfile[] => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.map(({ password, ...user }: any) => user);
  },

  getGlobalStats: () => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    let totalFiles = 0;
    let totalSize = 0;

    users.forEach((u: any) => {
      const files = JSON.parse(localStorage.getItem(`${FILES_PREFIX}${u.email}`) || '[]');
      totalFiles += files.length;
      totalSize += files.reduce((acc: number, f: any) => acc + (f.size || 0), 0);
    });

    return {
      userCount: users.length,
      fileCount: totalFiles,
      totalBytes: totalSize,
      activeNodes: 14,
      serverStatus: 'OPTIMAL'
    };
  }
};
