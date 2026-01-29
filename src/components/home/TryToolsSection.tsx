import GradientText from "../common/GradientText";

export const TryToolsSection = () => {
  return (
    <section className="w-full pb-6 pt-[51px] md:pt-16 relative">
      <div className="w-full max-w-[1440px] px-5 mx-auto">
        <div className="flex flex-col items-center justify-center">
          <GradientText
            title="Explore LUCKIT"
            className="2xl:text-[120px] md:pb-0 text-[54px] md:text-[66px] lg:text-[100px] leading-[116%]"
          />
          <p
            className="md:text-base text-sm absolute bottom-0 font-semibold font-inter bg-gray-1400 py-2.5 md:py-3 px-8 text-black-1000 text-center inline-flex rounded-full md:max-w-full max-w-[361px]"
          >
              Look into other sections 
          </p>
        </div>
      </div>
    </section>
  );
};
