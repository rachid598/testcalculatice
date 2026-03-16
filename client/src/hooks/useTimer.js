import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(duration, onExpire) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const start = useCallback(() => {
    setTimeLeft(duration);
    setRunning(true);
  }, [duration]);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  const reset = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTimeLeft(duration);
  }, [duration]);

  const pct = Math.round((timeLeft / duration) * 100);
  const warning = timeLeft <= 30 && timeLeft > 0;

  return { timeLeft, running, pct, warning, start, stop, reset };
}
