import { useEffect, useMemo, useState } from 'react'

type MatchBreakpoints = Record<string, boolean>

type MediaQueries = {
  [key: string]: string;
};

const breakpointMap: { [key: string]: number } = {
  xs: 370,
  sm: 576,
  md: 852,
  lg: 968,
  xl: 1080,
}

const mediaQueries: MediaQueries = (() => {
  let prevMinWidth = 0

  return Object.keys(breakpointMap).reduce((accum, size, index) => {
    // Largest size is just a min-width of second highest max-width
    if (index === Object.keys(breakpointMap).length - 1) {
      return { ...accum, [size]: `(min-width: ${prevMinWidth}px)` }
    }

    const minWidth = prevMinWidth
    const breakpoint = breakpointMap[size]

    // Min width for next iteration
    prevMinWidth = breakpoint + 1

    return { ...accum, [size]: `(min-width: ${minWidth}px) and (max-width: ${breakpoint}px)` }
  }, {})
})()

const getKey = (size: string) => `is${size.charAt(0).toUpperCase()}${size.slice(1)}`

const useMatchBreakpoints = (): MatchBreakpoints => {
  const [state, setState] = useState<MatchBreakpoints>(() => {
    return Object.keys(mediaQueries).reduce((accum, size) => {
      const key = getKey(size)
      const mql = window.matchMedia(mediaQueries[size])
      return { ...accum, [key]: mql.matches }
    }, {})
  })

  useEffect(() => {
    // Create listeners for each media query returning a function to unsubscribe
    const handlers = Object.keys(mediaQueries).map(size => {
      const mql = window.matchMedia(mediaQueries[size])

      const handler = (matchMediaQuery: MediaQueryListEvent) => {
        const key = getKey(size)
        setState(prevState => ({
          ...prevState,
          [key]: matchMediaQuery.matches,
        }))
      }

      // Safari < 14 fix
      if (mql.addEventListener) {
        mql.addEventListener('change', handler)
      }

      return () => {
        // Safari < 14 fix
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handler)
        }
      }
    })

    return () => {
      handlers.forEach(unsubscribe => {
        unsubscribe()
      })
    }
  }, [setState])

  return state
}


const useResponsive = () => {
  const { isXl } = useMatchBreakpoints()

  const isDesktop = useMemo(() => isXl , [isXl])
  const isMobile = useMemo(() => !isDesktop, [isDesktop])

  return {
    isDesktop,
    isMobile
  }
}

export default useResponsive
