import { useEffect, useRef, useState, useCallback } from 'react';
import type { PrizeDataBackend } from '../../../types/backend/gumballTypes';

interface Ball {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  image: string;
  isNft: boolean;
  prizeIndex: number;
}

interface AvailablePrize extends PrizeDataBackend {
  remainingQuantity: number;
}

interface GumballBouncingBallsProps {
  prizes: AvailablePrize[];
  isActive: boolean;
  status: string;
  isSpinning?: boolean;
  onSpinComplete?: () => void;
}

export const GumballBouncingBalls = ({ prizes, isActive, status, isSpinning = false, onSpinComplete }: GumballBouncingBallsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const animationFrameRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const calculateBallSize = useCallback((quantity: number, totalQuantity: number, isNft: boolean) => {
    const minSize = 15;
    const maxSize = 40;
    const nftBonus = isNft ? 30 : 0;
    const quantityRatio = quantity / Math.max(totalQuantity, 1);
    const size = minSize + (quantityRatio * (maxSize - minSize - nftBonus)) + nftBonus;
    
    return Math.max(minSize, Math.min(size, maxSize));
  }, []);

  const initializeBalls = useCallback(() => {
    if (!dimensions.width || !dimensions.height) return;

    const totalQuantity = prizes.reduce((sum, p) => sum + p.remainingQuantity, 0);
    const newBalls: Ball[] = [];
    
    prizes.forEach((prize, prizeIndex) => {
      const ballCount = Math.min(prize.remainingQuantity, 15);
      const radius = calculateBallSize(prize.remainingQuantity, totalQuantity, prize.isNft);
      
      for (let i = 0; i < ballCount; i++) {
        const padding = radius + 10;
        newBalls.push({
          id: `${prizeIndex}-${i}`,
          x: padding + Math.random() * (dimensions.width - padding * 2),
          y: padding + Math.random() * (dimensions.height - padding * 2),
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          radius,
          image: prize.image || '/images/gumballs/sol-img-frame.png',
          isNft: prize.isNft,
          prizeIndex,
        });
      }
    });

    ballsRef.current = newBalls;
  }, [prizes, dimensions, calculateBallSize]);

  useEffect(() => {
    const imageUrls = new Set(prizes.map(p => p.image || '/images/gumballs/sol-img-frame.png'));
    
    imageUrls.forEach(url => {
      if (!imagesRef.current.has(url)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        imagesRef.current.set(url, img);
      }
    });
  }, [prizes]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      initializeBalls();
    }
  }, [dimensions, initializeBalls]);

  const spinStartTimeRef = useRef<number>(0);
  const spinCompletedRef = useRef<boolean>(false);
  const originalPositionsRef = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (isSpinning) {
      spinStartTimeRef.current = Date.now();
      spinCompletedRef.current = false;
      originalPositionsRef.current = ballsRef.current.map(ball => ({ x: ball.x, y: ball.y }));
    }
  }, [isSpinning]);

  useEffect(() => {
    if (!canvasRef.current || !dimensions.width || !dimensions.height) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const timeOffsets = ballsRef.current.map(() => Math.random() * Math.PI * 2);
    const orbitRadius = Math.min(dimensions.width, dimensions.height) * 0.35;
    const angleOffsets = ballsRef.current.map((_, index) => (index / ballsRef.current.length) * Math.PI * 2);

    let time = 0;
    const SPIN_DURATION = 5000;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      time += 0.015;

      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      if (isSpinning && !spinCompletedRef.current) {
        const elapsed = Date.now() - spinStartTimeRef.current;
        
        if (elapsed >= SPIN_DURATION) {
          spinCompletedRef.current = true;
          if (onSpinComplete) {
            onSpinComplete();
          }
        }
      }

      ballsRef.current.forEach((ball, index) => {
        const offset = timeOffsets[index];
        
        if (isSpinning && !spinCompletedRef.current) {
          const elapsed = Date.now() - spinStartTimeRef.current;
          const progress = Math.min(elapsed / SPIN_DURATION, 1);
          
          const easeProgress = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
          
          const rotationSpeed = (1 - easeProgress * 0.7) * 12;
          const currentAngle = angleOffsets[index] + time * rotationSpeed;
          
          const currentOrbitRadius = orbitRadius * (0.8 + 0.2 * Math.sin(progress * Math.PI));
          
          ball.x = centerX + Math.cos(currentAngle) * currentOrbitRadius;
          ball.y = centerY + Math.sin(currentAngle) * currentOrbitRadius;
        } else {
          ball.vx = Math.sin(time + offset) * 0.5;
          ball.vy = Math.cos(time * 0.7 + offset) * 0.4;

          ball.x += ball.vx;
          ball.y += ball.vy;

          const padding = ball.radius + 5;
          if (ball.x < padding) {
            ball.x = padding;
          } else if (ball.x > dimensions.width - padding) {
            ball.x = dimensions.width - padding;
          }

          if (ball.y < padding) {
            ball.y = padding;
          } else if (ball.y > dimensions.height - padding) {
            ball.y = dimensions.height - padding;
          }
        }

        ctx.beginPath();
        ctx.arc(ball.x + 3, ball.y + 3, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fill();

        ctx.save();
        
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const img = imagesRef.current.get(ball.image);
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(
            img,
            ball.x - ball.radius,
            ball.y - ball.radius,
            ball.radius * 2,
            ball.radius * 2
          );
        } else {
          const gradient = ctx.createRadialGradient(
            ball.x - ball.radius * 0.3,
            ball.y - ball.radius * 0.3,
            0,
            ball.x,
            ball.y,
            ball.radius
          );
          gradient.addColorStop(0, ball.isNft ? '#ff69b4' : '#ffd700');
          gradient.addColorStop(1, ball.isNft ? '#ff1493' : '#ff8c00');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        ctx.restore();

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        if (isSpinning && !spinCompletedRef.current) {
          ctx.strokeStyle = 'rgba(255, 20, 147, 0.8)';
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = ball.isNft 
            ? 'rgba(255, 20, 147, 0.6)' 
            : 'rgba(200, 200, 200, 0.8)';
          ctx.lineWidth = ball.isNft ? 3 : 2;
        }
        ctx.stroke();

        if (ball.isNft || (isSpinning && !spinCompletedRef.current)) {
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = isSpinning && !spinCompletedRef.current 
            ? 'rgba(255, 20, 147, 0.4)' 
            : 'rgba(255, 20, 147, 0.2)';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      });

      if (!isSpinning || spinCompletedRef.current) {
        for (let i = 0; i < ballsRef.current.length; i++) {
          for (let j = i + 1; j < ballsRef.current.length; j++) {
            const ball1 = ballsRef.current[i];
            const ball2 = ballsRef.current[j];
            
            const dx = ball2.x - ball1.x;
            const dy = ball2.y - ball1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDist = ball1.radius + ball2.radius + 5;

            if (distance < minDist) {
              const angle = Math.atan2(dy, dx);
              const overlap = minDist - distance;
              
              const separationX = (overlap / 2) * Math.cos(angle) * 0.3;
              const separationY = (overlap / 2) * Math.sin(angle) * 0.3;
              
              ball1.x -= separationX;
              ball1.y -= separationY;
              ball2.x += separationX;
              ball2.y += separationY;
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, isSpinning, onSpinComplete]);

  const totalBalls = prizes.reduce((sum, prize) => sum + Math.min(prize.quantity, 15), 0);

  if (!prizes || prizes.length === 0) {
    return (
      <div className="w-full h-[506px] rounded-[20px] bg-white flex items-center justify-center">
        <div className="relative  w-full h-full bg-black/50 flex items-center justify-center z-10 rounded-[20px]">
          <img src="/images/ended-img-1.png" alt="no-prizes" className="w-full h-full object-cover absolute -z-10 rounded-[20px]" />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-[20px]"></div>
          <p className="md:text-[28px] text-lg text-white font-bold font-inter absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">No Prizes Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Gumball machine container */}
      <div 
        ref={containerRef}
        className="relative w-full h-[506px] rounded-[20px] overflow-hidden bg-white"
      >
        {/* Canvas for floating balls */}
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0"
        />

        {/* Inactive overlay */}
        {!isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <p className='md:text-[28px] text-lg text-white font-bold font-inter'>
              {status === "CANCELLED" ? "Cancelled" : (status === "COMPLETED_SUCCESSFULLY" || status === "COMPLETED_FAILED") ? "Sale Ended" : "Not Started"}
            </p>
          </div>
        )}

        {/* Ball count indicator */}
        <div className="absolute top-4 right-4 bg-gray-100 px-3 py-1.5 rounded-full z-20">
          <span className="text-gray-600 text-sm font-inter font-medium">
            {totalBalls} {totalBalls === 1 ? 'prize' : 'prizes'}
          </span>
        </div>
      </div>
    </div>
  );
};

