import { Link } from "@tanstack/react-router"

type PrimaryLinkProps = {
  link: string
  className?: string
  text: string
}   

export const PrimaryLink2 = ({ link, text,className }: PrimaryLinkProps) => {
  return (
    <Link to={link} className={`h-11 text-base font-medium font-inter transition duration-300 px-6 py-2.5 hover:bg-transparent hover:border-primary-color hover:text-primary-color border border-transparent bg-primary-color rounded-full text-black-1000 inline-flex justify-center items-center gap-2.5 ${className}`}>{text}</Link>
  )
}
