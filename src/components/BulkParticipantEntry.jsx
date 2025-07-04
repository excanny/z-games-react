// BulkParticipantEntry.jsx
import React, { useState } from 'react';

const availableAvatars = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄'];
const availableColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#10AC84', '#EE5A24', '#0984E3', '#A29BFE', '#FD79A8', '#E17055', '#81ECEC', '#74B9FF', '#A29BFE', '#FD79A8'];

const BulkParticipantEntry = ({ setParticipantsToAdd, isSubmitting }) => {
  const [bulkParticipants, setBulkParticipants] = useState('');

  const processBulkParticipantNames = () => {
    if (!bulkParticipants.trim()) {
      alert('Please enter participant names'); 
      return;
    }

    const participantNames = bulkParticipants.split('\n').filter(name => name.trim());
    const newParticipantsToAdd = participantNames.map((name, index) => ({
      id: Date.now() + index,
      name: name.trim(),
      avatar: availableAvatars[index % availableAvatars.length],
      color: availableColors[index % availableColors.length]
    }));

    setParticipantsToAdd(newParticipantsToAdd);
    setBulkParticipants('');
  };

  return (
    <div className="bg-green-50 rounded-lg p-3 sm:p-4 mb-4">
      <h4 className="font-medium text-green-800 mb-2 sm:mb-3 text-sm sm:text-base">
        Add Multiple Participants
      </h4>
      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
        Enter participant names, one per line:
      </p>
      <textarea
        value={bulkParticipants}
        onChange={(e) => setBulkParticipants(e.target.value)}
        placeholder="Player 1&#10;Player 2&#10;Player 3"
        className="w-full h-20 sm:h-24 border border-gray-300 rounded-md p-2 sm:p-3 text-gray-800 text-xs sm:text-sm"
        disabled={isSubmitting}
      />
      <div className="flex justify-center mt-2 sm:mt-3">
        <button
          onClick={processBulkParticipantNames}
          disabled={!bulkParticipants.trim() || isSubmitting}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Customize Participants
        </button>
      </div>
    </div>
  );
};

export default BulkParticipantEntry;