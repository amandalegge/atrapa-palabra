'use client';

interface GameControlsProps {
  isPlaying: boolean;
  isPaused?: boolean;
  onStart: () => void;
  onNextWord: () => void;
  onSkipWord?: () => void;
  onResume?: () => void;
  onReset: () => void;
}

export default function GameControls({
  isPlaying,
  isPaused = false,
  onStart,
  onNextWord,
  onSkipWord,
  onResume,
  onReset,
}: GameControlsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {!isPlaying ? (
        <>
          <button
            onClick={onStart}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 text-lg"
          >
            ▶️ Comenzar
          </button>
          <button
            onClick={onReset}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 text-lg"
          >
            🔄 Reiniciar
          </button>
        </>
      ) : (
        <>
          {isPaused ? (
            <button
              onClick={onResume}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 text-lg col-span-2"
            >
              ▶️ Reanudar
            </button>
          ) : (
            <div className="col-span-2 space-y-4">
              {/* Large "Siguiente Palabra" button */}
              <button
                onClick={onNextWord}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-8 rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 text-xl md:text-2xl"
                title="Presiona Espacio para la siguiente palabra"
              >
                ➡️ Siguiente Palabra <span className="text-sm md:text-base opacity-75">(Espacio)</span>
              </button>
              
              {/* Smaller "Saltar" button */}
              <button
                onClick={onSkipWord}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all hover:scale-105 active:scale-95 text-base md:text-lg"
                title="Saltar esta palabra (no cuenta como adivinada)"
              >
                ⏭️ Saltar Palabra
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

