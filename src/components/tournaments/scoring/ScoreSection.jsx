

const ScoreSection = ({ title, icon: Icon, scores, total, games, bgColor, textColor, totalColor, showPlayerName }) => (
  <div className={`${bgColor} p-2 rounded`}>
    <div className="flex justify-between items-center mb-1">
      <span className={`font-medium ${textColor} flex items-center`}>
        {Icon && <Icon className="w-4 h-4 mr-1" />}
        {title}
      </span>
      <span className={`font-bold ${totalColor}`}>
        {total}
      </span>
    </div>
    {scores.map((score, scoreIndex) => {
      const game = games.find(g => g.id === score.gameId);
      return (
        <div key={scoreIndex} className={`flex justify-between text-xs ${textColor.replace('800', '700')} ml-5`}>
          <span>
            {showPlayerName ? `${score.playerName} - ` : ''}{game?.name}
          </span>
          <span className={score.score >= 0 ? 'text-green-600' : 'text-red-600'}>
            {score.score >= 0 ? '+' : ''}{score.score}
          </span>
        </div>
      );
    })}
  </div>
);

export default ScoreSection;