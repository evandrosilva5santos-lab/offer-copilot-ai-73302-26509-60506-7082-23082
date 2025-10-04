// Core Types for Offer Copilot

export interface Agent {
  id: string;
  name: string;
  model: string;
  temperature: number;
  promptBase: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  segment: string;
  persona: string;
  notes: string;
  voiceTone: string;
  objectives: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ToolExecution {
  id: string;
  toolName: string;
  inputs: Record<string, any>;
  output: string;
  tokens?: number;
  provider: string;
  model: string;
  timestamp: string;
}

export interface AIProvider {
  id: "groq" | "deepseek" | "gemini" | "openai" | "claude";
  name: string;
  apiKey: string;
  isActive: boolean;
  isFree: boolean;
  baseUrl?: string;
}

export interface AppSettings {
  theme: "light" | "dark";
  defaultModel: string;
  defaultTemperature: number;
  maxTokens: number;
  defaultProvider: string;
}

export interface UserProfile {
  email: string;
  fullName: string;
  bio: string;
  avatar?: string;
  timezone: string;
  language: string;
  instagramHandle?: string;
}

export interface DashboardStats {
  totalExecutions: number;
  totalTokens: number;
  topTools: { name: string; count: number }[];
  recentExecutions: ToolExecution[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  prompt: string;
  inputs: ToolInput[];
  outputType: "text" | "list" | "json";
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToolInput {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface EnvironmentInfo {
  name: "lovable" | "dyad" | "v0" | "local";
  displayName: string;
  apiBaseUrl: string;
  features: {
    localStorage: boolean;
    supabase: boolean;
    fileUpload: boolean;
  };
}
