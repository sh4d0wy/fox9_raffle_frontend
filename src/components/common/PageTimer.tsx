import { useState, useEffect } from 'react';

interface PageTimerProps {
    targetDate?: Date;
    initialSeconds?: number;
    onComplete?: () => void;
}

const PageTimer = ({ targetDate, initialSeconds, onComplete }: PageTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        if (targetDate) {
            return Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000));
        }
        return initialSeconds ?? 0;
    });

    useEffect(() => {
        if (timeLeft <= 0) {
            onComplete?.();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onComplete?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, onComplete]);

    // Calculate hours, minutes, seconds
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    // Split into individual digits (with leading zeros)
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    return (
        <div className="flex gap-3.5 items-center justify-center">
            <div className="">
                <h3 className='text-[11px] mb-2 text-center text-gray-1100 uppercase font-inter'>HOURS</h3>
                <div className="flex flex-row gap-1.5">
                    <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                        {hoursStr[0]}
                    </h4>
                    <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                        {hoursStr[1]}
                    </h4>
                </div>
            </div>

            <div className="">
                <h3 className='text-[11px] mb-2 text-center text-gray-1100 uppercase font-inter'>Minutes</h3>
                <div className="flex flex-row gap-1.5">
                    <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                        {minutesStr[0]}
                    </h4>
                    <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                        {minutesStr[1]}
                    </h4>
                </div>
            </div>

            <div className="">
                <h3 className='text-[11px] mb-2 text-center text-gray-1100 uppercase font-inter'>SECONDS</h3>
                <div className="flex flex-row gap-1.5">
                    <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                        {secondsStr[0]}
                    </h4>
                    <h4 className="text-xl rounded bg-black-1400 pr-2.5 text-center font-semibold text-white font-inter px-2.5 py-3">
                        {secondsStr[1]}
                    </h4>
                </div>
            </div>
        </div>
    );
};

export default PageTimer;
