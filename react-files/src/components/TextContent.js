import React, { useState } from "react";

export default function TextContent({ data, courseId, contentId, logEvent, userId }) {
  const [revealed, setRevealed] = useState(false);

  function handleReveal() {
    setRevealed(true);
    if (userId && logEvent) {
      logEvent(userId, {
        courseId,
        contentId,
        eventType: "text_revealed",
        details: {},
      });
    }
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {!revealed ? (
        <button
          onClick={handleReveal}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Read Lesson
        </button>
      ) : (
        <div>
          <p>{data.body}</p>
        </div>
      )}
    </div>
  );
}