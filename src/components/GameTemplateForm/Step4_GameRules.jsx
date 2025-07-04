// Step4_RulesSetup.jsx
import React, { useState } from 'react';

const Step4_RulesSetup = ({ next, prev, data }) => {
  const [rules, setRules] = useState(data.rules || []);
  const [instructions, setInstructions] = useState(data.setupInstructions || []);

  const addRule = () => setRules([...rules, { title: '', description: '', order: rules.length + 1 }]);
  const updateRule = (index, field, value) => {
    const updated = [...rules];
    updated[index][field] = value;
    setRules(updated);
  };

  const addInstruction = () => setInstructions([...instructions, '']);
  const updateInstruction = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    next({ rules, setupInstructions: instructions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-2">Game Rules</h2>
        {rules.map((rule, index) => (
          <div key={index} className="space-y-2">
            <input
              value={rule.title}
              onChange={(e) => updateRule(index, 'title', e.target.value)}
              placeholder="Rule Title"
              className="input"
            />
            <textarea
              value={rule.description}
              onChange={(e) => updateRule(index, 'description', e.target.value)}
              placeholder="Rule Description"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addRule} className="btn btn-secondary mt-2">Add Rule</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Setup Instructions</h2>
        {instructions.map((instruction, index) => (
          <input
            key={index}
            value={instruction}
            onChange={(e) => updateInstruction(index, e.target.value)}
            placeholder={`Instruction ${index + 1}`}
            className="input"
          />
        ))}
        <button type="button" onClick={addInstruction} className="btn btn-secondary mt-2">Add Instruction</button>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={prev} className="btn btn-secondary">Back</button>
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </form>
  );
};

export default Step4_RulesSetup;


// Tailwind utilities (you can add in your global CSS or as classes in JSX)
// .input { @apply w-full border border-gray-300 rounded p-2; }
// .btn-primary { @apply bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700; }
// .btn-secondary { @apply bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600; }