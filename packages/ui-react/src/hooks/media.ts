import { useState, useEffect } from 'react';
import { MOBILE_PX, PAD_PX } from '../constants';

export function useScreenSize() {
  const [isMobilePX, setIsMobilePX] = useState(false);
  const [isPadPX, setIsPadPX] = useState(false);

  useEffect((): any => {
    // resize listener
    if (typeof window !== 'undefined') {
      const resize = () => {
        setIsMobilePX(window.innerWidth <= MOBILE_PX);

        setIsPadPX(window.innerWidth <= PAD_PX);
      };
      resize();
      window.addEventListener('resize', resize);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }
  }, [isMobilePX, isPadPX]);

  return {
    isMobilePX,
    isPadPX,
  };
}
