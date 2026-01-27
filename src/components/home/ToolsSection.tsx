import { toolsData } from "../../../data/tools-data";
import ToolCard from "../../components/home/ToolCard";

export const ToolsSection = () => {
  return (
    <section className="w-full">
      <div className="w-full max-w-[1440px] md:px-[52px] px-4 pt-5 pb-11 md:py-12 mx-auto">
        <div className="w-full grid md:grid-cols-4 lg:gap-10 gap-[32px] md:gap-5">
          {toolsData.map((tool) => (
            <ToolCard
              key={tool.id}
              imageSrc={tool.imageSrc}
              title={tool.title}
            />
          ))}
        </div>
      </div>
      <div className="absolute -bottom-[150%] lg:block hidden z-0 left-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="1784" viewBox="0 0 1365 1784" fill="none">
          <g filter="url(#filter0_f_298_164)">
            <path d="M444.333 861.798C697.293 745.427 670.57 980.243 656.158 1083.67L-43.4536 1073.11C-57.4074 936.004 7.93945 688.347 90.0648 700.426C300.481 731.373 217.925 965.954 444.333 861.798Z" fill="#FFD400" fillOpacity="0.64" />
          </g>
          <defs>
            <filter id="filter0_f_298_164" x="-745.34" y="0" width="2110.12" height="1783.67" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="350" result="effect1_foregroundBlur_298_164" />
            </filter>
          </defs>
        </svg>
      </div>
    </section>
  );
};
