import React from 'react'
import churchLogo from '../assets/LOGO.png'

export default function Logo({ src, className = 'h-8 w-8', alt = 'Church Logo', ariaHidden = false }) {
  const imageSrc = src || churchLogo
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`object-contain ${className}`}
      aria-hidden={ariaHidden}
      loading="lazy"
      decoding="async"
    />
  )
}