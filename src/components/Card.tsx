import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface CardProps {
  imageUrl: string;
  isFlipped: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  name: string;
}

export function Card({ imageUrl, isFlipped, difficulty, name }: CardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  // Cache the back of the card so it doesn't update while flipping back to front
  const [cachedBack, setCachedBack] = useState({ name, imageUrl });

  useEffect(() => {
    setIsImageLoading(true);
  }, [imageUrl]);

  useEffect(() => {
    if (isFlipped) {
      // Only update the back of the card data when it flips forward, 
      // preventing the *next* player from flashing on the back as it spins backwards.
      const timeout = setTimeout(() => {
        setCachedBack({ name, imageUrl });
      }, 0); // Update immediately on flip
      return () => clearTimeout(timeout);
    }
  }, [isFlipped, name, imageUrl]);

  return (
    <div className="group perspective-1000 w-64 h-80 sm:w-72 sm:h-96 mx-auto cursor-pointer">
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        {/* Front of card (Hidden info) */}
        <div className="absolute inset-0 backface-hidden bg-slate-800 rounded-xl border-2 border-slate-700 overflow-hidden shadow-xl flex flex-col">
          <div className="flex-1 bg-slate-900 relative flex items-center justify-center p-4">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={imageUrl} 
              alt="Guess who?" 
              onLoad={() => setIsImageLoading(false)}
              className={cn(
                "max-h-full max-w-full object-contain drop-shadow-2xl transition-opacity duration-300",
                `difficulty-${difficulty.toLowerCase()}`,
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
            />
          </div>
          <div className="h-16 bg-slate-800 flex items-center justify-center border-t border-slate-700">
            <div className="text-4xl font-bold tracking-widest text-slate-600 opacity-50 select-none">
              ???
            </div>
          </div>
        </div>

        {/* Back of card (Revealed info) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-xl border-2 border-emerald-400 overflow-hidden shadow-emerald-900/50 shadow-2xl flex flex-col">
          <div className="flex-1 relative flex items-center justify-center p-4">
            <img 
              src={cachedBack.imageUrl} 
              alt={cachedBack.name} 
              className="max-h-full max-w-full object-contain drop-shadow-2xl"
            />
          </div>
          <div className="h-20 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center border-t border-emerald-500/30">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">{cachedBack.name}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
