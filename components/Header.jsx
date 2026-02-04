import React from 'react'

export default function Header() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow">
        Header
      </header>

      <div aria-hidden="true">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16" />
        </div>
      </div>
    </>
  )
}
