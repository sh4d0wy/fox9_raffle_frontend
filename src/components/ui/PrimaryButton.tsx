
type PrimaryButtonProps = {
  className?: string
  text: string
  onclick?: () => void
}   

export const PrimaryButton = ({ text,className, onclick }: PrimaryButtonProps) => {
  return (
    <button onClick={onclick} className={`h-11 cursor-pointer text-base font-semibold hover:bg-transparent hover:text-primary-color border border-primary-color hover:border-primary-color font-inter transition duration-300 bg-primary-color px-6 py-2.5  rounded-full text-black-1000 inline-flex justify-center items-center gap-2.5 ${className}`}>{text}</button>
  )
}
