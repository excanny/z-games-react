// Step1_BasicInfo.jsx
import React, { useState } from 'react';

const Step1_BasicInfo = ({ next, data }) => {
  const [formState, setFormState] = useState({
    name: data.name || '',
    category: data.category || '',
    description: data.description || '',
    gameType: data.gameType || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    next(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={formState.name}
        onChange={handleChange}
        placeholder="Game Name"
        className="input"
        required
      />

      <select
        name="category"
        value={formState.category}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">Select Category</option>
        <option value="word_game">Word Game</option>
        <option value="physical_game">Physical Game</option>
        <option value="skill_game">Skill Game</option>
        <option value="party_game">Party Game</option>
        <option value="elimination_game">Elimination Game</option>
        <option value="team_game">Team Game</option>
        <option value="individual_game">Individual Game</option>
        <option value="social_deduction">Social Deduction</option>
      </select>

      <textarea
        name="description"
        value={formState.description}
        onChange={handleChange}
        placeholder="Game Description"
        className="input"
        required
      />

      <select
        name="gameType"
        value={formState.gameType}
        onChange={handleChange}
        className="input"
        required
      >
        <option value="">Select Game Type</option>
        <option value="competitive">Competitive</option>
        <option value="cooperative">Cooperative</option>
        <option value="elimination">Elimination</option>
        <option value="scoring">Scoring</option>
        <option value="social">Social</option>
      </select>

      <button type="submit" className="btn btn-primary">Next</button>
    </form>
  );
};

export default Step1_BasicInfo;