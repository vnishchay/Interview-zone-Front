import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import "./setuppage.css";

export default function SetupPage() {
  const videoRef = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [isaudio, setisaudio] = useState(true);
  const [isvideo, setisvideo] = useState(true);
  const [stream, setstream] = useState(null);

  console.log("[SETUP PAGE] Interview ID:", id);

  useEffect(() => {
    let mounted = true;

    const getVideo = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (mounted && videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setstream(mediaStream);
          console.log("[SETUP PAGE] Media stream initialized");
        }
      } catch (err) {
        console.error("[SETUP PAGE] Media error:", err);
        alert(`Cannot access camera/microphone: ${err.message}`);
      }
    };

    getVideo();

    return () => {
      mounted = false;
      // Stream cleanup is handled in separate useEffect
    };
  }, []);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("[SETUP PAGE] Stopped track:", track.kind);
        });
      }
    };
  }, [stream]);

  const handleToggleaudio = (e) => {
    e.preventDefault();
    const newAudioState = !isaudio;
    setisaudio(newAudioState);

    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = newAudioState;
      });
      console.log("[SETUP PAGE] Audio toggled:", newAudioState);
    }
  };

  const handleTogglevideo = (e) => {
    e.preventDefault();
    const newVideoState = !isvideo;
    setisvideo(newVideoState);

    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = newVideoState;
      });
      console.log("[SETUP PAGE] Video toggled:", newVideoState);
    }
  };

  return (
    <div className="setuppage">
      <div className="setup-container">
        <div className="setup-header">
          <h1>Ready to join?</h1>
          <p>Check your audio and video before joining the interview</p>
        </div>

        <div className="video-preview-container">
          <div className="video-wrapper">
            <video
              className="local-video"
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
            {!isvideo && (
              <div className="video-off-overlay">
                <div className="video-off-icon">📹</div>
                <p>Camera is off</p>
              </div>
            )}

            <div className="video-controls-overlay">
              <button
                className={`control-btn ${!isvideo ? "disabled" : ""}`}
                onClick={handleTogglevideo}
                title={isvideo ? "Turn off camera" : "Turn on camera"}
              >
                {isvideo ? "📹" : "🚫"}
              </button>
              <button
                className={`control-btn ${!isaudio ? "disabled" : ""}`}
                onClick={handleToggleaudio}
                title={isaudio ? "Mute microphone" : "Unmute microphone"}
              >
                {isaudio ? "🎤" : "🔇"}
              </button>
            </div>
          </div>
        </div>

        <div className="setup-actions">
          <button
            className="share-link-btn"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Interview link copied to clipboard!");
            }}
          >
            📋 Copy link
          </button>

          <button
            className="join-button"
            onClick={() => {
              history.push({
                pathname: `/interview/${id}`,
                state: { constraints: { video: isvideo, audio: isaudio } },
              });
            }}
          >
            Join now
          </button>
        </div>

        <div className="setup-info">
          <p>
            💡 <strong>Tip:</strong> Make sure your camera and microphone are
            working properly
          </p>
        </div>
      </div>
    </div>
  );
}
