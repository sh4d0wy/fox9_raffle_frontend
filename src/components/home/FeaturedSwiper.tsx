import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useFeaturedRafflesStore } from "../../../store/featured-raffles-store";
import { ArrowRightIcon } from "lucide-react";

const FeaturedSwiper = () => {
  const { raffles, fetchRaffles } = useFeaturedRafflesStore();

  useEffect(() => {
    fetchRaffles();
  }, [fetchRaffles]);

  return (
    <div className="w-full relative z-10 lg:-mt-[50px] -mt-6 md:-mt-3.5 px-4 md:pl-16">
      <div className="flex lg:flex-nowrap flex-wrap items-center">
        <div className="lg:w-1/2 w-full">
          <div className="max-w-[588px]">
            <h1 className="md:text-[120px] sm:text-[64px] text-5xl md:mt-0 mt-5 font-semibold mb-5 leading-[116%] text-white">LUCKIT </h1>
            <p className="md:text-xl text-base md:mb-12 mb-5 font-normal text-cream-1000">There are a thousand more NFTs that interest you, find and collect what you like!</p>
           <div className="flex items-center gap-5">
            <a 
              href="#raffles" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('raffles')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-base group transition hover:bg-primary-color/10 duration-500 font-medium text-yellow-1000 flex items-center justify-center gap-2.5 py-[13px] px-8 border border-yellow-1000 rounded-full max-w-[184px]"
            >
              Explore <ArrowRightIcon/>
            </a>
           </div>
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          <div>
              {/* <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                pagination={{ clickable: true }}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="featured-swiper pb-20! md:pb-14!"
              >
                {raffles.map((card) => (
                  <SwiperSlide key={card.id}> */}
                    <div className="flex-1">
                      <img src="/images/swiper-img.png" alt="" />
                    </div>
                  {/* </SwiperSlide>
                ))}
              </Swiper> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedSwiper;
