/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from '@tanstack/react-router'
import Dropdown from '../../components/ui/Dropdown';
import InputCheckbox from '../../components/ui/Checkbox';
import { BoughtTable } from '../../components/stats/BoughtTable';
import { SoldTable } from '../../components/stats/SoldTable';
import {yearsOptions} from '../../../data/years-option'
import { useFiltersStore } from '../../../store/profit_loss-store';
import { SummaryCard } from '@/components/stats/SummaryCard';

export const Route = createFileRoute('/stats/profit_loss')({
  component: ProfitLoss,
})



const boughtSummary = [
  { label: "Month", value: "Oct '25" },
  { label: "Total spent", value: "$120" },
  { label: "Total won", value: "$300" },
  { label: "P&L", value: "$180" },
  { label: "ROI", value: "150%" },
];

const soldSummary = [
  { label: "Month", value: "Oct '25" },
  { label: "Total spent", value: "$200" },
  { label: "Total won", value: "$250" },
  { label: "P&L", value: "$50" },
  { label: "ROI", value: "25%" },
];



function ProfitLoss() {
const timeframe = useFiltersStore((s) => s.timeframe);
  const setTimeframe = useFiltersStore((s) => s.setTimeframe);

  const services = useFiltersStore((s) => s.services);
  const toggleService = useFiltersStore((s) => s.toggleService);

  const currency = useFiltersStore((s) => s.currency);
  const setCurrency = useFiltersStore((s) => s.setCurrency);



  return (
       <main className='w-full bg-black-1400'>
        <section className='w-full md:pt-48 pt-36 pb-[100px]'>
                <div className="w-full max-w-[1440px] px-5 mx-auto">
                    <div className="w-full flex md:flex-nowrap flex-wrap md:gap-0 gap-4 items-center justify-between mb-12">
                        <div className="">
                        <h1 className='text-[28px] font-semibold text-white font-inter'>Leaderboard</h1>
                        <p className='text-base text-cream-1000 font-inter'>Track your trading performance</p>
                        </div>

                        <label htmlFor="file" className='border group transition hover:bg-white hover:text-black-1300 cursor-pointer md:text-base text-sm text-white text-center font-semibold font-inter border-white rounded-full px-6 py-3'>
                        <input type="file" hidden name="file" id="file" />
                        <div className="flex items-center gap-2.5">
                            <img src="/icons/export-icon.svg" className='invert group-hover:invert-0' alt="" />
                            <span>Export as CSV</span>
                        </div>
                        </label>



                    </div>

                    <div className="w-full py-4 border-y border-primary-color/50">
                        <div className="w-full flex items-center md:gap-0 gap-5 md:flex-nowrap flex-wrap max-w-[1078px]">
                        <div className="flex-1">
                        <p className='text-sm text-gray-1200 font-medium font-inter mb-6'>Timeframe</p>
                        <div className="w-full flex items-center">
                        <div className="w-full md:flex-nowrap flex-wrap md:gap-5 gap-5 flex items-center">

                            <ul className="flex items-center gap-3 bg-black-1000 rounded-full p-1">
                                {["Daily", "Monthly", "Yearly"].map((t) => (
                                    <li key={t}>
                                        <button
                                        className={`md:text-base text-sm cursor-pointer font-inter font-medium transition duration-300 hover:bg-primary-color hover:text-black-1000 text-white rounded-full py-3.5 px-5 ${
                                            timeframe === t ? "bg-primary-color !text-black-1000" : ""
                                        }`}
                                        onClick={() => setTimeframe(t as any)}
                                        >
                                        {t}
                                        </button>
                                    </li>
                                    ))}
                            </ul>

                            <Dropdown
                                options={yearsOptions}
                                value={{ label: "2025", value: "2025" }}
                                onChange={(value) => {
                                console.log("Selected option:", value);
                                }}
                                />
                                </div>
                            </div>
                        </div>

                        <div className="h-[76px] md:block hidden md:border-r border-primary-color mx-14"></div>

                        <div className="w-full">
                        <p className='text-sm text-gray-1200 font-medium font-inter mb-6'>Currency</p>
                                <ul className="inline-flex items-center gap-2 bg-black-1000 rounded-full p-1">
                               {["Raffle", "Gumball"].map((c) => (
                                    <li key={c}>
                                        <button
                                        className={`md:text-base text-sm cursor-pointer font-inter font-medium transition duration-300 hover:bg-primary-color hover:text-black-1000 text-white rounded-full py-3.5 px-5 ${
                                            currency === c ? "bg-primary-color text-black-1000!" : ""
                                        }`}
                                        onClick={() => setCurrency(c as any)}
                                        >
                                        {c}
                                        </button>
                                    </li>
                                    ))}
                            
                            </ul>
                        

                        </div>

                        <div className="h-[76px]  md:block hidden md:border-r border-primary-color mx-14"></div>

                     <div className="flex flex-col h-full mb-auto">
                        <p className='text-sm text-gray-1200 font-medium font-inter mb-10'>Service</p>
                        <ul className="flex items-center gap-5 ">

                             {services.map((s) => (
                                <li key={s.name}>
                                    <InputCheckbox
                                    label={s.name}
                                    checked={s.active}
                                    onChange={(val) => toggleService(s.name, val)}
                                    />
                                </li>
                                ))}
                            </ul>
                            
                        </div>

                    </div>

                   </div>

                   <div className="w-full pt-10 grid md:grid-cols-2 gap-5 pb-10">
                    <SummaryCard title="Bought" items={boughtSummary} />
                    <SummaryCard title="Sold" items={soldSummary} />
                    </div>

                    <div className="w-full grid md:grid-cols-2 gap-5 pb-10">
                    <BoughtTable/>
                    <SoldTable/>
                    </div>

                </div>

        </section>

        </main>
  )
}
