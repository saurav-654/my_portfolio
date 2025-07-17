"use client"

import { useInView } from "../hooks/useInView"
import { useEffect, useState, useRef } from "react"

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

const skills = [
  "C++", "JAVA", "SQL", "HTML5", "CSS", "Javascript",
  "Node.js", "React.js", "MySQL", "MongoDB Compass", 
  "Github", "Firebase"
]

export default function Skills() {
  const [ref, isInView] = useInView({ threshold: 0.3 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [stars, setStars] = useState<Star[]>([])
  const animationRef = useRef<number>()

  // Initialize stars
  useEffect(() => {
    const newStars: Star[] = []
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      newStars.push({
        id: i,
        x,
        y,
        originalX: x,
        originalY: y,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.5 + 0.2,
        velocityX: (Math.random() - 0.5) * 0.2,
        velocityY: (Math.random() - 0.5) * 0.2,
      })
    }
    setStars(newStars)
  }, [])

  // Continuous star animation
  useEffect(() => {
    const animateStars = () => {
      setStars((prevStars) =>
        prevStars.map((star) => {
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
            originalY: newOriginalY,
          }
        }),
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

      setStars((prevStars) =>
        prevStars.map((star) => {
          const distanceX = e.clientX - star.originalX
          const distanceY = e.clientY - star.originalY
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

          if (distance < 80) {
            const repulsionForce = (80 - distance) / 80
            const angle = Math.atan2(distanceY, distanceX)
            const pushX = Math.cos(angle) * repulsionForce * 25
            const pushY = Math.sin(angle) * repulsionForce * 25

            return {
              ...star,
              x: star.originalX - pushX,
              y: star.originalY - pushY,
            }
          } else {
            return {
              ...star,
              x: star.x + (star.originalX - star.x) * 0.02,
              y: star.y + (star.originalY - star.y) * 0.02,
            }
          }
        }),
      )
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section 
      id="skills" 
      className="relative py-16 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 overflow-hidden"
    >
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
              opacity: star.brightness * 0.6,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness * 0.2})`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Cursor glow effect */}
        <div
          className="absolute w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className={`transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Skills
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
            <p className="text-xl text-gray-300 mt-4 max-w-2xl mx-auto">
              Technologies and expertise I bring to every project
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <div
                key={skill}
                className={`
                  w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 bg-slate-800/50 backdrop-blur-sm border border-gray-700 
                  rounded-3xl flex items-center justify-center cursor-pointer
                  transition-all duration-500 transform
                  hover:scale-110 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-purple-600/20
                  hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/25
                  ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <span className="text-white font-bold text-sm sm:text-base lg:text-lg text-center px-1 sm:px-2 lg:px-3 leading-tight tracking-wide">
                  {skill}
                </span>
              </div>
            ))}
          </div>

          <div className={`mt-16 text-center transition-all duration-1000 delay-600 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <h3 className="text-3xl font-bold text-white mb-6">
              Ready to build amazing{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              With this diverse skill set, I'm equipped to tackle complex challenges and deliver innovative solutions
              that make a real impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}



