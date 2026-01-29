
type PrimaryButtonProps = {
  className?: string
  text: string | React.ReactNode
  disabled?: boolean
  onclick?: () => void
}   

export const PrimaryButton = ({ text,className, onclick, disabled }: PrimaryButtonProps) => {
  return (
    <button onClick={onclick} disabled={disabled} className={`h-11 cursor-pointer text-base font-semibold hover:bg-primary-color/80 hover:text-black/80 font-inter transition duration-300 bg-primary-color px-6 py-2.5  rounded-full text-black-1000 inline-flex justify-center items-center gap-2.5 ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>{text}</button>
  )
}
