import { useState, useRef } from 'react';
import axios from 'axios';

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = event => {
      audioChunks.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
      setAudioBlob(audioBlob);
      setAudioUrl(URL.createObjectURL(audioBlob));
      audioChunks.current = [];
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      alert("No audio recorded");
      return;
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.mp3'); // Specify correct file name and type

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading audio:", error);
      alert("Failed to upload audio.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg space-y-6 max-w-md mx-auto">
      <button
        onClick={recording ? stopRecording : startRecording}
        className={`px-6 py-2 font-semibold rounded-md text-white transition-all ${
          recording ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>

      {audioUrl && (
        <div className="flex flex-col items-center space-y-4">
          <audio controls src={audioUrl} className="rounded-md shadow-md" />
          <button
            onClick={uploadAudio}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-all"
          >
            Use this Audio
          </button>
        </div>
      )}
    </div>
  );
}
