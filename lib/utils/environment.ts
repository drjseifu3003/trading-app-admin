/**
 * Environment configuration utility
 */

// API base URL - defaults to a placeholder if not set
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yourtradingapp.com/v1"

// Environment name
export const ENV_NAME = process.env.NEXT_PUBLIC_ENV_NAME || "development"

// Feature flags
export const FEATURES = {
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === "true",
}

// Check if we're in a production environment
export const isProduction = ENV_NAME === "production"

// Check if we're in a development environment
export const isDevelopment = ENV_NAME === "development"

// Check if we're in a test environment
export const isTest = ENV_NAME === "test"
