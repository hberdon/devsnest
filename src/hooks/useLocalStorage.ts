import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T, version?: number) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      if (!item) return initialValue
      const parsed = JSON.parse(item) as T & { _v?: number }
      if (version !== undefined && parsed._v !== version) return initialValue
      return parsed
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore write errors
    }
  }, [key, value])

  return [value, setValue] as const
}
