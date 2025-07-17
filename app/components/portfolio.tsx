"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { setActiveSection, setScrollY, setIsScrolling } from "../store/store"
import Navigation from "./navigation"
import Hero from "./hero"
import About from "./about"
import Skills from "./skills"
import Projects from "./projects"
import Contact from "./contact"
import { useScrollEffect } from "../hooks/useScrollEffect"

export default function Portfolio() {
  const dispatch = useDispatch()
  const { activeSection, scrollY } = useSelector((state: RootState) => state.scroll)
  const [isMounted, setIsMounted] = useState(false)

  useScrollEffect()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      dispatch(setScrollY(currentScrollY))
      dispatch(setIsScrolling(true))

      // Determine active section based on scroll position
      const sections = ["home", "about", "skills", "projects", "contact"]
      const sectionElements = sections.map((id) => document.getElementById(id))

      let currentSection = "home"
      sectionElements.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = sections[index]
          }
        }
      })

      dispatch(setActiveSection(currentSection))

      // Clear scrolling state after a delay
      setTimeout(() => dispatch(setIsScrolling(false)), 150)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [dispatch])

  // Calculate scroll progress safely
  const scrollProgress = isMounted && typeof document !== 'undefined' 
    ? (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    : 0

  return (
    <div className="relative">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
          style={{
            width: `${scrollProgress}%`,
          }}
        />
      </div>
    </div>
  )
}
