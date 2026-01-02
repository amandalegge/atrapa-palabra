'use client';

interface TimerProps {
  timeRemaining: number;
  isPlaying: boolean;
}

export default function Timer({ timeRemaining, isPlaying }: TimerProps) {
  const percentage = (timeRemaining / 60) * 100;
  const isLowTime = timeRemaining <= 10;

  return (
    <div className="w-full">
      <div className="relative h-16 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${
            isLowTime ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-3xl font-bold ${
              isLowTime ? 'text-white' : 'text-gray-800'
            } transition-colors`}
          >
            {timeRemaining}s
          </span>
        </div>
      </div>
      {!isPlaying && timeRemaining === 60 && (
        <p className="text-sm text-gray-500 text-center mt-2">Presiona "Comenzar" para iniciar</p>
      )}
    </div>
  );
}

