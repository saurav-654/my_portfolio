"use client"

import { useEffect, useState, useRef } from "react"
import { useInView } from "../hooks/useInView"
import { Code, Palette, Zap } from "lucide-react"
import Image from "next/image"

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

export default function About() {
  const [ref, isInView] = useInView({ threshold: 0.3 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stars, setStars] = useState<Star[]>([])
  const animationRef = useRef<number>()

  // Initialize stars
  useEffect(() => {
    const newStars: Star[] = []
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      newStars.push({
        id: i,
        x,
        y,
        originalX: x,
        originalY: y,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.6 + 0.2,
        velocityX: (Math.random() - 0.5) * 0.3,
        velocityY: (Math.random() - 0.5) * 0.3
      })
    }
    setStars(newStars)
  }, [])

  // Continuous star animation
  useEffect(() => {
    const animateStars = () => {
      setStars(prevStars =>
        prevStars.map(star => {
          let newX = star.x + star.velocityX
          let newY = star.y + star.velocityY
          let newOriginalX = star.originalX + star.velocityX
          let newOriginalY = star.originalY + star.velocityY

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
      
      setStars(prevStars => 
        prevStars.map(star => {
          const distanceX = e.clientX - star.originalX
          const distanceY = e.clientY - star.originalY
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
          
          if (distance < 100) {
            const repulsionForce = (100 - distance) / 100
            const angle = Math.atan2(distanceY, distanceX)
            const pushX = Math.cos(angle) * repulsionForce * 30
            const pushY = Math.sin(angle) * repulsionForce * 30
            
            return {
              ...star,
              x: star.originalX - pushX,
              y: star.originalY - pushY
            }
          } else {
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

  const features = [
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and efficient code following best practices.",
    },
    {
      icon: Palette,
      title: "Creative Design",
      description: "Crafting beautiful and intuitive user interfaces that enhance user experience.",
    },
    {
      icon: Zap,
      title: "Fast Performance",
      description: "Optimizing applications for speed and performance across all devices.",
    },
  ]

  return (
    <section id="about" className="relative py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 overflow-hidden">
      {/* Star Background */}
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
              opacity: star.brightness * 0.7,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness * 0.3})`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        
        {/* Cursor glow effect */}
        <div
          className="absolute w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-1000 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
            >
              <div className="relative">
                <div className="w-80 h-96 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl p-1">
                  <div className="w-full h-full bg-slate-800 rounded-2xl overflow-hidden">
                    <Image
                      src="/photo.jpg"
                      alt="Saurav Agrawal"
                      width={320}
                      height={384}
                      className="w-full h-full object-cover rounded-2xl"
                      priority
                    />
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full animate-pulse backdrop-blur-sm" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-400/20 rounded-full animate-bounce backdrop-blur-sm" />
              </div>
            </div>

            <div
              className={`transition-all duration-1000 delay-400 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Passionate Developer </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                 A Computer Science Engineering graduate with a strong foundation in web development, programming. I specialize in building clean, responsive, and user-friendly web applications using modern technologies like HTML5, Tailwind CSS, JavaScript, React, Node.js, MongoDB, and Firebase.


              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                I enjoy transforming ideas into working applications and continuously learning new tools and frameworks. 
              </p>

              <div className="grid gap-6">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className={`flex items-start gap-4 transition-all duration-500 delay-${600 + index * 100} ${
                      isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
