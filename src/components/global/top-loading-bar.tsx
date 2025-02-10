"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const TopLoadingBar = () => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        if (next >= 90) {
          clearInterval(interval);
          return 90;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 w-full z-[100]">
      <Progress value={progress} className="w-full h-[2px]" />
    </div>
  );
};

export default TopLoadingBar;
