import { LoginResponse } from "../api/auth-api-slice"

const TOKEN_KEY = "auth"

export function setToken(auth: LoginResponse): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(auth))
  }
}

export function getToken(): LoginResponse | null {
  if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem(TOKEN_KEY) ?? "{}")
  }
  return null
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY)
  }
}
