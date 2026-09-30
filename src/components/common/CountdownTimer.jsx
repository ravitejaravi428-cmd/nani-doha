import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";

export const CountdownTimer = ({ targetHours = 18, label = "Deals End In" }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: targetHours,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: targetHours, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetHours]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="deal-timer-wrap">
      <div className="deal-timer-label">
        <Zap size={16} fill="currentColor" />
        <span>{label}</span>
      </div>
      <div className="timer-boxes">
        <div className="timer-box">
          <span>{pad(timeLeft.hours)}</span>
          <span className="timer-box-label">Hrs</span>
        </div>
        <span className="timer-colon">:</span>
        <div className="timer-box">
          <span>{pad(timeLeft.minutes)}</span>
          <span className="timer-box-label">Min</span>
        </div>
        <span className="timer-colon">:</span>
        <div className="timer-box">
          <span>{pad(timeLeft.seconds)}</span>
          <span className="timer-box-label">Sec</span>
        </div>
      </div>
    </div>
  );
};
