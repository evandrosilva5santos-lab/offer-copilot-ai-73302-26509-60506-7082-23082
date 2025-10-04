// Admin Storage - Manage admin state and permissions
// TODO: Replace with Supabase roles/permissions

export const ADMIN_KEYS = {
  IS_ADMIN: 'offer-copilot-admin',
  ADMIN_SETTINGS: 'offer-copilot-admin-settings',
};

export interface AdminSettings {
  theme: 'light' | 'dark' | 'system';
  defaultProvider: string;
  defaultModel: string;
  autoSave: boolean;
}

// Check if user is admin
export const isAdmin = (): boolean => {
  return localStorage.getItem(ADMIN_KEYS.IS_ADMIN) === 'true';
};

// Set admin status
export const setAdminStatus = (status: boolean): void => {
  localStorage.setItem(ADMIN_KEYS.IS_ADMIN, String(status));
};

// Toggle admin mode
export const toggleAdminMode = (): boolean => {
  const current = isAdmin();
  setAdminStatus(!current);
  return !current;
};

// Get admin settings
export const getAdminSettings = (): AdminSettings => {
  const stored = localStorage.getItem(ADMIN_KEYS.ADMIN_SETTINGS);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    theme: 'system',
    defaultProvider: 'groq',
    defaultModel: 'llama-3.1-70b-versatile',
    autoSave: true,
  };
};

// Save admin settings
export const saveAdminSettings = (settings: AdminSettings): void => {
  localStorage.setItem(ADMIN_KEYS.ADMIN_SETTINGS, JSON.stringify(settings));
};

// Mock users for admin panel
export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastActive: string;
  toolsUsed: number;
}

export const getMockUsers = (): MockUser[] => {
  return [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@offercopilot.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      toolsUsed: 45,
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date().toISOString(),
      toolsUsed: 23,
    },
    {
      id: '3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      toolsUsed: 12,
    },
  ];
};
