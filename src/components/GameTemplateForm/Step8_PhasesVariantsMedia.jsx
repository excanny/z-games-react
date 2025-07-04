// Step8_PhasesVariantsMedia.jsx
import React, { useState } from 'react';

const Step8_PhasesVariantsMedia = ({ next, prev, data }) => {
  const [phases, setPhases] = useState(data.phases || []);
  const [variants, setVariants] = useState(data.variants || []);
  const [mediaReferences, setMediaReferences] = useState(data.mediaReferences || []);

  const addPhase = () => setPhases([...phases, { name: '', description: '', order: phases.length + 1, actions: [''] }]);
  const updatePhase = (index, field, value) => {
    const updated = [...phases];
    updated[index][field] = value;
    setPhases(updated);
  };

  const addVariant = () => setVariants([...variants, { name: '', description: '', ruleModifications: [''], scoringModifications: {} }]);
  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const addMediaReference = () => setMediaReferences([...mediaReferences, { type: 'video', url: '', description: '' }]);
  const updateMediaReference = (index, field, value) => {
    const updated = [...mediaReferences];
    updated[index][field] = value;
    setMediaReferences(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    next({ phases, variants, mediaReferences });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-2">Game Phases</h2>
        {phases.map((phase, index) => (
          <div key={index} className="space-y-2">
            <input
              value={phase.name}
              onChange={(e) => updatePhase(index, 'name', e.target.value)}
              placeholder="Phase Name"
              className="input"
            />
            <textarea
              value={phase.description}
              onChange={(e) => updatePhase(index, 'description', e.target.value)}
              placeholder="Description"
              className="input"
            />
            <input
              type="number"
              value={phase.order}
              onChange={(e) => updatePhase(index, 'order', e.target.value)}
              placeholder="Order"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addPhase} className="btn btn-secondary mt-2">Add Phase</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Variants</h2>
        {variants.map((variant, index) => (
          <div key={index} className="space-y-2">
            <input
              value={variant.name}
              onChange={(e) => updateVariant(index, 'name', e.target.value)}
              placeholder="Variant Name"
              className="input"
            />
            <textarea
              value={variant.description}
              onChange={(e) => updateVariant(index, 'description', e.target.value)}
              placeholder="Description"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addVariant} className="btn btn-secondary mt-2">Add Variant</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Media References</h2>
        {mediaReferences.map((media, index) => (
          <div key={index} className="space-y-2">
            <select
              value={media.type}
              onChange={(e) => updateMediaReference(index, 'type', e.target.value)}
              className="input"
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="link">Link</option>
            </select>
            <input
              value={media.url}
              onChange={(e) => updateMediaReference(index, 'url', e.target.value)}
              placeholder="URL"
              className="input"
            />
            <input
              value={media.description}
              onChange={(e) => updateMediaReference(index, 'description', e.target.value)}
              placeholder="Description"
              className="input"
            />
          </div>
        ))}
        <button type="button" onClick={addMediaReference} className="btn btn-secondary mt-2">Add Media</button>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={prev} className="btn btn-secondary">Back</button>
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </form>
  );
};

export default Step8_PhasesVariantsMedia;