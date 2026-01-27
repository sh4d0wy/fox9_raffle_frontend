interface FeaturedTitleProps {
  title: string;
  className?: string;
}

export default function GradientText({ title, className }: FeaturedTitleProps) {
  return (
    <h2 className={`font-semibold font-inter text-center bg-linear-to-b from-white/[40%] to-primary-color/[40%] bg-clip-text text-transparent ${className}`}>
      {title}
    </h2>
  );
}