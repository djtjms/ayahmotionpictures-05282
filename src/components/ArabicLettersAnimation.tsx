import { useEffect, useState } from "react";

const arabicLetters = [
  "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", 
  "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", 
  "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"
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
    <div className="fixed right-8 top-20 z-10 flex flex-col gap-2 pointer-events-none">
      {arabicLetters.map((letter, index) => (
        <div
          key={index}
          className="text-4xl font-bold text-white/80 transition-all duration-300"
          style={{
            opacity: getLetterOpacity(index),
            transform: `translateX(${getLetterOpacity(index) < 0.5 ? '20px' : '0'})`,
            textShadow: `0 0 20px rgba(255, 255, 255, ${getLetterOpacity(index) * 0.3})`,
          }}
        >
          {letter}
        </div>
      ))}
    </div>
  );
};
