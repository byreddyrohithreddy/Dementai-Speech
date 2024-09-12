// components/Popup.js
import { useState } from 'react';

import React, { FormEvent } from 'react';

interface Props {
    onSubmit: (inputKey: string) => Promise<void>;
}

const Popup:React.FC<Props> = ({onSubmit}) => {
  const [inputKey, setInputKey] = useState('');
  const handleSubmit = () => {
    
    if (inputKey.trim() !== '') {
      onSubmit(inputKey);
    } else {
      alert('Please enter a valid input key');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ...">
        <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold m-2">Enter GEMINI API Key</h2>
        <input
          type="text"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          className="border-black border-2 rounded px-4 py-1 m-2 w-96"
        />
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 m-2 rounded">Submit</button>
        </div>
    </div>
  );
};

export default Popup;
