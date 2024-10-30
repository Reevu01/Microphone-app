"use client"; // Add this directive at the very top

import { useEffect, useState } from "react";
import axios from "axios";

import AudioRecorder from "@/components/AudioRecorder";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/hello")
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>{message || "Loading..."}</h1>
      <div>
        <AudioRecorder />
      </div>
    </div>
  );
}
