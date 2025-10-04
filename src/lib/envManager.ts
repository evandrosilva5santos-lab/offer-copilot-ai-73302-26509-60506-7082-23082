// Environment Manager - Universal Compatibility System
// Detects and configures the app for Lovable, Dyad, V0, and Local environments

export type Environment = "lovable" | "dyad" | "v0" | "local";

export interface EnvironmentConfig {
  name: Environment;
  displayName: string;
  apiBaseUrl: string;
  features: {
    localStorage: boolean;
    supabase: boolean;
    fileUpload: boolean;
  };
}

/**
 * Detects the current environment based on hostname
 */
export const detectEnvironment = (): Environment => {
  const hostname = window.location.hostname;
  
  if (hostname.includes("lovable.dev") || hostname.includes("lovable.app")) {
    return "lovable";
  }
  
  if (hostname.includes("dyad.app") || hostname.includes("dyad.dev")) {
    return "dyad";
  }
  
  if (hostname.includes("vercel.app") || hostname.includes("v0.dev")) {
    return "v0";
  }
  
  return "local";
};

/**
 * Returns environment-specific configuration
 */
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = detectEnvironment();
  
  const configs: Record<Environment, EnvironmentConfig> = {
    lovable: {
      name: "lovable",
      displayName: "Lovable",
      apiBaseUrl: import.meta.env.VITE_API_URL || "https://api.lovable.dev",
      features: {
        localStorage: true,
        supabase: true,
        fileUpload: true,
      },
    },
    dyad: {
      name: "dyad",
      displayName: "Dyad",
      apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:8787",
      features: {
        localStorage: true,
        supabase: false,
        fileUpload: true,
      },
    },
    v0: {
      name: "v0",
      displayName: "V0.dev",
      apiBaseUrl: import.meta.env.VITE_API_URL || "https://offer-copilot.vercel.app",
      features: {
        localStorage: true,
        supabase: false,
        fileUpload: true,
      },
    },
    local: {
      name: "local",
      displayName: "Local Development",
      apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:8080",
      features: {
        localStorage: true,
        supabase: false,
        fileUpload: true,
      },
    },
  };
  
  return configs[env];
};

/**
 * Returns the API base URL for the current environment
 */
export const getApiBaseUrl = (): string => {
  return getEnvironmentConfig().apiBaseUrl;
};

/**
 * Logs environment information to console with styling
 */
export const logEnvironmentInfo = () => {
  const config = getEnvironmentConfig();
  console.info(
    `%c[Offer Copilot] 🚀 Running in ${config.displayName} mode`,
    "background: #4F46E5; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;"
  );
  console.info(`📡 API Base URL: ${config.apiBaseUrl}`);
  console.info(`✨ Features:`, config.features);
};

/**
 * React hook to use environment config in components
 */
export const useEnvironment = () => {
  return getEnvironmentConfig();
};
