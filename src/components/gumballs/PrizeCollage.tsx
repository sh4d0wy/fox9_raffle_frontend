import React, { useMemo } from "react";

interface Prize {
  image?: string;
  isNft?: boolean;
  name?: string;
}

interface PrizeCollageProps {
  prizes: Prize[];
  className?: string;
  rotation?: number;
  gridSize?: number;
}


export const PrizeCollage: React.FC<PrizeCollageProps> = ({
  prizes,
  className = "",
  rotation = -45,
  gridSize = 3,
}) => {
  const prizeImages = useMemo(() => {
    const images = prizes
      .filter((prize) => prize.image)
      .map((prize) => prize.image as string);
    
    if (images.length === 0) {
      return ["/fox-logo.png"];
    }
    
    return images;
  }, [prizes]);

  const tiles = useMemo(() => {
    const expandedSize = gridSize + 2;
    const totalTiles = expandedSize * expandedSize;
    const tileArray: { image: string; key: string }[] = [];
    
    for (let i = 0; i < totalTiles; i++) {
      tileArray.push({
        image: prizeImages[i % prizeImages.length],
        key: `tile-${i}`,
      });
    }
    
    return tileArray;
  }, [prizeImages, gridSize]);

  const gridCols = gridSize + 2;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `rotateX(45deg) rotateZ(${rotation}deg) rotateY(15deg) scale(1.8)`,
        }}
      >
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gridAutoRows: "1fr",
            width: "150%",
            height: "110%",
          }}
        >
          {tiles.map((tile) => (
            <div
              key={tile.key}
              className="aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={tile.image}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fox-logo.png";
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
    </div>
  );
};

