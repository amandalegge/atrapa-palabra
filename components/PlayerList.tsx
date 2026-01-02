'use client';

import { useState } from 'react';
import { Player } from './Game';

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string;
  onAddPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  onUpdatePlayerName: (id: string, name: string) => void;
}

export default function PlayerList({
  players,
  currentPlayerId,
  onAddPlayer,
  onRemovePlayer,
  onUpdatePlayerName,
}: PlayerListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (player: Player) => {
    setEditingId(player.id);
    setEditName(player.name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdatePlayerName(id, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Jugadores</h2>
        <button
          onClick={onAddPlayer}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transform transition-all hover:scale-105 active:scale-95"
        >
          + Agregar
        </button>
      </div>

      <div className="space-y-3">
        {players.map((player) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          const isEditing = editingId === player.id;

          return (
            <div
              key={player.id}
              className={`p-4 rounded-xl transition-all ${
                isCurrentPlayer
                  ? 'bg-white border-2 border-purple-500 text-gray-800 shadow-lg transform scale-105'
                  : 'bg-white border-2 border-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(player.id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        className="flex-1 px-2 py-1 rounded text-gray-800"
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(player.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-red-600 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className="font-semibold cursor-pointer hover:underline"
                        onClick={() => startEditing(player)}
                      >
                        {player.name}
                      </span>
                      {isCurrentPlayer && (
                        <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
                          Turno actual
                        </span>
                      )}
                    </div>
                  )}
                  <div className="mt-1">
                    <span className="text-sm opacity-90">
                      Puntos: <span className="font-bold">{player.score}</span>
                    </span>
                  </div>
                </div>
                {!isEditing && players.length > 2 && (
                  <button
                    onClick={() => onRemovePlayer(player.id)}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg"
                    title="Eliminar jugador"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

