import { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const Upload = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");
  var totaltranscript="";

  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      const { transcript } = event.results[event.results.length - 1][0];
      
      totaltranscript=totaltranscript+transcript;
      setTranscript(totaltranscript);
    };

    recognitionRef.current.start();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      sendTranscriptToBackend(transcript);
      setRecordingComplete(true);
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const sendTranscriptToBackend = (transcript:any) => {
    fetch('/api/python', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({text: transcript })
    })
    .then(response => {
      if (response.ok) {
        console.log('Transcript sent successfully');
      } else {
        console.error('Failed to send transcript:', response.status);
      }
    })
    .catch(error => {
      console.error('Error sending transcript:', error);
    });
  };

  return (
    <div className="container mx-auto max-w-lg p-4">
      <h1 className="text-2xl font-bold mb-4">Recording Audio</h1>
      <div className="flex justify-center items-center mb-4">
        <button
          onClick={handleToggleRecording}
          className={`bg-${isRecording ? 'red' : 'blue'}-500 hover:bg-${
            isRecording ? 'red' : 'blue'
          }-600 text-white font-bold py-2 px-4 rounded`}
        >
          {isRecording ? 'Stop' : 'Start'}
        </button>
      </div>

      {isRecording && (
        <p className="text-lg text-black">Transcribed Text: {transcript}</p>
      )}
      
    </div>
  );
};

export default Upload;  