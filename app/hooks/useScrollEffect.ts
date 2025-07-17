"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setScrollY, setIsScrolling } from "../store/store"

export function useScrollEffect() {
  const dispatch = useDispatch()

  useEffect(() => {
    let ticking = false

    const updateScrollY = () => {
      dispatch(setScrollY(window.scrollY))
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollY)
        ticking = true
      }

      dispatch(setIsScrolling(true))

      // Clear scrolling state after scroll ends
      clearTimeout(window.scrollTimeout)
      window.scrollTimeout = setTimeout(() => {
        dispatch(setIsScrolling(false))
      }, 150)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(window.scrollTimeout)
    }
  }, [dispatch])
}

declare global {
  interface Window {
    scrollTimeout: NodeJS.Timeout
  }
}
