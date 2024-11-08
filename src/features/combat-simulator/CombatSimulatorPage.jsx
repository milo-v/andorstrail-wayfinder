import React, { useState } from 'react';

const CombatSimulatorPage = () => {
  const [level, setLevel] = useState(1);
  const baseStats = { strength: 10, agility: 10, intelligence: 10, endurance: 10 };
  const [stats, setStats] = useState({ ...baseStats });
  const [skills, setSkills] = useState({ skill1: 0, skill2: 0, skill3: 0, skill4: 0 });
  const [equipment, setEquipment] = useState('');

  const handleLevelChange = (e) => {
    const newLevel = Math.max(1, parseInt(e.target.value, 10) || 1);
    setLevel(newLevel);
  };

  const modifyStat = (stat, change) => {
    setStats((prevStats) => {
      const newValue = prevStats[stat] + change;
      if (newValue >= baseStats[stat] && (change > 0 || level > 1)) {
        return { ...prevStats, [stat]: newValue };
      }
      return prevStats;
    });
  };

  const modifySkill = (skill, change) => {
    setSkills((prevSkills) => {
      const newValue = Math.max(0, prevSkills[skill] + change);
      return { ...prevSkills, [skill]: newValue };
    });
  };

  const handleEquipmentChange = (e) => {
    setEquipment(e.target.value);
  };

  return (
    <div>
      <h1>Character Management</h1>
      <div>
        <label>
          Character Level:
          <input type="number" value={level} onChange={handleLevelChange} min="1" />
        </label>
      </div>

      <h2>Stats</h2>
      {Object.keys(stats).map((stat) => (
        <div key={stat}>
          <label>{stat.charAt(0).toUpperCase() + stat.slice(1)}: {stats[stat]}</label>
          <button onClick={() => modifyStat(stat, 1)}>+</button>
          <button onClick={() => modifyStat(stat, -1)} disabled={stats[stat] <= baseStats[stat]}>
            -
          </button>
        </div>
      ))}

      <h2>Skills</h2>
      {Object.keys(skills).map((skill) => (
        <div key={skill}>
          <label>{skill.charAt(0).toUpperCase() + skill.slice(1)}: {skills[skill]}</label>
          <button onClick={() => modifySkill(skill, 1)}>+</button>
          <button onClick={() => modifySkill(skill, -1)} disabled={skills[skill] <= 0}>
            -
          </button>
        </div>
      ))}

      <h2>Equipment</h2>
      <select value={equipment} onChange={handleEquipmentChange}>
        <option value="">Select Equipment</option>
        {Array.from({ length: 10 }, (_, i) => (
          <option key={`equipment${i + 1}`} value={`equipment${i + 1}`}>
            Equipment {i + 1}
          </option>
        ))}
      </select>
      {equipment && <p>Selected Equipment: {equipment}</p>}
    </div>
  );
};

export default CombatSimulatorPage;
