import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import About from './pages/About'
import Compare from './pages/Compare'
import Evaluation from './pages/Evaluation'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import NotFound from './pages/NotFound'
import Results from './pages/Results'

const Improvements = lazy(() => import('./pages/Improvements'))

// Dev-only: the guard is a build-time constant, so production bundles drop the page.
const Design = import.meta.env.DEV ? lazy(() => import('./pages/Design')) : null

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="compare" element={<Compare />} />
          <Route path="results" element={<Results />} />
          <Route
            path="improvements"
            element={
              <Suspense fallback={<p className="container-page py-12 text-muted" role="status">Loading the study…</p>}>
                <Improvements />
              </Suspense>
            }
          />
          <Route path="gallery" element={<Navigate to="/improvements" replace />} />
          <Route path="evaluation" element={<Evaluation />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="about" element={<About />} />
          {Design && (
            <Route
              path="design"
              element={
                <Suspense fallback={null}>
                  <Design />
                </Suspense>
              }
            />
          )}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
