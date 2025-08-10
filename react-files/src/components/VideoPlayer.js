import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";

export default function VideoPlayer({ data, courseId, contentId, logEvent, userId }) {
  const [revealed, setRevealed] = useState(false);

  // Log when user reveals video
  useEffect(() => {
    if (revealed && userId && logEvent) {
      logEvent(userId, {
        courseId,
        contentId,
        eventType: "video_revealed",
        details: {},
      });
    }
  }, [revealed, userId, logEvent, courseId, contentId]);

  const opts = {
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  function handleReveal() {
    setRevealed(true);
  }

  function handlePlay() {
    if (userId && logEvent) {
      logEvent(userId, {
        courseId,
        contentId,
        eventType: "video_play",
        details: {},
      });
    }
  }

  function handlePause() {
    if (userId && logEvent) {
      logEvent(userId, {
        courseId,
        contentId,
        eventType: "video_pause",
        details: {},
      });
    }
  }

  function handleEnd() {
    if (userId && logEvent) {
      logEvent(userId, {
        courseId,
        contentId,
        eventType: "video_ended",
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
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Watch Video
        </button>
      ) : (
        <YouTube
          videoId={data.YouTubeVideoID}
          opts={opts}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnd={handleEnd}
        />
      )}
    </div>
  );
}