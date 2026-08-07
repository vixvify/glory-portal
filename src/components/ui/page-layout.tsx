import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function PageLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand selection:text-black">
      <main className="max-w-8xl mx-auto w-full px-6 md:px-16 pt-32 md:pt-36 pb-16 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
