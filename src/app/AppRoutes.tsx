import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import { RootLayout } from '@/components/layout'
import { routes, servicePath } from '@/config/routes'
import { services } from '@/config/services'
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'

/** Home is eager (it's the landing page); every other route is code-split with React.lazy. */
const BrandPage = lazy(() => import('@/pages/brand').then((module) => ({ default: module.BrandPage })))
const ServicePage = lazy(() => import('@/pages/service').then((module) => ({ default: module.ServicePage })))

/** One explicit route per service, so an unknown /services/… URL falls through to the 404 page. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path={routes.home} element={<HomePage />} />
        <Route path={routes.brand} element={<BrandPage />} />
        {services.map((service) => (
          <Route key={service.slug} path={servicePath(service.slug)} element={<ServicePage service={service} />} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
