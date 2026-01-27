import { Dialog, DialogPanel } from "@headlessui/react";
import FormInput from "../ui/FormInput";
import { useState } from "react";
import { RadioGroupFluid } from "../ui/RadioGroupFluid";

interface SettingsModelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModel({ isOpen, onClose }: SettingsModelProps) {
  const [Priority, setPriority] = useState("auto");
  const [SolValue, setSolValue] = useState("0.08823");


  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-50 focus:outline-none bg-black/80"
      onClose={onClose}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/80">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-[446px] rounded-xl pb-4 bg-black-1300 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <div className="flex items-center justify-between border-b border-gray-1400 px-[22px] pt-6 pb-4 mb-6">
              <h4 className="text-lg text-white font-semibold font-inter">Settings</h4>
              <button
                onClick={onClose}
                className="flex items-center justify-center cursor-pointer hover:scale-110 transition duration-300"
              >
                <img src="/icons/cross-icon-2.svg" className="w-6" alt="cross" />
              </button>
            </div>

            <div className="w-full px-5">
              <p className="text-sm text-white font-inter mb-10">
                If you're experiencing slow transactions, you can try increasing your priority fee
              </p>

              <div className="w-full">
                <h4 className="text-base font-semibold font-inter text-white mb-4">
                  Transaction Priority
                </h4>

                <div className="w-full mb-6 flex-1">
                  <RadioGroupFluid
                    name="Priority"
                    value={Priority}
                    onChange={setPriority}
                    options={[
                      { label: "Auto", value: "auto" },
                      { label: "Manual", value: "manual" },
                    ]}
                  />

                  <div className="w-full mt-6">
                    <h4 className="text-base font-semibold mb-4 font-inter text-white">
                      Max Priority Fee (SOL)
                    </h4>
                    <div className="w-full relative">
                    <FormInput value={SolValue} onChange={(e)=> setSolValue(e.target.value)} className="pr-16!" label="Your priority fee will not exceed this amount on each transaction" placeholder="0.08823" type="number" />
                    <span aria-readonly="true" className="text-base text-gray-1200 font-medium top-16 font-inter absolute right-4">SOL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
