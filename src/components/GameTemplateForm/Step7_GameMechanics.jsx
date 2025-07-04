// Step7_GameMechanics.jsx
import React, { useState } from 'react';

const Step7_GameMechanics = ({ next, prev, data }) => {
  const [forbiddenWords, setForbiddenWords] = useState(data.forbiddenWords || []);
  const [targetAreas, setTargetAreas] = useState(data.targetAreas || []);
  const [diceActions, setDiceActions] = useState(data.diceActions || []);
  const [roles, setRoles] = useState(data.roles || []);

  const addForbiddenWordSet = () => {
    setForbiddenWords([...forbiddenWords, { targetWord: '', forbiddenWords: [''] }]);
  };
  const updateForbiddenWordSet = (index, field, value) => {
    const updated = [...forbiddenWords];
    if (field === 'forbiddenWords') {
      updated[index][field] = value.split(',').map(w => w.trim());
    } else {
      updated[index][field] = value;
    }
    setForbiddenWords(updated);
  };

  const addTargetArea = () => {
    setTargetAreas([...targetAreas, { position: '', value: '', description: '' }]);
  };
  const updateTargetArea = (index, field, value) => {
    const updated = [...targetAreas];
    updated[index][field] = value;
    setTargetAreas(updated);
  };

  const addDiceAction = () => {
    setDiceActions([...diceActions, { rollValue: '', action: '', points: 0 }]);
  };
  const updateDiceAction = (index, field, value) => {
    const updated = [...diceActions];
    updated[index][field] = field === 'points' ? Number(value) : value;
    setDiceActions(updated);
  };

  const addRole = () => {
    setRoles([...roles, { name: '', description: '', quantity: 1, winCondition: '' }]);
  };
  const updateRole = (index, field, value) => {
    const updated = [...roles];
    updated[index][field] = field === 'quantity' ? Number(value) : value;
    setRoles(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    next({ forbiddenWords, targetAreas, diceActions, roles });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-2">Forbidden Words</h2>
        {forbiddenWords.map((fw, index) => (
          <div key={index} className="space-y-2">
            <input
              value={fw.targetWord}
              onChange={(e) => updateForbiddenWordSet(index, 'targetWord', e.target.value)}
              placeholder="Target Word"
              className="input"
            />
            <input
              value={fw.forbiddenWords.join(', ')}
              onChange={(e) => updateForbiddenWordSet(index, 'forbiddenWords', e.target.value)}
              placeholder="Forbidden Words (comma separated)"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addForbiddenWordSet} className="btn btn-secondary mt-2">Add Forbidden Word Set</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Target Areas</h2>
        {targetAreas.map((ta, index) => (
          <div key={index} className="space-y-2">
            <input
              value={ta.position}
              onChange={(e) => updateTargetArea(index, 'position', e.target.value)}
              placeholder="Position"
              className="input"
            />
            <input
              value={ta.value}
              onChange={(e) => updateTargetArea(index, 'value', e.target.value)}
              placeholder="Value"
              className="input"
            />
            <input
              value={ta.description}
              onChange={(e) => updateTargetArea(index, 'description', e.target.value)}
              placeholder="Description"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addTargetArea} className="btn btn-secondary mt-2">Add Target Area</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Dice Actions</h2>
        {diceActions.map((da, index) => (
          <div key={index} className="space-y-2">
            <input
              type="number"
              value={da.rollValue}
              onChange={(e) => updateDiceAction(index, 'rollValue', e.target.value)}
              placeholder="Dice Roll Value"
              className="input"
            />
            <input
              value={da.action}
              onChange={(e) => updateDiceAction(index, 'action', e.target.value)}
              placeholder="Action"
              className="input"
            />
            <input
              type="number"
              value={da.points}
              onChange={(e) => updateDiceAction(index, 'points', e.target.value)}
              placeholder="Points"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addDiceAction} className="btn btn-secondary mt-2">Add Dice Action</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Roles</h2>
        {roles.map((role, index) => (
          <div key={index} className="space-y-2">
            <input
              value={role.name}
              onChange={(e) => updateRole(index, 'name', e.target.value)}
              placeholder="Role Name"
              className="input"
            />
            <input
              value={role.description}
              onChange={(e) => updateRole(index, 'description', e.target.value)}
              placeholder="Description"
              className="input"
            />
            <input
              type="number"
              value={role.quantity}
              onChange={(e) => updateRole(index, 'quantity', e.target.value)}
              placeholder="Quantity"
              className="input"
            />
            <input
              value={role.winCondition}
              onChange={(e) => updateRole(index, 'winCondition', e.target.value)}
              placeholder="Win Condition"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addRole} className="btn btn-secondary mt-2">Add Role</button>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={prev} className="btn btn-secondary">Back</button>
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </form>
  );
};

export default Step7_GameMechanics;