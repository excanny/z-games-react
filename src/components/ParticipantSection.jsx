// // ParticipantSection.jsx
// import React, { useState } from 'react';
// import BulkParticipantEntry from './BulkParticipantEntry';
// import ParticipantCustomization from './ParticipantCustomization';
// import ParticipantList from './ParticipantList';

// const ParticipantSection = ({ participants, setParticipants, isSubmitting }) => {
//   const [participantsToAdd, setParticipantsToAdd] = useState([]);

//   const confirmParticipants = () => {
//     if (participantsToAdd.length === 0) {
//       alert('No participants to add');
//       return;
//     }

//     setParticipants(prev => [...prev, ...participantsToAdd]);
//     setParticipantsToAdd([]);
//   };

//   const removeParticipant = (participantId) => {
//     setParticipants(prev => prev.filter(p => p.id !== participantId));
//   };

//   return (
//     <div className="border-t pt-4">
//       <h3 className="text-base sm:text-lg font-semibold text-green-600 text-center mb-4">
//         Add Participants (<span>{participants.length}</span>) 
//         <span className="text-red-500 text-xs sm:text-sm font-normal block sm:inline"> *Required</span>
//       </h3>
      
//       {/* {participantsToAdd.length === 0 ? (
//         <BulkParticipantEntry 
//           setParticipantsToAdd={setParticipantsToAdd}
//           isSubmitting={isSubmitting}
//         />
//       ) : (
//         <ParticipantCustomization 
//           participantsToAdd={participantsToAdd}
//           setParticipantsToAdd={setParticipantsToAdd}
//           onConfirm={confirmParticipants}
//           isSubmitting={isSubmitting}
//         />
//       )} */}
      
//       {participants.length === 0 && (
//         <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-amber-600 bg-amber-50 p-2 sm:p-3 rounded-lg">
//           ⚠️ Please add at least one participant to create a game.
//         </div>
//       )}
      
//       {participants.length > 0 && (
//         <ParticipantList 
//           participants={participants}
//           onRemove={removeParticipant}
//           isSubmitting={isSubmitting}
//         />
//       )}
//     </div>
//   );
// };

// export default ParticipantSection;