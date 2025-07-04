// Step3_TeamConfig.jsx
import React, { useState } from 'react';

const Step3_TeamConfig = ({ next, prev, data }) => {
  const [formState, setFormState] = useState({
    minPlayers: data.teamConfiguration?.minPlayers || 1,
    maxPlayers: data.teamConfiguration?.maxPlayers || '',
    teamBased: data.teamConfiguration?.teamBased || false,
    minTeams: data.teamConfiguration?.minTeams || 1,
    maxTeams: data.teamConfiguration?.maxTeams || '',
    playersPerTeam: data.teamConfiguration?.playersPerTeam || '',
    allowIndividualScoring: data.teamConfiguration?.allowIndividualScoring ?? true,
    allowTeamScoring: data.teamConfiguration?.allowTeamScoring ?? true
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormState(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    next({ teamConfiguration: formState });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="number" name="minPlayers" value={formState.minPlayers} onChange={handleChange} placeholder="Min Players" className="input" />
      <input type="number" name="maxPlayers" value={formState.maxPlayers} onChange={handleChange} placeholder="Max Players" className="input" />

      <label className="flex items-center space-x-2">
        <input type="checkbox" name="teamBased" checked={formState.teamBased} onChange={handleChange} />
        <span>Team Based</span>
      </label>

      {formState.teamBased && (
        <>
          <input type="number" name="minTeams" value={formState.minTeams} onChange={handleChange} placeholder="Min Teams" className="input" />
          <input type="number" name="maxTeams" value={formState.maxTeams} onChange={handleChange} placeholder="Max Teams" className="input" />
          <input type="number" name="playersPerTeam" value={formState.playersPerTeam} onChange={handleChange} placeholder="Players per Team" className="input" />
        </>
      )}

      <label className="flex items-center space-x-2">
        <input type="checkbox" name="allowIndividualScoring" checked={formState.allowIndividualScoring} onChange={handleChange} />
        <span>Allow Individual Scoring</span>
      </label>

      <label className="flex items-center space-x-2">
        <input type="checkbox" name="allowTeamScoring" checked={formState.allowTeamScoring} onChange={handleChange} />
        <span>Allow Team Scoring</span>
      </label>

      <div className="flex justify-between">
        <button type="button" onClick={prev} className="btn btn-secondary">Back</button>
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </form>
  );
};

export default Step3_TeamConfig;