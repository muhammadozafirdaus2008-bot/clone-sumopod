import { useEffect, useState } from "react";

const ScrollIndicator = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const sidebar = document.querySelector(".sidebar-scroll");

    if (!sidebar) return;

    const handleScroll = () => {
      setShow(sidebar.scrollTop < 50);
    };

    sidebar.addEventListener("scroll", handleScroll);

    return () => sidebar.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="flex flex-col items-center text-xs text-muted-foreground py-3">
      <span className="mb-1">Scroll for More</span>
      <div className="animate-bounce">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default ScrollIndicator;