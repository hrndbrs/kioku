import { useEffect, useState } from 'react';

function useSupportsHover() {
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover)').matches;
    setSupportsHover(hasHover);
  }, []);

  return supportsHover;
}

export { useSupportsHover };
