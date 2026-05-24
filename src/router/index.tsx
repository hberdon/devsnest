import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from '@/App'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const ToolPage  = lazy(() => import('@/pages/ToolPage'))

function PageLoader() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--color-muted)', fontSize: 15 }}>
      Cargando…
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <ErrorBoundary><Suspense fallback={<PageLoader />}><Dashboard /></Suspense></ErrorBoundary>,
      },
      {
        path: 'tools/:id',
        element: <ErrorBoundary><Suspense fallback={<PageLoader />}><ToolPage /></Suspense></ErrorBoundary>,
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}
