"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

type QuestionModalProps = {
  question: string;
  boxNumber: number;
  attempts: number;
  maxAttempts: number;
  onSubmit: (answer: string) => void;
  onClose: () => void;
};

export default function QuestionModal({
  question,
  boxNumber,
  attempts,
  maxAttempts,
  onSubmit,
  onClose,
}: QuestionModalProps) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);
  const remainingAttempts = maxAttempts - attempts;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      // Store the current answer to check if it's wrong after onSubmit
      const currentAnswer = answer.trim();
      onSubmit(currentAnswer);

      // If attempts didn't change after submission, it means the answer was wrong
      setTimeout(() => {
        if (remainingAttempts === maxAttempts - attempts) {
          setError(true);
          // Clear error after 3 seconds
          setTimeout(() => setError(false), 3000);
        }
      }, 100);
    }
  };

  // Clear error when typing a new answer
  useEffect(() => {
    if (error) {
      setError(false);
    }
  }, [answer]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="cosmic-dust"></div>

      <div className="bg-gray-900/80 border border-cyan-700 rounded-lg w-full max-w-md p-6 shadow-[0_0_30px_rgba(0,255,255,0.3)] relative backdrop-blur-sm">
        <div className="absolute inset-0 cyber-grid rounded-lg opacity-20 pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-cyan-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-cyan-900/50 border border-cyan-500/50 flex items-center justify-center mr-3">
              <span className="text-cyan-300 font-orbitron">{boxNumber}</span>
            </div>
            <h2 className="text-xl font-bold text-cyan-300 glow-text font-orbitron">
              Sector #{boxNumber}
            </h2>
          </div>

          <div className="text-sm">
            <div className="text-cyan-500 mb-1 font-orbitron">
              Attempts Remaining
            </div>
            <div className="flex space-x-1">
              {[...Array(maxAttempts)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < remainingAttempts ? "bg-cyan-400" : "bg-gray-700"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-black/70 border border-cyan-800/70 rounded text-white relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none"></div>
          <div className="relative z-10">{question}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer, Traveller..."
              className={`w-full p-3 bg-black/70 border ${
                error ? "border-red-500/70" : "border-cyan-700/70"
              } rounded text-white placeholder:text-cyan-700/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/70 focus:border-transparent`}
              autoFocus
            />

            {error && (
              <div className="mt-2 text-red-400 flex items-center shake-animation">
                <AlertTriangle size={16} className="mr-1" />
                <span className="text-sm font-orbitron">
                  Wrong answer. Try again.
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-700/80 hover:bg-cyan-600/80 text-white font-bold py-3 px-4 rounded transition-colors relative overflow-hidden group font-orbitron"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10">SUBMIT ANSWER</span>
          </button>
        </form>
      </div>
    </div>
  );
}
