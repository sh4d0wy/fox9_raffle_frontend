import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/not-found')({
  component: PageNotFound,
})

function PageNotFound() {
  return (
     <div className="flex items-center flex-col justify-center h-[calc(100vh-64px)] w-full">
         <img src="/not-found-img.png" alt="Logo" className="w-44  mb-2"/>
         <h1 className="text-6xl font-bold">404</h1>
         <p className="text-2xl my-2">Page Not Found!</p>
         <Link to="/" className="my-3 bg-primary-color text-white px-6 py-1.5 rounded-lg no-underline transition duration-300 hover:opacity-90">Go Home</Link>
     </div>
   )
}
