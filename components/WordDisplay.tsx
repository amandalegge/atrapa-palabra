'use client';

interface WordDisplayProps {
  word: string;
}

export default function WordDisplay({ word }: WordDisplayProps) {
  if (!word) {
    return (
      <div className="bg-white rounded-xl p-12 text-center min-h-[200px] flex items-center justify-center border-2 border-gray-300">
        <p className="text-gray-500 text-xl">Presiona "Comenzar" para ver la primera palabra</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-12 text-center shadow-2xl transform transition-transform hover:scale-105 border-2 border-gray-300">
      <h3 className="text-5xl md:text-7xl font-bold text-gray-800">
        {word.toUpperCase()}
      </h3>
    </div>
  );
}

