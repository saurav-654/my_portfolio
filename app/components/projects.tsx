"use client"

import { useState, useEffect, useRef } from "react"
import { useInView } from "../hooks/useInView"
import { ChevronLeft, ChevronRight } from "lucide-react"
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

const projects = [
  {
    id: 1,
    title: "Invoice Builder",
    description:
      "This project is a simple billing/invoice management application built with React, Redux Toolkit, and Vite. It allows you to create, edit, filter, and manage invoices with a modern UI",
    image: "/invoice.png",
    technologies: ["React", "Redux", "Vite",  "Tailwind CSS"],
    githubUrl: "https://github.com/saurav-654/billing",
  },
  {
    id: 2,
    title: "Chat Application",
    description:
      "This is a real-time chat application using Node.js, Express.js, and Socket.io. It allows users to join a chat, send messages, and view active participants. ",
    image: "/chat.png?height=300&width=500",
    technologies: ["Node.js", "Express", "Socket.io"],
    githubUrl: "https://github.com/saurav-654/web",
  },
  {
    id: 3,
    title: "RADARS weather Dashboard",
    description:
      "This project is a web interface for displaying real-time accident detection data from the RADARS system.RADARS (Road Accident Detection and Reporting System) detects and reports multiple types of vehicle accidents, including rollovers, collisions, vehicle submersion, and fires, and sends distress data to this dashboard.",
    image: "/radars.png",
    technologies: ["HTML", "CSS", "JAVASCRIPT", "Firebase","Google Maps API"],
    githubUrl: "https://github.com/saurav-654/RADARS",
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "A responsive portfolio website with smooth animations, dark mode, and optimized performance.",
    image: "/placeholder.svg?height=300&width=500",
    technologies: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
    githubUrl: "#",
  }
]

export default function Projects() {
  const [ref, isInView] = useInView({ threshold: 0.2 })
  const [currentSlide, setCurrentSlide] = useState(0)
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
        velocityY: (Math.random() - 0.5) * 0.3,
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

          if (distance < 100) {
            const repulsionForce = (100 - distance) / 100
            const angle = Math.atan2(distanceY, distanceX)
            const pushX = Math.cos(angle) * repulsionForce * 30
            const pushY = Math.sin(angle) * repulsionForce * 30

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

  const filteredProjects = projects

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(projects.length / 2))
  }

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + Math.ceil(projects.length / 2)) % Math.ceil(projects.length / 2),
    )
  }

  return (
    <section id="projects" className="relative py-16 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 overflow-hidden">
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
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}

        {/* Cursor glow effect */}
        <div
          className="absolute w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none transition-all duration-300"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: "translate(-50%, -50%)",
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
              Featured{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
            <p className="text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and creativity
            </p>
          </div>

          {/* Projects Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(projects.length / 2) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-2 gap-8">
                      {projects.slice(slideIndex * 2, slideIndex * 2 + 2).map((project, index) => (
                        <a
                          key={project.id}
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`group bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer delay-${index * 200} ${
                            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                          }`}
                        >
                          <div className="relative overflow-hidden">
                            <Image
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              width={500}
                              height={300}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>

                            <p className="text-gray-300 mb-4 line-clamp-3">{project.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.technologies.map((tech) => (
                                <span key={tech} className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded-md">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {Math.ceil(projects.length / 2) > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all duration-300"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all duration-300"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {Math.ceil(projects.length / 2) > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.ceil(projects.length / 2) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
//                         ? "bg-gradient-to-r from-blue-600 to-purple-600"
//                         : "bg-gray-300 hover:bg-gray-400"
//                     }`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
// //                                 View Code
// //                               </a>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Navigation Arrows */}
// //             {Math.ceil(filteredProjects.length / 2) > 1 && (
// //               <>
// //                 <button
// //                   onClick={prevSlide}
// //                   className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all duration-300"
// //                 >
// //                   <ChevronLeft className="w-6 h-6 text-gray-600" />
// //                 </button>
// //                 <button
// //                   onClick={nextSlide}
// //                   className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-3 bg-white shadow-lg rounded-full hover:shadow-xl transition-all duration-300"
// //                 >
// //                   <ChevronRight className="w-6 h-6 text-gray-600" />
// //                 </button>
// //               </>
// //             )}

// //             {/* Slide Indicators */}
// //             {Math.ceil(filteredProjects.length / 2) > 1 && (
// //               <div className="flex justify-center gap-2 mt-8">
// //                 {Array.from({ length: Math.ceil(filteredProjects.length / 2) }).map((_, index) => (
// //                   <button
// //                     key={index}
// //                     onClick={() => setCurrentSlide(index)}
// //                     className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                       currentSlide === index
//                         ? "bg-gradient-to-r from-blue-600 to-purple-600"
//                         : "bg-gray-300 hover:bg-gray-400"
//                     }`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
