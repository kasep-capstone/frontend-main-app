'use client'
import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import React, { useState, useEffect } from 'react';

export default function SnapResult() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay before showing the content
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <MenuBarTop/>
      <div className={`flex flex-col justify-center items-center h-screen gap-4 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-2xl font-bold">Welcome to the Snap Result Page</h1>

        <MenuBar/>
      </div>
    </>
  );
}