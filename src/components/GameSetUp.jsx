import React, { useState } from 'react';
import { Plus, Minus, Clock, Users, Trophy, Tag, AlertCircle, CheckCircle } from 'lucide-react';

const GameSetup = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    gameType: '',
    difficulty: 'medium',
    duration: {
      estimatedMinutes: 30,
      hasTimeLimit: false,
      timeLimit: 0,
      roundTimeLimit: 0
    },
    teamConfiguration: {
      minPlayers: 2,
      maxPlayers: 8,
      teamBased: false,
      minTeams: 2,
      maxTeams: 4
    },
    ageRating: {
      minAge: 8,
      maxAge: 99,
      description: ''
    },
    tags: [],
    rules: [{ title: '', description: '', order: 1 }],
    scoringSystem: {
      basePoints: 10,
      bonusPoints: 5,
      penaltyPoints: 0,
      scoringMethod: 'fixed'
    },
    equipment: [],
    prizes: []
  });

  const [currentTag, setCurrentTag] = useState('');
  const [currentEquipment, setCurrentEquipment] = useState({ item: '', quantity: 1, optional: false });
  const [currentPrize, setCurrentPrize] = useState({ type: 'points', value: '', description: '', condition: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    'word_game', 'physical_game', 'skill_game', 'party_game',
    'elimination_game', 'team_game', 'individual_game', 'social_deduction'
  ];

  const gameTypes = ['competitive', 'cooperative', 'elimination', 'scoring', 'social'];
  const difficulties = ['easy', 'medium', 'hard'];
  const scoringMethods = ['fixed', 'variable', 'elimination', 'accumulative', 'position_based'];
  const prizeTypes = ['points', 'gift_card', 'physical_item', 'food', 'privilege'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleRuleChange = (index, field, value) => {
    const newRules = [...formData.rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setFormData(prev => ({ ...prev, rules: newRules }));
  };

  const addRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, { title: '', description: '', order: prev.rules.length + 1 }]
    }));
  };

  const removeRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addEquipment = () => {
    if (currentEquipment.item.trim()) {
      setFormData(prev => ({
        ...prev,
        equipment: [...prev.equipment, { ...currentEquipment }]
      }));
      setCurrentEquipment({ item: '', quantity: 1, optional: false });
    }
  };

  const removeEquipment = (index) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  const addPrize = () => {
    if (currentPrize.description.trim()) {
      setFormData(prev => ({
        ...prev,
        prizes: [...prev.prizes, { ...currentPrize }]
      }));
      setCurrentPrize({ type: 'points', value: '', description: '', condition: '' });
    }
  };

  const removePrize = (index) => {
    setFormData(prev => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Game created successfully!' });
        // Reset form or redirect
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to create game' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Game</h1>
        <p className="text-gray-600">Set up a new game with rules, scoring, and configuration</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Tag size={20} />
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game Type *
              </label>
              <select
                name="gameType"
                value={formData.gameType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select game type</option>
                {gameTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe how the game works..."
              required
            />
          </div>
        </div>

        {/* Duration & Timing */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} />
            Duration & Timing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Duration (minutes)
              </label>
              <input
                type="number"
                name="duration.estimatedMinutes"
                value={formData.duration.estimatedMinutes}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Game Time Limit (seconds)
              </label>
              <input
                type="number"
                name="duration.timeLimit"
                value={formData.duration.timeLimit}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Round Time Limit (seconds)
              </label>
              <input
                type="number"
                name="duration.roundTimeLimit"
                value={formData.duration.roundTimeLimit}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="duration.hasTimeLimit"
                checked={formData.duration.hasTimeLimit}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Game has time limit</span>
            </label>
          </div>
        </div>

        {/* Team Configuration */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users size={20} />
            Team Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Players
              </label>
              <input
                type="number"
                name="teamConfiguration.minPlayers"
                value={formData.teamConfiguration.minPlayers}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Players
              </label>
              <input
                type="number"
                name="teamConfiguration.maxPlayers"
                value={formData.teamConfiguration.maxPlayers}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="teamConfiguration.teamBased"
                checked={formData.teamConfiguration.teamBased}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Team-based game</span>
            </label>
          </div>
          {formData.teamConfiguration.teamBased && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Teams
                </label>
                <input
                  type="number"
                  name="teamConfiguration.minTeams"
                  value={formData.teamConfiguration.minTeams}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Teams
                </label>
                <input
                  type="number"
                  name="teamConfiguration.maxTeams"
                  value={formData.teamConfiguration.maxTeams}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Age Rating */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Age Rating</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Age
              </label>
              <input
                type="number"
                name="ageRating.minAge"
                value={formData.ageRating.minAge}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Age
              </label>
              <input
                type="number"
                name="ageRating.maxAge"
                value={formData.ageRating.maxAge}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Description
            </label>
            <input
              type="text"
              name="ageRating.description"
              value={formData.ageRating.description}
              onChange={handleInputChange}
              placeholder="e.g., Suitable for all ages"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Scoring System */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Trophy size={20} />
            Scoring System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Points
              </label>
              <input
                type="number"
                name="scoringSystem.basePoints"
                value={formData.scoringSystem.basePoints}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bonus Points
              </label>
              <input
                type="number"
                name="scoringSystem.bonusPoints"
                value={formData.scoringSystem.bonusPoints}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Penalty Points
              </label>
              <input
                type="number"
                name="scoringSystem.penaltyPoints"
                value={formData.scoringSystem.penaltyPoints}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scoring Method
              </label>
              <select
                name="scoringSystem.scoringMethod"
                value={formData.scoringSystem.scoringMethod}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {scoringMethods.map(method => (
                  <option key={method} value={method}>{method.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Game Rules */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Game Rules</h2>
          {formData.rules.map((rule, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-700">Rule {index + 1}</span>
                {formData.rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus size={16} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="text"
                  placeholder="Rule title"
                  value={rule.title}
                  onChange={(e) => handleRuleChange(index, 'title', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Rule description"
                  value={rule.description}
                  onChange={(e) => handleRuleChange(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addRule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Rule
          </button>
        </div>

        {/* Tags */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Add a tag"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Equipment</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
            <input
              type="text"
              placeholder="Equipment item"
              value={currentEquipment.item}
              onChange={(e) => setCurrentEquipment(prev => ({ ...prev, item: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={currentEquipment.quantity}
              onChange={(e) => setCurrentEquipment(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <label className="flex items-center gap-2 p-3">
              <input
                type="checkbox"
                checked={currentEquipment.optional}
                onChange={(e) => setCurrentEquipment(prev => ({ ...prev, optional: e.target.checked }))}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm">Optional</span>
            </label>
            <button
              type="button"
              onClick={addEquipment}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.equipment.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <span>
                  {item.item} (x{item.quantity}) {item.optional && <span className="text-gray-500">(Optional)</span>}
                </span>
                <button
                  type="button"
                  onClick={() => removeEquipment(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Prizes */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Prizes & Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
            <select
              value={currentPrize.type}
              onChange={(e) => setCurrentPrize(prev => ({ ...prev, type: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {prizeTypes.map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Value"
              value={currentPrize.value}
              onChange={(e) => setCurrentPrize(prev => ({ ...prev, value: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Description"
              value={currentPrize.description}
              onChange={(e) => setCurrentPrize(prev => ({ ...prev, description: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Condition"
              value={currentPrize.condition}
              onChange={(e) => setCurrentPrize(prev => ({ ...prev, condition: e.target.value }))}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addPrize}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add
            </button>
          </div>
          <div className="space-y-2">
            {formData.prizes.map((prize, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <span>
                  {prize.type} - {prize.description} ({prize.condition})
                </span>
                <button
                  type="button"
                  onClick={() => removePrize(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Game...' : 'Create Game'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameSetup;