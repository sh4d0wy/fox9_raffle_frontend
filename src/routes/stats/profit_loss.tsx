/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from '@tanstack/react-router'
import Dropdown from '../../components/ui/Dropdown';
import InputCheckbox from '../../components/ui/Checkbox';
import { BoughtTable } from '../../components/stats/BoughtTable';
import { SoldTable } from '../../components/stats/SoldTable';
import {yearsOptions} from '../../../data/years-option'
import { useFiltersStore } from '../../../store/profit_loss-store';
import { SummaryCard } from '@/components/stats/SummaryCard';
import { usePnlStats } from 'hooks/stats/usePnlStats';
import { useWallet } from '@solana/wallet-adapter-react';

export const Route = createFileRoute('/stats/profit_loss')({
  component: ProfitLoss,
})

const lamportsToSol = (lamports: number) => lamports;


function ProfitLoss() {
  const timeframe = useFiltersStore((s) => s.timeframe);
  const setTimeframe = useFiltersStore((s) => s.setTimeframe);
  const year = useFiltersStore((s) => s.year);
  const setYear = useFiltersStore((s) => s.setYear);
  console.log("timeframe", timeframe);
  const { boughtPnl, soldPnl } = usePnlStats({timeframe, year});
  const { publicKey } = useWallet();
  const boughtSummary = boughtPnl.data?.summary 
    ? [
        { label: timeframe === "daily" ? "Month" : "Year", value: boughtPnl.data.summary.label || "-" },
        { label: "Spent", value: `${boughtPnl.data.summary.totalSpent ?? 0} USDT ` },
        { label: "Total won", value: `${boughtPnl.data.summary.totalWon ?? 0} USDT ` },
        { label: "P&L", value: `${boughtPnl.data.summary.pnl ?? 0} USDT ` },
        { label: "ROI", value: boughtPnl.data.summary.roi || "0%" },
      ]
    : [
        { label: timeframe === "daily" ? "Month" : "Year", value: "-" },
        { label: "Spent", value: "0 USDT " },
        { label: "Total won", value: "0 USDT " },
        { label: "P&L", value: "0 USDT " },
        { label: "ROI", value: "0%" },
      ];

      const soldSummary = soldPnl.data?.summary
      ? [
          { label: timeframe === "daily" ? "Month" : "Year", value: soldPnl.data.summary.label || "-" },
          { label: "Cost", value: `${parseFloat(lamportsToSol(soldPnl.data.summary.totalCost ?? 0).toFixed(6))} USDT ` },
          { label: "Total sold", value: `${parseFloat(lamportsToSol(soldPnl.data.summary.totalSold ?? 0).toFixed(6))} USDT ` },
          { label: "P&L", value: `${parseFloat(lamportsToSol(soldPnl.data.summary.pnl ?? 0).toFixed(6))} USDT ` },
          { label: "ROI", value: soldPnl.data.summary.roi || "0%" },
        ]
      : [
          { label: timeframe === "daily" ? "Month" : "Year", value: "-" },
          { label: "Cost", value: "0 USDT " },
          { label: "Total Sold", value: "0 USDT " },
          { label: "P&L", value: "0 USDT " },
          { label: "ROI", value: "0%" },
        ];

  const boughtTableData = boughtPnl.data?.data?.map((item: any) => ({
    date: item.date,
    spent: item.spent,
    won: item.won,
    pl: item.pnl,
    roi: item.roi,
  })) || [];

  const soldTableData = soldPnl.data?.data?.map((item: any) => ({
    date: item.date,
    spent: lamportsToSol(item.cost),
    sold: lamportsToSol(item.sold),
    pl: lamportsToSol(item.pnl),
    roi: item.roi,
  })) || [];
  


  return (
       <main className='w-full bg-black-1400'>
        <section className='w-full md:pt-48 pt-36 pb-[100px]'>
                <div className="w-full max-w-[1440px] px-5 mx-auto">
                    <div className="w-full flex md:flex-nowrap flex-wrap md:gap-0 gap-4 items-center justify-between mb-12">
                        <div className="">
                        <h1 className='text-[28px] font-semibold text-white font-inter'>Raffle Profit/Loss</h1>
                        </div>

                        {/* <label htmlFor="file" className='border group transition hover:bg-white hover:text-black-1300 cursor-pointer md:text-base text-sm text-white text-center font-semibold font-inter border-white rounded-full px-6 py-3'>
                        <input type="file" hidden name="file" id="file" />
                        <div className="flex items-center gap-2.5">
                            <img src="/icons/export-icon.svg" className='invert group-hover:invert-0' alt="" />
                            <span>Export as CSV</span>
                        </div>
                        </label> */}



                    </div>

                    <div className="w-full py-4 border-y border-primary-color/50">
                        <div className="w-full flex items-center md:gap-0 gap-5 md:flex-nowrap flex-wrap max-w-[1078px]">
                        <div className="flex-1">
                        <p className='text-sm text-gray-1200 font-medium font-inter mb-6'>Timeframe</p>
                        <div className="w-full flex items-center">
                        <div className="w-full md:flex-nowrap flex-wrap md:gap-5 gap-5 flex items-center">

                            <ul className="flex items-center gap-3 bg-black-1000 rounded-full p-1">
                                {["Daily", "Monthly", "Yearly"].map((t) => (
                                    <li key={t.toLowerCase()}>
                                        <button
                                        className={`md:text-base text-sm cursor-pointer font-inter font-medium transition duration-300 hover:bg-primary-color hover:text-black-1000 text-white rounded-full py-3.5 px-5 ${
                                            timeframe === t.toLowerCase() ? "bg-primary-color !text-black-1000" : ""
                                        }`}
                                        onClick={() => setTimeframe(t.toLowerCase() as any)}
                                        >
                                        {t}
                                        </button>
                                    </li>
                                    ))}
                            </ul>

                            <Dropdown
                                options={yearsOptions}
                                value={{ label: year.toString(), value: year.toString() }}
                                onChange={(value) => {
                                  setYear(parseInt(value.value));
                              }}
                                />
                                </div>
                            </div>
                            </div>
                        </div>
                   </div>

                   {publicKey && (
                    <>
                   <div className="w-full pt-10 grid md:grid-cols-2 gap-5 pb-10">
                    <SummaryCard title="Bought" items={boughtSummary}   />
                    <SummaryCard title="Sold" items={soldSummary}  />
                    </div>
                    <div className="w-full grid md:grid-cols-2 gap-5 pb-10">
                    <BoughtTable data={boughtTableData} isLoading={boughtPnl.isLoading} />
                    <SoldTable data={soldTableData} isLoading={soldPnl.isLoading} />
                    </div>
                    </>
                    )}
                    {!publicKey && (
                    <div className="w-full flex items-center justify-center">
                    <h4 className="md:text-base text-sm text-white px-5 py-19 w-full text-center rounded-lg border border-gray-1200 font-medium font-inter">Please connect your wallet to view your profit/loss</h4>
                    </div>
                    )}
                </div>

        </section>

        </main>
  )
}
