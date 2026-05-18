import type { ReactNode } from 'react';
import { Trophy } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-emerald-400">
            <Trophy className="w-6 h-6" />
            <span>BallerGuess</span>
          </div>
          <div className="text-sm text-slate-400 font-medium">
            Daily Challenge
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col">
        {children}
      </main>

      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-800 mt-auto">
        <p>Created by <a href="https://x.com/byna001" target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Bynalab</a> | Built with React & Tailwind CSS</p>
      </footer>
    </div>
  );
}
