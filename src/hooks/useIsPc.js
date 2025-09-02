import { useEffect, useState } from 'react';

// iPad Pro 11"
function useIsPc(breakpoint = 834) {
  const [isPC, setisPc] = useState(window.innerWidth > breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setisPc(window.innerWidth > breakpoint);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isPC;
}

export default useIsPc;
