import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const RootLayout = () => (
  <>
    <Navbar/>
    <Outlet />
    <Footer/>
  </>
)

export const Route = createRootRoute({ component: RootLayout })