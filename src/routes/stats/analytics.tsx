import AverageTicketsChart from '@/components/stats/AverageTicketsChart'
import DailyRafflesChart from '@/components/stats/DailyRafflesChart'
import PurchasesChart from '@/components/stats/PurchasesChart'
import RaffleTypeChart from '@/components/stats/RaffleTypeChart'
import UniqueBuyersChart from '@/components/stats/UniqueBuyersChart'
import USDVolumeChart from '@/components/stats/USDVolumeChart'
import { createFileRoute } from '@tanstack/react-router'
import { useAnalyticsStats } from 'hooks/stats/useAnalyticsStats'
import { useState } from 'react'
import { motion } from 'motion/react';

export const Route = createFileRoute('/stats/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  const [timeframe, setTimeframe] = useState<'day'|'week'|'month'|'year'>('week')
  const { volume, raffles, purchases, averageTickets, uniqueBuyers, raffleType } = useAnalyticsStats({ timeframe: 'week' })

  return (
     <main className='w-full bg-black-1400'>
        <motion.section 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.3 }}
        className='w-full md:pt-48 pt-36 pb-[100px]'>
                <div className="w-full max-w-[1440px] px-5 mx-auto">
                    <div className="pb-12">
                    <h1 className='text-[28px] font-semibold text-white font-inter'>Raffle Analytics</h1>
                    </div>

                    <div className="w-full lg:flex-nowrap flex-wrap flex gap-5">
                        <div className="lg:flex-1 w-full max-w-full">
                        <USDVolumeChart
                        data={volume.data?.data || []}
                        timeframe={volume.data?.timeframe || 'day'}
                        isLoading={volume.isLoading}
                        />
                        </div>
                        <div className="lg:flex-1 lg:w-auto w-full lg:max-w-[435px] max-w-full">
                            <DailyRafflesChart
                            data={raffles.data?.data || []}
                            isLoading={raffles.isLoading}
                            />
                        </div>
                    </div>

                    <div className="w-full grid lg:grid-cols-2 gap-5 py-10">
                        <PurchasesChart
                        data={purchases.data?.data || []}
                        isLoading={purchases.isLoading}
                        />
                        <AverageTicketsChart
                        data={averageTickets.data?.data || []}
                        timeframe={averageTickets.data?.timeframe || 'day'}
                        isLoading={averageTickets.isLoading}
                        />
                    </div>

                      <div className="w-full lg:flex-nowrap flex-wrap flex gap-5">
                      <div className="lg:flex-1 lg:w-auto w-full lg:max-w-[435px] max-w-full">
              <UniqueBuyersChart
                data={uniqueBuyers.data?.data || []}
                totalUniqueBuyers={uniqueBuyers.data?.totalUniqueBuyers || 0}
                timeframe={uniqueBuyers.data?.timeframe || 'day'}
                isLoading={uniqueBuyers.isLoading}
              />
            </div>
                        <div className="lg:flex-1 lg:w-auto w-full">
                            <RaffleTypeChart
                            data={raffleType.data?.data || { nft: { percentage: 0, volume: 0 }, token: { percentage: 0, volume: 0 } }}
                            totalVolume={raffleType.data?.totalVolume || 0}
                            timeframe={raffleType.data?.timeframe || 'day'}
                            isLoading={raffleType.isLoading}
                            />
                        </div>
                    </div>



                </div>
        </motion.section>
    </main>
  )
}
