export function useLocalStorage() {
  function setLocalStorage({ name, value }: { name: string, value: string }) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value)
    }
  }

  function getLocalStorage({ name }: { name: string }) {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(name)
    }
  }

  function clearLocalStorage({ name }: { name: string }) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name)
    }
  }

  return {
    clearLocalStorage,
    setLocalStorage,
    getLocalStorage
  }
}