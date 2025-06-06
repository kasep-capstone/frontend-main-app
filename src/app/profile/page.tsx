import { MenuBar } from '@/components/menu-bar';
import { MenuBarTop } from '@/components/menu-bar-top';
import { ThemeToggle } from '@/components/themes/theme-toggle';
import React from 'react';

export default function Profile() {
  return (
    <>
      <MenuBarTop/>
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <h1>Welcome to the Profile Page</h1>
        <ThemeToggle />

        <MenuBar/>
      </div>
    </>
  );
}