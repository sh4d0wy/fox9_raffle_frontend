import FeaturedSwiper from '@/components/home/FeaturedSwiper'
import { ToolsSection } from '@/components/home/ToolsSection'
import { TryToolsSection } from '@/components/home/TryToolsSection'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage(){
  return (
    <motion.main 
    className="flex-1 font-inter bg-black-1100">
          <motion.section 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.5 }}
          className="w-full relative z-20 md:pt-48 pt-36">
        
            <div className="w-full max-w-[1440px] md:px-5 px-4 mx-auto">
              
              <div className="p-10 pb-2 md:pt-10 pt-5 px-0  relative">
          
                <div className="relative">
                <div className='absolute lg:-right-6 right-auto left-0 lg:top-[-200px] bottom-20 -z-10 flex items-center justify-center'>
                  <img src="/images/hero-pattern.png" className='lg:w-[1000px] w-full' alt="no-img" />
                  <div className="bg-yellow-1000 w-[300px] h-[300px] absolute blur-[200px] md:-mr-28 opacity-60"></div>
                </div>
              
                <FeaturedSwiper />

                </div>

              </div>
            </div>
          </motion.section>

          <motion.section
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 200 }}
          transition={{ duration: 0.7 }}
          className='w-full md:pt-8 pb-12'>
            <div className="w-full">
              <div className="max-w-[1360px] w-full mx-auto relative xl:pl-12 pl-6 pr-6">
                <div className="flex-1 flex flex-col lg:gap-16 gap-10">
                <div className="flex items-center md:flex-row flex-col justify-between md:gap-[50px] gap-6">
                  <div className="inline-flex items-center md:flex-row flex-col md:gap-[30px] gap-4">
                  <div className="flex items-center gap-4">
                  <img src="/icons/lock-icon.svg" alt="" />
                  <h3 className='text-[30px] font-museo-moderno font-medium text-white-1100'>Encrypted Security</h3>
                  </div>
                  <div className="flex-1 md:max-w-[360px] max-w-[90%]">
                  <p className='text-xl lg:text-start text-center text-gray-1200 font-museo-moderno'>Our platform has a strict security system that is safe from name theft.</p>
                  </div>
                  </div>
                  <img src="/images/line-style-1.png" alt="" />
                </div>

                <div className="flex items-center md:flex-row flex-col justify-between lg:gap-[50px] gap-6">
                  <img src="/images/line-style-1.png" className='order-2 md:order-1' alt="" />
                  <div className="flex items-center justify-end w-fit md:flex-row order-1 md:order-2 flex-col lg:max-w-[66.6%] max-w-[90%] md:gap-[30px] gap-4">
                  <div className="flex items-center gap-4">
                  <img src="/icons/wallet-icon.svg" alt="" />
                  <h3 className='text-[30px] font-museo-moderno font-medium text-white-1100'>Fast Transaction</h3>
                  </div>
                  <div className="md:max-w-[50%]">
                  <p className='text-xl lg:text-start text-center text-gray-1200 font-museo-moderno'>We have an easy, fast, and certainly not complicated purchase transaction flow.</p>
                  </div>
                  </div>
                </div>

                </div>
            </div>
            </div>
          </motion.section>

          <TryToolsSection />

          <ToolsSection />
    </motion.main>
  )
}