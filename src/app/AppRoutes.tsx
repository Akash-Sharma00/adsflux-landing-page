import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import { RootLayout } from '@/components/layout'
import { routes } from '@/config/routes'
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'

/** Home is eager (it's the landing page); every other route is code-split with React.lazy. */
const BrandPage = lazy(() => import('@/pages/brand').then((module) => ({ default: module.BrandPage })))

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path={routes.home} element={<HomePage />} />
        <Route path={routes.brand} element={<BrandPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
