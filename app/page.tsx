"use client";

import Chat from "@/components/chat"
import Upload from "@/components/upload"
import Popup from '../components/popup';
import { useState } from 'react';



export default function Home() {
  const [showPopup, setShowPopup] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handlePopupSubmit = async (inputKey: string) => {

    var data={"status":"false"}
    const messageObj = { key: inputKey };
    try {
      const response = await fetch('/api/valid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageObj)
        });
        data=await response.json();
        console.log(data);
      }
      catch (error) {
          alert('Error uploading file:');
        }

    if (data.status==="true") {
      setShowPopup(false);
      setIsLoggedIn(true);  
    } else {
      alert('Invalid input key. Please try again.');
    }
  };
  return (
    <div>
      {showPopup && <Popup onSubmit={(e) => handlePopupSubmit(e)} />}
      {isLoggedIn && 
      <main className="flex w-screen h-screen">
        <div className="w-1/4 h-100 bg-gradient-to-b from-blue-900 to-orange-500 border-4 border-gray-300 rounded-2xl max-h-screen overflow-y-auto">
          <Upload/>
        </div>
        <div className="w-3/4 h-100  bg-[url('../public/bg.jpg')] bg-cover bg-center bg-fixed border-blue-950 rounded-2xl overflow-y-auto">
          <Chat/>
        </div> 
      </main>}
      </div>
  );
}
