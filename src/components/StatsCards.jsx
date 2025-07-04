
import React from 'react';

const StatsCards = ({ stats }) => {
  const { totalGames, totalPlayers, highestScore, activeGames } = stats;

  const cards = [
    { value: totalGames, label: "Total Games" },
    { value: totalPlayers, label: "Total Players" },
    { value: highestScore, label: "Highest Score" },
    { value: activeGames, label: "Active Games" }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
      {cards.map((card, index) => (
        <div key={index} className="bg-white/10 backdrop-blur rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-center text-white">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{card.value}</h2>
          <p className="mt-1 text-xs sm:text-sm text-blue-200">{card.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;