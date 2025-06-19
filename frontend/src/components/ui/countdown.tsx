import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="bg-gray-900/80 px-4 py-2 rounded-full backdrop-blur-sm">
      <div className="flex items-center gap-1 text-sm">
        <span className="text-gray-300">Starts in</span>
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="font-bold text-purple-400"
        >
          {timeLeft.days}d
        </motion.span>
        <span>:</span>
        <span className="font-bold">{timeLeft.hours}h</span>
        <span>:</span>
        <span className="font-bold">{timeLeft.minutes}m</span>
        <span>:</span>
        <span className="font-bold">{timeLeft.seconds}s</span>
      </div>
    </div>
  );
};

export default Countdown;
