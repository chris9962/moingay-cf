"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { usePathname } from "next/navigation"

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setIsSearchOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Determine header background and text colors based on page and scroll state
  const headerBg = isHomePage
    ? scrolled
      ? "bg-[#1A1A1AC7]"
      : "bg-gradient-to-b from-black/70 to-transparent"
    : "bg-[#F9F7F7CC]"

  // Text color - dark on light background (non-home pages), white on dark background (home page)
  const textColor = isHomePage ? "text-white" : "text-[#363737]"
  const hoverColor = isHomePage ? "hover:text-primary" : "hover:text-[#1A1A1A]"

  return (
    <header
      className={`${
        isHomePage ? (scrolled ? "fixed top-0 shadow-md" : "absolute top-0") : "sticky top-0 shadow-sm"
      } ${headerBg} w-full z-50 transition-all duration-300`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className={`text-2xl font-bold ${textColor}`}>
          mõingày
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/about-us" className={`${textColor} ${hoverColor} transition-colors`}>
            VỀ CHÚNG MÌNH
          </Link>
          <Link href="/products" className={`${textColor} ${hoverColor} transition-colors`}>
            SẢN PHẨM
          </Link>
          <Link href="/workshop" className={`${textColor} ${hoverColor} transition-colors`}>
            WORKSHOP
          </Link>
        </nav>

        {/* Search Icon */}
        <button
          onClick={toggleSearch}
          className={`p-2 ${textColor} ${hoverColor} transition-colors`}
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            ref={searchRef}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
