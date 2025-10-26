import { useEffect, useState } from "react";

const arabicLetters = [
  "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", 
  "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", 
  "ق", "ك", "ل", "م", "ن", "ه", "و", "ي", "ء", "ى",
  "ئ", "ؤ", "ة"
];

export const ArabicLettersAnimation = () => {
  const [mouseY, setMouseY] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getLetterOpacity = (index: number) => {
    const letterHeight = 60; // Approximate height per letter including gap
    const letterPosition = index * letterHeight + 80; // Top offset
    const combinedY = mouseY + scrollY;
    const distance = Math.abs(letterPosition - combinedY);
    const maxDistance = 200;
    
    if (distance < maxDistance) {
      return 1 - (distance / maxDistance) * 0.7;
    }
    return 0.3;
  };

  return (
    <div className="fixed right-4 md:right-8 top-0 bottom-0 z-10 flex flex-col justify-start py-4 pointer-events-none gap-4">
      {arabicLetters.map((letter, index) => (
        <div
          key={`${letter}-${index}`}
          className="text-2xl md:text-3xl font-bold text-foreground/20 dark:text-foreground/30 transition-all duration-300"
          style={{
            opacity: getLetterOpacity(index),
            transform: `translateX(${getLetterOpacity(index) < 0.5 ? '20px' : '0'})`,
            textShadow: `0 0 20px hsl(var(--gold) / ${getLetterOpacity(index) * 0.3})`,
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};
