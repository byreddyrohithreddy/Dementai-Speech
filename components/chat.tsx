"use client";

import { useState } from 'react';

interface Message {
  text: any;
  sender: string;
}

export default function Chat()
{
    const [messages, setMessages] = useState<Message[]>([]);

    const handleInputChange =async (event: any) => {
        const message=event.target.value
        setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);
        console.log(message)
        const messageObj = { text: message };
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(messageObj)
                });
              const jsondata=await response.json();
              console.log(jsondata);
              const data=jsondata as {answer:string};
              const botResponse=data.answer;
              setTimeout(() => {
                setMessages(prevMessages => [...prevMessages,{ text: botResponse, sender: 'chatbot' }]);
              }, 1000);
        }
        catch (error) {
                alert('chat response failed');
        }
        event.target.value="";
       
    };

    return (
       <div className="flex flex-col h-screen justify-between">
        <div className="flex-1 overflow-y-auto p-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`rounded-lg py-2 px-4 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
  
          <input
            className="w-11/12 border rounded-lg px-4 py-2 m-4"
            placeholder="Say something..."
            onKeyDown={(e) => {
                if (e.key === "Enter")
                    handleInputChange(e);
                }}
          />
      </div>
    );
}