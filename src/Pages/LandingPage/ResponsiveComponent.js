import React from 'react';
import { useMediaQuery } from 'react-responsive';

const ResponsiveComponent = () => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div>
      {isDesktop && <p>Desktop view content here</p>}
      {isTablet && <p>Tablet view content here</p>}
      {isMobile && <p>Mobile view content here</p>}
    </div>
  );
};

export default ResponsiveComponent;
