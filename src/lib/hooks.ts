import { useEffect, useState, useRef } from 'react'

export function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

// Nuevo hook para objetos
export function useDebouncedObject<T extends object>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  const stringValue = JSON.stringify(value)
  
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringValue, delay])
  
  return debounced
}
