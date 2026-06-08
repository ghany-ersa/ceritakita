import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({ lg: 1024 })

export function useBreakpoint() {
  return {
    isLargeScreen: breakpoints.greaterOrEqual('lg'),
    isSmallScreen: breakpoints.smaller('lg'),
  }
}
