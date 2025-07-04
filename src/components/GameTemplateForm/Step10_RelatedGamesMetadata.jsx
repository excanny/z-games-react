import React, { useState } from 'react';

const Step10_RelatedGamesMetadata = ({ next, prev, data }) => {
  const [relatedGames, setRelatedGames] = useState(data.relatedGames || []);
  const [tags, setTags] = useState(data.tags || []);
  const [notes, setNotes] = useState(data.notes || '');
  const [createdBy, setCreatedBy] = useState(data.createdBy || 'Game Master');
  const [isActive, setIsActive] = useState(data.isActive ?? true);

  const addItem = (setter, current) => setter([...current, '']);
  const updateItem = (setter, current, index, value) => {
    const updated = [...current];
    updated[index] = value;
    setter(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create the final payload
    const finalPayload = {
      relatedGames,
      tags,
      notes,
      createdBy,
      isActive
    };
    
    // Console log the final payload
    console.log('Final Step 10 Payload:', finalPayload);
    console.log('Related Games:', relatedGames);
    console.log('Tags:', tags);
    console.log('Notes:', notes);
    console.log('Created By:', createdBy);
    console.log('Is Active:', isActive);
    
    // Pass the payload to the next function
    next(finalPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-2">Related Games</h2>
        {relatedGames.map((game, index) => (
          <input
            key={index}
            value={game}
            onChange={(e) => updateItem(setRelatedGames, relatedGames, index, e.target.value)}
            placeholder={`Related Game ${index + 1}`}
            className="input"
          />
        ))}
        <button type="button" onClick={() => addItem(setRelatedGames, relatedGames)} className="btn btn-secondary mt-2">Add Related Game</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Tags</h2>
        {tags.map((tag, index) => (
          <input
            key={index}
            value={tag}
            onChange={(e) => updateItem(setTags, tags, index, e.target.value)}
            placeholder={`Tag ${index + 1}`}
            className="input"
          />
        ))}
        <button type="button" onClick={() => addItem(setTags, tags)} className="btn btn-secondary mt-2">Add Tag</button>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Game Notes"
          className="input"
        />
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-2">Metadata</h2>
        <input
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          placeholder="Created By"
          className="input"
        />

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span>Is Active</span>
        </label>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={prev} className="btn btn-secondary">Back</button>
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </form>
  );
};

export default Step10_RelatedGamesMetadata;