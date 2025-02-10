"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <div className="px-4 py-2 bg-foreground/90 text-white flex justify-between gap-4">
      <div></div>
      <div className="flex gap-2 items-center">
        <Facebook size={18} />
        <Instagram size={18} />
        <Twitter size={18} />
      </div>
    </div>
  );
};
