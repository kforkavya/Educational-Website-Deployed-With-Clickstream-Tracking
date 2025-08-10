import React, { useState, useEffect } from "react";

export default function QuizComponent({ data, courseId, contentId, logEvent, userId }) {
  const [answers, setAnswers] = useState(Array(data.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed && userId && logEvent) {
      logEvent(userId, {
        courseId,
        contentId,
        eventType: "quiz_revealed",
        details: {},
      });
    }
  }, [revealed, userId, logEvent, courseId, contentId]);

  function selectAnswer(qIndex, optionIndex) {
    if (submitted) return; // disable changes after submit
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  }

  function handleSubmit() {
    if (submitted) return;
    let calculatedScore = 0;
    data.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) calculatedScore++;
    });
    setScore(calculatedScore);
    setSubmitted(true);

    if (userId && logEvent) {
      logEvent(userId, {
        courseId,
        contentId,
        eventType: "quiz_submit",
        details: { answers, score: calculatedScore },
      });
    }
  }

  if (!revealed) {
    return (
      <button
        onClick={() => setRevealed(true)}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#ff0000ff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Take Quiz
      </button>
    );
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {data.questions.map((q, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <p>
            <strong>Q{i + 1}:</strong> {q.question}
          </p>
          <div>
            {q.options.map((option, idx) => {
              const isSelected = answers[i] === idx;
              const isCorrect = submitted && idx === q.correctIndex;
              const isWrongSelection = submitted && isSelected && idx !== q.correctIndex;

              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(i, idx)}
                  disabled={submitted}
                  style={{
                    backgroundColor: isCorrect
                      ? "lightgreen"
                      : isWrongSelection
                      ? "#f88"
                      : isSelected
                      ? "#ddd"
                      : "white",
                    margin: "0 5px 5px 0",
                    padding: "5px 10px",
                    cursor: submitted ? "default" : "pointer",
                    border: "1px solid #ccc",
                    borderRadius: 4,
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={answers.includes(null)}
          style={{
            backgroundColor: "#2c3e50",
            color: "white",
            padding: "8px 15px",
            border: "none",
            cursor: answers.includes(null) ? "not-allowed" : "pointer",
            borderRadius: 4,
          }}
        >
          Submit Quiz
        </button>
      )}

      {submitted && (
        <p>
          Your score: {score} / {data.questions.length}
        </p>
      )}
    </div>
  );
}