"use client";

import type React from "react";

import { useState } from "react";
import { ShieldAlert, RefreshCw, Lock, Unlock, X } from "lucide-react";

type AdminPanelProps = {
  onResetBox: (boxNumber: number) => void;
  onResetAll: () => void;
};

export default function AdminPanel({
  onResetBox,
  onResetAll,
}: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [boxNumber, setBoxNumber] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "hunkadmin1234") {
      setIsAuthenticated(true);
      setPassword("");
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleResetBox = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number.parseInt(boxNumber);
    if (isNaN(num) || num < 1 || num > 100) {
      setError("Please enter a valid box number (1-100)");
      return;
    }

    onResetBox(num);
    setShowSuccess(`Box ${num} has been reset`);
    setBoxNumber("");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  const handleResetAll = () => {
    onResetAll();
    setShowSuccess("All boxes have been reset");
    setTimeout(() => setShowSuccess(null), 3000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-30 bg-black/50 border border-cyan-700 rounded-full p-2 hover:bg-cyan-900/30 transition-colors"
        aria-label="Admin Panel"
      >
        <ShieldAlert size={20} className="text-cyan-400" />
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-30 bg-black/80 border border-cyan-700 rounded-lg p-4 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.3)] max-w-xs w-full">
      <div className="absolute inset-0 cyber-grid rounded-lg opacity-10 pointer-events-none"></div>

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-cyan-300 font-orbitron flex items-center">
          {isAuthenticated ? (
            <Unlock size={16} className="mr-2 text-green-400" />
          ) : (
            <Lock size={16} className="mr-2 text-red-400" />
          )}
          Admin Control
        </h3>
        <button
          onClick={() => {
            setIsOpen(false);
            setIsAuthenticated(false);
            setPassword("");
            setError("");
          }}
          className="text-cyan-500 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      {!isAuthenticated ? (
        <form onSubmit={handleAuthenticate} className="space-y-3">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-2 bg-black/70 border border-cyan-700/70 rounded text-white placeholder:text-cyan-700/70 focus:outline-none focus:ring-1 focus:ring-cyan-500/70 text-sm"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-800/80 hover:bg-cyan-700/80 text-white font-orbitron py-1.5 px-3 rounded text-sm transition-colors"
          >
            Authenticate
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <form onSubmit={handleResetBox} className="space-y-3">
            <div>
              <label className="text-xs text-cyan-500 block mb-1 font-orbitron">
                Reset Specific Box
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={boxNumber}
                  onChange={(e) => setBoxNumber(e.target.value)}
                  placeholder="Box number (1-100)"
                  className="flex-1 p-2 bg-black/70 border border-cyan-700/70 rounded text-white placeholder:text-cyan-700/70 focus:outline-none focus:ring-1 focus:ring-cyan-500/70 text-sm"
                />
                <button
                  type="submit"
                  className="bg-cyan-800/80 hover:bg-cyan-700/80 text-white font-orbitron py-1 px-3 rounded text-sm transition-colors"
                >
                  Reset
                </button>
              </div>
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
          </form>

          <div>
            <button
              onClick={handleResetAll}
              className="w-full bg-purple-800/80 hover:bg-purple-700/80 text-white font-orbitron py-2 px-3 rounded text-sm transition-colors flex items-center justify-center"
            >
              <RefreshCw size={14} className="mr-2" />
              Reset All Boxes
            </button>
          </div>

          {showSuccess && (
            <div className="mt-2 text-green-400 text-xs bg-green-900/20 border border-green-700/30 rounded p-2 font-orbitron">
              {showSuccess}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
