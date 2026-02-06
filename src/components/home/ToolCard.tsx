import { Link, useNavigate } from "@tanstack/react-router";

interface ToolCardProps {
  imageSrc: string;
  title: string;
  url: string;
}

export default function ToolCard({ imageSrc, title, url }: ToolCardProps) {
  const navigate = useNavigate();
  return (
    <div>
    <div className="relative z-10">
      <img
        src={imageSrc}
        alt={title}
        className="w-full md:h-full object-cover transition-transform duration-500 rounded-[20px]"
      />
      <button onClick={()=>navigate({ to: url })} className="flex cursor-pointer items-center w-full mt-3">
        <div>
          <img src="/icons/left-angle.svg" alt="" />
        </div>
        <div className="px-[30px] -mx-3 flex-1 py-2  bg-primary-color rounded-lg  duration-500 flex items-center md:w-auto w-full justify-center ">
          <p className="text-black-1000 text-base font-inter font-semibold">
            {title}
          </p>
        </div>
        <div>
          <img src="/icons/right-angle.svg" alt="" />
        </div>
      </button>
    </div>
    </div>
  );
}
