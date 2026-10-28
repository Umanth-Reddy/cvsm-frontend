import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import About from './pages/About'
import Compare from './pages/Compare'
import Evaluation from './pages/Evaluation'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import NotFound from './pages/NotFound'
import Results from './pages/Results'

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
          <Route path="gallery" element={<Gallery />} />
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
