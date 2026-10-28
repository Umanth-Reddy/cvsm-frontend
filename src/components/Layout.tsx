import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from './ui/Footer'
import { Navbar } from './ui/Navbar'

// A file dropped outside a drop target would make the browser open it and discard the loaded audio.
const ignore = (e: DragEvent) => e.preventDefault()

export function Layout() {
  useEffect(() => {
    window.addEventListener('dragover', ignore)
    window.addEventListener('drop', ignore)
    return () => {
      window.removeEventListener('dragover', ignore)
      window.removeEventListener('drop', ignore)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
