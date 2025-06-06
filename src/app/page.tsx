import { MenuBar } from "@/components/menu-bar";
import { MenuBarTop } from "@/components/menu-bar-top";

export default function Home() {
  return (
    <>
      <MenuBarTop />
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-4xl">Selamat Datang di KASEP</h1>
        <MenuBar />
      </div>
    </>
  );
}
