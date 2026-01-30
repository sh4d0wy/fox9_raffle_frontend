import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Navbar } from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { Toaster } from 'sonner'

const RootLayout = () => (
  <>
    <Navbar/>
    <Outlet />
    <Footer/>
    <Toaster 
      position="top-right"
      richColors
      expand={false}
      visibleToasts={5}
      gap={12}
      toastOptions={{
        style: {
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    />
  </>
)

export const Route = createRootRoute({ component: RootLayout })