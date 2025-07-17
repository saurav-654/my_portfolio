"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useInView } from "../hooks/useInView"
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react"

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

export default function Contact() {
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

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "sauravagrawal588@gmail.com",
      link: "mailto:sauravagrawal588@gmail.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91 8863035026",
      link: "tel:+918863035026",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Mohali, Punjab",
    },
  ]

  const socialLinks = [
    { icon: Github, href: "https://github.com/saurav-654/", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/saurav-agrawal-a05471230", label: "LinkedIn" },
    { icon: Twitter, href: "https://x.com/Saurav_agr45", label: "Twitter" },
  ]

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-slate-900  to-slate-900 text-white relative overflow-hidden">
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full" />
            <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
              Have a project in mind? Let's work together to create something amazing!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Contact Information */}
            <div
              className={`transition-all duration-1000 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} mb-12`}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {contactInfo.map((info, index) => (
                  <a
                    key={info.title}
                    href={info.link}
                    className={`flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 group delay-${index * 100}`}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                      <info.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-200 mb-2">{info.title}</h4>
                    <p className="text-gray-300">{info.value}</p>
                  </a>
                ))}
              </div>

              {/* Centered Social Links */}
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-8">Follow Me</h3>
                <div className="flex justify-center gap-6">
                  {socialLinks.map((social, index) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className={`w-16 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110 group delay-${index * 100}`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-8 h-8 text-white group-hover:text-blue-400 transition-colors" />
                    </a>
                  ))}
                </div>
                <p className="text-gray-400 mt-6 text-sm">
                  Connect with me on social media for updates and insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
