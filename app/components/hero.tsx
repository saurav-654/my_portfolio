"use client"

import { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { ChevronDown, Github, Linkedin, Mail } from "lucide-react"

interface Star {
  id: number
  x: number
  y: number
  originalX: number
  originalY: number
  size: number
  brightness: number
  velocityX: number
  velocityY: number
}

export default function Hero() {
  const { scrollY } = useSelector((state: RootState) => state.scroll)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stars, setStars] = useState<Star[]>([])
  const animationRef = useRef<number>()

  // Initialize stars
  useEffect(() => {
    const newStars: Star[] = []
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      newStars.push({
        id: i,
        x,
        y,
        originalX: x,
        originalY: y,
        size: Math.random() * 3 + 1,
        brightness: Math.random() * 0.8 + 0.2,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5
      })
    }
    setStars(newStars)
  }, [])

  // Continuous star animation using requestAnimationFrame
  useEffect(() => {
    const animateStars = () => {
      setStars(prevStars =>
        prevStars.map(star => {
          let newX = star.x + star.velocityX
          let newY = star.y + star.velocityY
          let newOriginalX = star.originalX + star.velocityX
          let newOriginalY = star.originalY + star.velocityY

          // Wrap around screen edges
          if (newX > window.innerWidth) {
            newX = 0
            newOriginalX = 0
          } else if (newX < 0) {
            newX = window.innerWidth
            newOriginalX = window.innerWidth
          }

          if (newY > window.innerHeight) {
            newY = 0
            newOriginalY = 0
          } else if (newY < 0) {
            newY = window.innerHeight
            newOriginalY = window.innerHeight
          }

          return {
            ...star,
            x: newX,
            y: newY,
            originalX: newOriginalX,
            originalY: newOriginalY
          }
        })
      )
      
      animationRef.current = requestAnimationFrame(animateStars)
    }

    animationRef.current = requestAnimationFrame(animateStars)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Update star positions to avoid cursor
      setStars(prevStars => 
        prevStars.map(star => {
          const distanceX = e.clientX - star.originalX
          const distanceY = e.clientY - star.originalY
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
          
          if (distance < 120) {
            // Calculate repulsion force
            const repulsionForce = (120 - distance) / 120
            const angle = Math.atan2(distanceY, distanceX)
            const pushX = Math.cos(angle) * repulsionForce * 40
            const pushY = Math.sin(angle) * repulsionForce * 40
            
            return {
              ...star,
              x: star.originalX - pushX,
              y: star.originalY - pushY
            }
          } else {
            // Smoothly return to original position
            return {
              ...star,
              x: star.x + (star.originalX - star.x) * 0.02,
              y: star.y + (star.originalY - star.y) * 0.02
            }
          }
        })
      )
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900  to-slate-900"
    >
      {/* Night Sky with Moving Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: star.x,
              top: star.y,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.brightness,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness * 0.5})`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        
        {/* Cursor glow effect */}
        <div
          className="absolute w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div
          className="transition-all duration-300"
          style={{
            transform: `translateY(${Math.sin(scrollY * 0.005) * 10}px)`,
          }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Saurav Agrawal
            </span>
          </h1>

          <div className="text-xl md:text-2xl text-gray-300 mb-8 h-8">
            <span>Software Engineer</span>
          </div>

          <p className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed">
           Creative and self-driven web developer passionate about building responsive, real-time applications using React, Node.js, and Firebase.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={scrollToProjects}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
              style={{
                transform: `translateY(${Math.sin((scrollY + 100) * 0.008) * 5}px)`,
              }}
            >
              <span className="flex items-center gap-2">
                View My Work
                <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </span>
            </button>

            <a
              href="/resume.pdf"
              download="Saurav_Agrawal_Resume.pdf"
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:bg-white/20"
              style={{
                transform: `translateY(${Math.sin((scrollY + 200) * 0.008) * 5}px)`,
              }}
            >
              <span className="flex items-center gap-2">
                Download Resume
                <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
            </a>

            <div className="flex gap-4">
              <a
                href="https://github.com/saurav-654/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/saurav-agrawal-a05471230"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:sauravagrawal588@gmail.com"
                className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={scrollToAbout}
          className="text-white/60 hover:text-white transition-colors"
          style={{
            transform: `translateY(${Math.sin(scrollY * 0.01) * 10}px)`,
          }}
        >
          <ChevronDown className="w-8 h-8 mx-auto" />
        </button>
      </div>
    </section>
  )
}
