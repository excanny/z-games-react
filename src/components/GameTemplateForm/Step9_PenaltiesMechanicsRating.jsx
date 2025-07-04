// Step9_PenaltiesMechanicsRating.jsx
import React, { useState } from 'react';

const Step9_PenaltiesMechanicsRating = ({ next, prev, data }) => {
  const [penalties, setPenalties] = useState(data.penalties || []);
  const [mechanics, setMechanics] = useState(data.specialMechanics || []);
  const [difficulty, setDifficulty] = useState(data.difficulty || 'medium');
  const [ageRating, setAgeRating] = useState(data.ageRating || { minAge: '', maxAge: '', description: '' });

  const addPenalty = () => setPenalties([...penalties, { violation: '', consequence: '', pointsLost: 0 }]);
  const updatePenalty = (index, field, value) => {
    const updated = [...penalties];
    updated[index][field] = value;
    setPenalties(updated);
  };

  const addMechanic = () => setMechanics([...mechanics, { name: '', description: '', trigger: '' }]);
  const updateMechanic = (index, field, value) => {
    const updated = [...mechanics];
    updated[index][field] = value;
    setMechanics(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    next({ penalties, specialMechanics: mechanics, difficulty, ageRating });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-2">Penalties</h2>
        {penalties.map((penalty, index) => (
          <div key={index} className="space-y-2">
            <input
              value={penalty.violation}
              onChange={(e) => updatePenalty(index, 'violation', e.target.value)}
              placeholder="Violation"
              className="input"
            />
            <input
              value={penalty.consequence}
              onChange={(e) => updatePenalty(index, 'consequence', e.target.value)}
              placeholder="Consequence"
              className="input"
            />
            <input
              type="number"
              value={penalty.pointsLost}
              onChange={(e) => updatePenalty(index, 'pointsLost', e.target.value)}
              placeholder="Points Lost"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addPenalty} className="btn btn-secondary mt-2">Add Penalty</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Special Mechanics</h2>
        {mechanics.map((mechanic, index) => (
          <div key={index} className="space-y-2">
            <input
              value={mechanic.name}
              onChange={(e) => updateMechanic(index, 'name', e.target.value)}
              placeholder="Mechanic Name"
              className="input"
            />
            <input
              value={mechanic.description}
              onChange={(e) => updateMechanic(index, 'description', e.target.value)}
              placeholder="Description"
              className="input"
            />
            <input
              value={mechanic.trigger}
              onChange={(e) => updateMechanic(index, 'trigger', e.target.value)}
              placeholder="Trigger"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addMechanic} className="btn btn-secondary mt-2">Add Mechanic</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Difficulty</h2>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="input">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Age Rating</h2>
        <input
          type="number"
          value={ageRating.minAge}
          onChange={(e) => setAgeRating(prev => ({ ...prev, minAge: e.target.value }))}
          placeholder="Minimum Age"
          className="input"
        />
        <input
          type="number"
          value={ageRating.maxAge}
          onChange={(e) => setAgeRating(prev => ({ ...prev, maxAge: e.target.value }))}
          placeholder="Maximum Age"
          className="input"
        />
        <input
          value={ageRating.description}
          onChange={(e) => setAgeRating(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Age Rating Description"
          className="input"
        />
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={prev} className="btn btn-secondary">Back</button>
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </form>
  );
};

export default Step9_PenaltiesMechanicsRating;
