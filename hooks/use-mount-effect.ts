import { useEffect } from "react"

export function useMountEffect(fn: () => void | Promise<void>) {
  useEffect(() => { fn() }, [fn])
}
