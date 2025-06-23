import { useState, useEffect } from 'react';
import { getNextResetDate } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate?: Date;
  onReset?: () => void;
}

export function CountdownTimer({ targetDate, onReset }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = targetDate || getNextResetDate();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onReset?.();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onReset]);

  const CountdownDigit = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div className="countdown-digit rounded-xl p-6 mb-2">
        <span className="text-4xl font-orbitron font-black text-gaming-off-white">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-sm font-rajdhani text-gaming-metallic">{label}</span>
    </div>
  );

  return (
    <div className="gaming-card gaming-glow rounded-2xl p-8 max-w-4xl mx-auto mb-12">
      <h3 className="text-2xl font-orbitron font-bold text-gaming-accent mb-6 text-center">
        Competition Ends In
      </h3>
      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        <CountdownDigit value={timeLeft.days} label="DAYS" />
        <CountdownDigit value={timeLeft.hours} label="HOURS" />
        <CountdownDigit value={timeLeft.minutes} label="MINUTES" />
        <CountdownDigit value={timeLeft.seconds} label="SECONDS" />
      </div>
    </div>
  );
}
