"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "../../../styles/styles"

// Using images from the same theme family
const sliderImages = [
  "https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg",
  "https://themes.rslahmed.dev/rafcart/assets/images/banner-1.jpg",
  "https://themes.rslahmed.dev/rafcart/assets/images/banner-3.jpg",
]

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1))
  }

  return (
    <div className="relative min-h-[70vh] 800px:min-h-[80vh] w-full overflow-hidden">
      {/* Slider images */}
      <div
        className="absolute inset-0 w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`min-w-full h-full bg-cover bg-center bg-no-repeat ${styles.normalFlex}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* Content overlay - Only Shop Now button */}
      <div className={`${styles.section} relative mt-96 z-10 w-[90%] 800px:w-[60%] h-full flex flex-col justify-center items-center`}>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button}`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">Shop Now</span>
          </div>
        </Link>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 backdrop-blur-sm p-2 rounded-full hover:bg-white/50 transition-colors"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 backdrop-blur-sm p-2 rounded-full hover:bg-white/50 transition-colors"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-800"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? "bg-black" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Hero

