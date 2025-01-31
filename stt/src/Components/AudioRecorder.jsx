import React, { useState } from "react";

const AudioRecorder = () => {
  const [transcription, setTranscription] = useState("");
  const [recording, setRecording] = useState(false);
  let mediaRecorder;
  let audioChunks = [];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      setRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setTimeout(() => {
        mediaRecorder.stop();
        setRecording(false);
      }, 10000); // Stops recording after 10 seconds
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");

    // Add the 'model' field with the desired model (e.g., "whisper-large-v3-turbo")
    formData.append("model", "whisper-large-v3-turbo"); // Add the model name

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer `, // Ensure this is correct
          },
          body: formData,
        }
      );

      // Log the entire response for debugging
      if (!response.ok) {
        const errorDetails = await response.text();  // Get error details from the response body
        throw new Error(`Error: ${response.status} - ${response.statusText} - ${errorDetails}`);
      }

      const data = await response.json();
      setTranscription(data.text || "Transcription failed.");
    } catch (error) {
      console.error("Error transcribing audio:", error);
      setTranscription(`Error occurred while transcribing: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={recording} className="p-4 bg-purple-800 rounded-sm text-[18px] font-semibold hover:bg-violet-900">
        {recording ? "Recording..." : "Start Recording"}
      </button>
      <p className="m-3 text-2xl ">Transcription: {transcription}</p>
    </div>
  );
};

export default AudioRecorder;
