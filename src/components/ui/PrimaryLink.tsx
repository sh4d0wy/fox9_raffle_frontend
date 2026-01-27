import { Link } from "@tanstack/react-router"

type PrimaryLinkProps = {
  link: string
  className?: string
  text: string
}   

export const PrimaryLink = ({ link, text,className }: PrimaryLinkProps) => {
  return (
    <Link to={link} className={`h-11 text-base font-medium font-inter transition duration-300 px-6 py-2.5 bg-linear-to-r from-neutral-800 via-neutral-500 to-neutral-800 hover:from-primary-color hover:via-primary-color hover:to-primary-color rounded-full text-white inline-flex justify-center items-center gap-2.5 ${className}`}>{text}</Link>
  )
}
