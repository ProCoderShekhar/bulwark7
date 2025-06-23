import { useState, useEffect } from 'react';
import { getNextResetDate } from '@/lib/utils';
import { Clock } from 'lucide-react';

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
      <div className="countdown-card rounded-xl p-4 blue-glow">
        <span className="text-3xl md:text-4xl font-mono font-bold text-slate-50">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-sm font-medium text-slate-400 mt-2 block">{label}</span>
    </div>
  );

  return (
    <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Clock className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-slate-50">
          Competition Ends In
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <CountdownDigit value={timeLeft.days} label="DAYS" />
        <CountdownDigit value={timeLeft.hours} label="HOURS" />
        <CountdownDigit value={timeLeft.minutes} label="MINUTES" />
        <CountdownDigit value={timeLeft.seconds} label="SECONDS" />
      </div>
    </div>
  );
}
