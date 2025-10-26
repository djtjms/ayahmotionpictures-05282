import { useEffect, useState } from "react";

const islamicSymbols = ["☪️", "🕌", "📿", "✨"];

interface Symbol {
  id: number;
  symbol: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const IslamicSymbolsAnimation = () => {
  const [symbols, setSymbols] = useState<Symbol[]>([]);

  useEffect(() => {
    const generateSymbols = () => {
      const newSymbols: Symbol[] = [];
      for (let i = 0; i < 15; i++) {
        newSymbols.push({
          id: i,
          symbol: islamicSymbols[Math.floor(Math.random() * islamicSymbols.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 30 + 20,
          duration: Math.random() * 10 + 15,
          delay: Math.random() * 5,
        });
      }
      setSymbols(newSymbols);
    };

    generateSymbols();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {symbols.map((symbol) => (
        <div
          key={symbol.id}
          className="absolute opacity-10 dark:opacity-20 animate-float"
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            fontSize: `${symbol.size}px`,
            animationDuration: `${symbol.duration}s`,
            animationDelay: `${symbol.delay}s`,
            filter: "drop-shadow(0 0 10px hsl(var(--gold)))",
          }}
        >
          {symbol.symbol}
        </div>
      ))}
    </div>
  );
}
