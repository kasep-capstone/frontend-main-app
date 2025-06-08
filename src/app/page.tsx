import { MenuBar } from "@/components/menu-bar";
import { MenuBarTop } from "@/components/menu-bar-top";
import Dashboard from "./dashboard/page";

export default function Home() {
  return (
    <>
      <MenuBarTop />
      <Dashboard />
    </>
  );
}
