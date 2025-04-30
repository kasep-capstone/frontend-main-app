import { MenuBar } from "../menu-bar";
import { MenuBarTop } from "../menu-bar-top";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex justify-center bg-background min-h-screen">
            <div className="w-full max-w-sm bg-background min-h-screen shadow-md dark:shadow-gray-800/20">
                <MenuBarTop />
                <div className="min-h-screen bg-background p-4 pt-16">
                    {children}
                    <div className="flex flex-col items-center justify-center">
                      <MenuBar />
                    </div>
                </div>
            </div>
        </div>
    );
}
