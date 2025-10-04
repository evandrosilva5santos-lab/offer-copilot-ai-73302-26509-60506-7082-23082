// Local Storage Helper
// TODO: Replace with Supabase when ready

const STORAGE_KEYS = {
  AGENTS: 'offer-copilot-agents',
  CLIENTS: 'offer-copilot-clients',
  EXECUTIONS: 'offer-copilot-executions',
  SETTINGS: 'offer-copilot-settings',
  API_KEYS: 'offer-copilot-api-keys',
  USER_PROFILE: 'offer-copilot-user-profile',
  TOOLS: 'offer-copilot-tools',
};

export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },
};

export const KEYS = STORAGE_KEYS;
