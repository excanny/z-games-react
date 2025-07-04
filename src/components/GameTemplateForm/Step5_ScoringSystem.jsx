// Step5_ScoringPrizes.jsx
import React, { useState } from 'react';

const Step5_ScoringPrizes = ({ next, prev, data }) => {
  const [scoring, setScoring] = useState(data.scoringSystem || {
    individual: {
      basePoints: 0,
      bonusPoints: 0,
      penaltyPoints: 0,
      scoringMethod: 'fixed'
    },
    teamOnly: {
      basePoints: 0,
      bonusPoints: 0,
      penaltyPoints: 0,
      scoringMethod: 'fixed'
    },
    pointsAggregation: 'sum',
    customScoring: ''
  });

  const [prizes, setPrizes] = useState(data.prizes || []);

  const handleScoringChange = (section, field, value) => {
    setScoring(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAggregationChange = (e) => {
    setScoring(prev => ({ ...prev, pointsAggregation: e.target.value }));
  };

  const handleCustomScoringChange = (e) => {
    setScoring(prev => ({ ...prev, customScoring: e.target.value }));
  };

  const addPrize = () => setPrizes([...prizes, { type: '', value: '', description: '', condition: '' }]);

  const updatePrize = (index, field, value) => {
    const updated = [...prizes];
    updated[index][field] = value;
    setPrizes(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    next({ scoringSystem: scoring, prizes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-2">Individual Scoring</h2>
        <input type="number" value={scoring.individual.basePoints} onChange={(e) => handleScoringChange('individual', 'basePoints', Number(e.target.value))} placeholder="Base Points" className="input" />
        <input type="number" value={scoring.individual.bonusPoints} onChange={(e) => handleScoringChange('individual', 'bonusPoints', Number(e.target.value))} placeholder="Bonus Points" className="input" />
        <input type="number" value={scoring.individual.penaltyPoints} onChange={(e) => handleScoringChange('individual', 'penaltyPoints', Number(e.target.value))} placeholder="Penalty Points" className="input" />
        <select value={scoring.individual.scoringMethod} onChange={(e) => handleScoringChange('individual', 'scoringMethod', e.target.value)} className="input">
          <option value="fixed">Fixed</option>
          <option value="variable">Variable</option>
          <option value="elimination">Elimination</option>
          <option value="accumulative">Accumulative</option>
          <option value="position_based">Position Based</option>
        </select>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Team-Only Scoring</h2>
        <input type="number" value={scoring.teamOnly.basePoints} onChange={(e) => handleScoringChange('teamOnly', 'basePoints', Number(e.target.value))} placeholder="Base Points" className="input" />
        <input type="number" value={scoring.teamOnly.bonusPoints} onChange={(e) => handleScoringChange('teamOnly', 'bonusPoints', Number(e.target.value))} placeholder="Bonus Points" className="input" />
        <input type="number" value={scoring.teamOnly.penaltyPoints} onChange={(e) => handleScoringChange('teamOnly', 'penaltyPoints', Number(e.target.value))} placeholder="Penalty Points" className="input" />
        <select value={scoring.teamOnly.scoringMethod} onChange={(e) => handleScoringChange('teamOnly', 'scoringMethod', e.target.value)} className="input">
          <option value="fixed">Fixed</option>
          <option value="variable">Variable</option>
          <option value="elimination">Elimination</option>
          <option value="accumulative">Accumulative</option>
          <option value="position_based">Position Based</option>
        </select>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Points Aggregation</h2>
        <select value={scoring.pointsAggregation} onChange={handleAggregationChange} className="input">
          <option value="sum">Sum</option>
          <option value="average">Average</option>
          <option value="weighted">Weighted</option>
        </select>

        <textarea
          value={scoring.customScoring || ''}
          onChange={handleCustomScoringChange}
          placeholder="Custom Scoring Rules (optional)"
          className="input"
        />
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Prizes</h2>
        {prizes.map((prize, index) => (
          <div key={index} className="space-y-2">
            <select
              value={prize.type}
              onChange={(e) => updatePrize(index, 'type', e.target.value)}
              className="input"
            >
              <option value="">Select Prize Type</option>
              <option value="points">Points</option>
              <option value="gift_card">Gift Card</option>
              <option value="physical_item">Physical Item</option>
              <option value="food">Food</option>
              <option value="privilege">Privilege</option>
            </select>
            <input
              value={prize.value}
              onChange={(e) => updatePrize(index, 'value', e.target.value)}
              placeholder="Prize Value"
              className="input"
            />
            <input
              value={prize.description}
              onChange={(e) => updatePrize(index, 'description', e.target.value)}
              placeholder="Description"
              className="input"
            />
            <input
              value={prize.condition}
              onChange={(e) => updatePrize(index, 'condition', e.target.value)}
              placeholder="Condition"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addPrize} className="btn btn-secondary mt-2">Add Prize</button>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={prev} className="btn btn-secondary">Back</button>
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </form>
  );
};

export default Step5_ScoringPrizes;