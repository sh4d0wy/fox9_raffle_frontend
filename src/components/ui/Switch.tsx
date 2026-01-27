import { Switch } from '@headlessui/react'

interface InputSwitchProps {
  checked: boolean
  onChange: (value: boolean) => void
  className?: string
  trackClass?: string
  knobClass?: string
}

export default function InputSwitch({
  checked,
  onChange,
  className = "",
  trackClass = "",
  knobClass = "",
}: InputSwitchProps) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`group relative inline-flex h-[22px] min-w-10 cursor-pointer rounded-full p-[2px]
                  bg-gray-1700 transition-colors duration-300 
                  data-checked:bg-primary-color focus:outline-none ${className} ${trackClass}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-[18px] w-[18px] translate-x-0 
                    rounded-full bg-black-1300 shadow-md ring-0 
                    transition-transform duration-300 ease-in-out
                    group-data-checked:[transform:translateX(18px)]
                    ${knobClass}`}
      />
    </Switch>
  )
}
