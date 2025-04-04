"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Box from "@/components/box";
import QuestionModal from "@/components/question-modal";
import WinAnimation from "@/components/win-animation";
import LoseAnimation from "@/components/lose-animation";
import { BarChart3, Trophy, AlertTriangle } from "lucide-react";

type Question = {
  question_id: number;
  question: string;
  answer: string;
};

type BoxStatus = {
  [key: number]: {
    status: "unanswered" | "correct" | "failed";
    attempts: number;
  };
};

export default function TreasureHunt() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [boxStatus, setBoxStatus] = useState<BoxStatus>({});
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [showLoseAnimation, setShowLoseAnimation] = useState(false);
  const [stats, setStats] = useState({
    correct: 0,
    failed: 0,
    remaining: 100,
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data, error } = await supabase
          .from("hunt_questions")
          .select("*")
          .order("question_id");

        if (error) {
          throw error;
        }

        if (data) {
          setQuestions(data);

          // Initialize box status
          const initialStatus: BoxStatus = {};
          data.forEach((q) => {
            initialStatus[q.question_id] = {
              status: "unanswered",
              attempts: 0,
            };
          });

          // Load saved status from localStorage if available
          const savedStatus = localStorage.getItem("boxStatus");
          if (savedStatus) {
            setBoxStatus(JSON.parse(savedStatus));
          } else {
            setBoxStatus(initialStatus);
          }
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [supabase]);

  useEffect(() => {
    // Save box status to localStorage whenever it changes
    if (Object.keys(boxStatus).length > 0) {
      localStorage.setItem("boxStatus", JSON.stringify(boxStatus));

      // Update stats
      const correct = Object.values(boxStatus).filter(
        (box) => box.status === "correct"
      ).length;
      const failed = Object.values(boxStatus).filter(
        (box) => box.status === "failed"
      ).length;
      const remaining = 100 - correct - failed;

      setStats({ correct, failed, remaining });
    }
  }, [boxStatus]);

  const handleBoxClick = (boxNumber: number) => {
    const question = questions.find((q) => q.question_id === boxNumber);
    if (question) {
      setSelectedBox(boxNumber);
      setCurrentQuestion(question);
    }
  };

  const handleAnswerSubmit = (answer: string) => {
    if (!currentQuestion || selectedBox === null) return;

    const isCorrect =
      currentQuestion.answer.toLowerCase() === answer.toLowerCase();
    const currentAttempts = boxStatus[selectedBox]?.attempts || 0;

    if (isCorrect) {
      // Correct answer
      setBoxStatus((prev) => ({
        ...prev,
        [selectedBox]: {
          status: "correct",
          attempts: currentAttempts + 1,
        },
      }));

      // Show win animation
      setShowWinAnimation(true);

      // Close modal and reset after animation
      setTimeout(() => {
        setShowWinAnimation(false);
        setSelectedBox(null);
        setCurrentQuestion(null);
      }, 3000);
    } else {
      // Wrong answer
      const newAttempts = currentAttempts + 1;

      if (newAttempts >= 3) {
        // Failed after 3 attempts
        setBoxStatus((prev) => ({
          ...prev,
          [selectedBox]: {
            status: "failed",
            attempts: newAttempts,
          },
        }));

        // Show lose animation
        setShowLoseAnimation(true);

        // Close modal and reset after animation
        setTimeout(() => {
          setShowLoseAnimation(false);
          setSelectedBox(null);
          setCurrentQuestion(null);
        }, 3000);
      } else {
        // Still has attempts left
        setBoxStatus((prev) => ({
          ...prev,
          [selectedBox]: {
            status: prev[selectedBox]?.status || "unanswered",
            attempts: newAttempts,
          },
        }));
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedBox(null);
    setCurrentQuestion(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-cyan-400 font-orbitron">
          Loading treasure hunt...
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="mb-6 p-4 bg-black/30 border border-cyan-800/30 rounded-lg backdrop-blur-sm">
        <h2 className="text-xl font-bold text-cyan-300 mb-3 glow-text font-orbitron">
          Traveller Progress
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-black/50 p-3 rounded-md border border-cyan-800/50">
            <Trophy className="text-yellow-400 mr-2" size={20} />
            <div>
              <div className="text-xs text-cyan-500 font-orbitron">
                Discovered
              </div>
              <div className="text-xl font-bold text-yellow-400">
                {stats.correct}
              </div>
            </div>
          </div>

          <div className="flex items-center bg-black/50 p-3 rounded-md border border-cyan-800/50">
            <AlertTriangle className="text-red-400 mr-2" size={20} />
            <div>
              <div className="text-xs text-cyan-500 font-orbitron">Failed</div>
              <div className="text-xl font-bold text-red-400">
                {stats.failed}
              </div>
            </div>
          </div>

          <div className="flex items-center bg-black/50 p-3 rounded-md border border-cyan-800/50">
            <BarChart3 className="text-cyan-400 mr-2" size={20} />
            <div>
              <div className="text-xs text-cyan-500 font-orbitron">
                Remaining
              </div>
              <div className="text-xl font-bold text-cyan-400">
                {stats.remaining}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-20 gap-2 md:gap-4">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((boxNumber) => (
          <Box
            key={boxNumber}
            number={boxNumber}
            status={boxStatus[boxNumber]?.status || "unanswered"}
            onClick={() => {
              const status = boxStatus[boxNumber]?.status;
              if (status !== "correct" && status !== "failed") {
                handleBoxClick(boxNumber);
              }
            }}
          />
        ))}
      </div>

      {selectedBox !== null && currentQuestion && (
        <QuestionModal
          question={currentQuestion.question}
          boxNumber={selectedBox}
          attempts={boxStatus[selectedBox]?.attempts || 0}
          maxAttempts={3}
          onSubmit={handleAnswerSubmit}
          onClose={handleCloseModal}
        />
      )}

      {showWinAnimation && <WinAnimation />}
      {showLoseAnimation && <LoseAnimation />}
    </div>
  );
}
