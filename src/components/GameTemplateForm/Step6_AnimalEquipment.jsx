// Step6_AnimalEquipment.jsx
import React, { useState } from 'react';

const Step6_AnimalEquipment = ({ next, prev, data }) => {
  const [animalSuperpowers, setAnimalSuperpowers] = useState(data.animalSuperpowers || []);
  const [equipment, setEquipment] = useState(data.equipment || []);

  const addPower = () => {
    setAnimalSuperpowers([...animalSuperpowers, { animal: '', power: '', usageLimit: '', applicableGames: [] }]);
  };

  const updatePower = (index, field, value) => {
    const updated = [...animalSuperpowers];
    updated[index][field] = value;
    setAnimalSuperpowers(updated);
  };

  const updateApplicableGames = (index, value) => {
    const updated = [...animalSuperpowers];
    updated[index].applicableGames = value.split(',').map(g => g.trim());
    setAnimalSuperpowers(updated);
  };

  const addEquipment = () => {
    setEquipment([...equipment, { item: '', quantity: 1, optional: false }]);
  };

  const updateEquipment = (index, field, value) => {
    const updated = [...equipment];
    updated[index][field] = value;
    setEquipment(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    next({ animalSuperpowers, equipment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-2">Animal Superpowers</h2>
        {animalSuperpowers.map((power, index) => (
          <div key={index} className="space-y-2">
            <input
              value={power.animal}
              onChange={(e) => updatePower(index, 'animal', e.target.value)}
              placeholder="Animal (e.g. Lion)"
              className="input"
            />
            <input
              value={power.power}
              onChange={(e) => updatePower(index, 'power', e.target.value)}
              placeholder="Power"
              className="input"
            />
            <input
              type="number"
              value={power.usageLimit}
              onChange={(e) => updatePower(index, 'usageLimit', Number(e.target.value))}
              placeholder="Usage Limit"
              className="input"
            />
            <input
              value={power.applicableGames?.join(', ') || ''}
              onChange={(e) => updateApplicableGames(index, e.target.value)}
              placeholder="Applicable Games (comma separated)"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addPower} className="btn btn-secondary mt-2">Add Superpower</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Equipment</h2>
        {equipment.map((equip, index) => (
          <div key={index} className="space-y-2">
            <input
              value={equip.item}
              onChange={(e) => updateEquipment(index, 'item', e.target.value)}
              placeholder="Item Name"
              className="input"
            />
            <input
              type="number"
              value={equip.quantity}
              onChange={(e) => updateEquipment(index, 'quantity', Number(e.target.value))}
              placeholder="Quantity"
              className="input"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={equip.optional}
                onChange={(e) => updateEquipment(index, 'optional', e.target.checked)}
              />
              <span>Optional</span>
            </label>
          </div>
        ))}
        <button type="button" onClick={addEquipment} className="btn btn-secondary mt-2">Add Equipment</button>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={prev} className="btn btn-secondary">Back</button>
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </form>
  );
};

export default Step6_AnimalEquipment;