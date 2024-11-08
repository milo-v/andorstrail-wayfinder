import React, { useState } from 'react';

const CombatSimulatorPage = () => {
  const [characterLevel, setCharacterLevel] = useState(1);
  const baseStats = { AC: 80, AD: 1, HP: 25, BC: 0 };
  const [stats, setStats] = useState(baseStats);
  const [skills, setSkills] = useState({});
  const equipmentList = ['None', 'Sword', 'Shield', 'Bow', 'Staff', 'Dagger', 'Armor', 'Helmet', 'Ring', 'Boots'];

  // Equipment state with initial values as "None"
  const [equipment, setEquipment] = useState({
    hat: 'None',
    clothes: 'None',
    necklace: 'None',
    mainHand: 'None',
    offHand: 'None',
    ring1: 'None',
    ring2: 'None',
    gloves: 'None',
    boots: 'None'
  });

  const [remainingIncrements, setRemainingIncrements] = useState(0);
  // const [currentTotalIncrements, setCurrentTotalIncrements] = useState(0)
  const [skillPoints, setSkillPoints] = useState(0);

  console.log("remainingIncrements", remainingIncrements)


  // Update remaining increments and skill points when level changes
  const handleLevelChange = (e) => {
    const newLevel = Number(e.target.value);
    const levelDiff = Math.max(newLevel - 1, 0);
    console.log("level change", newLevel, levelDiff)
    setCharacterLevel(newLevel);
    setRemainingIncrements(levelDiff);

    // Calculate skill points (1 point for every 4 levels starting at level 4)
    const newSkillPoints = Math.floor(newLevel / 4);
    setSkillPoints(newSkillPoints);
  };

  // Increment values for each stat
  const incrementValues = {
    AC: 5,
    AD: 1,
    HP: 5,
    BC: 3,
  };

  const handleStatChange = (stat, amount) => {
    console.log("click")
    const currentTotalIncrements = Object.keys(stats).reduce(
      (sum, key) => sum + (stats[key] - baseStats[key]) / incrementValues[key],
      0
    );
    console.log("currentTotalIncrements", currentTotalIncrements)

    // Check if increment exceeds remaining increments
    if (amount > 0 && currentTotalIncrements >= remainingIncrements) {
      console.log('Exceeded remaining increments');
      return; // Stop increment if it exceeds remaining increments
    }

    // Correct state update based on previous state
    setStats((prevStats) => {
      console.log("setting stats", stat, prevStats[stat], amount, incrementValues[stat])
      const newStatValue = prevStats[stat] + amount * incrementValues[stat];
      console.log("newStatValue", newStatValue)

      // Ensure stat doesn't go below the base value
      if (newStatValue >= baseStats[stat]) {
        return {
          ...prevStats,
          [stat]: newStatValue,
        };
      }
      console.log("return previous state")
      return prevStats; // Return previous state if new value is below base stat
    });
  };

  const handleSkillChange = (skill, amount) => {
    const currentTotalSkillPoints = Object.values(skills).reduce((sum, value) => sum + value, 0);

    // Prevent increment if it exceeds available skill points
    if (amount > 0 && currentTotalSkillPoints >= skillPoints) {
      return;
    }

    setSkills((prevSkills) => ({
      ...prevSkills,
      [skill]: Math.max(0, (prevSkills[skill] || 0) + amount)
    }));
  };

  const handleEquipmentChange = (type, value) => {
    setEquipment((prevEquipment) => ({
      ...prevEquipment,
      [type]: value
    }));
  };

  const currentTotalIncrements = Object.keys(stats).reduce(
    (sum, key) => sum + (stats[key] - baseStats[key]) / incrementValues[key],
    0
  );

  const currentTotalSkillPoints = Object.values(skills).reduce((sum, value) => sum + value, 0);

  return (
    <div>
      <h1>Character Page</h1>

      {/* Character Level */}
      <label>
        Level:
        <input
          type="number"
          value={characterLevel}
          onChange={handleLevelChange}
          min="1"
        />
      </label>

      {/* Stats Section */}
      <h2>Stats</h2>
      {Object.keys(stats).map((stat) => (
        <div key={stat}>
          <label>{stat.charAt(0).toUpperCase() + stat.slice(1)}: {stats[stat]}</label>
          <button onClick={() => handleStatChange(stat, 1)}>+</button>
          <button onClick={() => handleStatChange(stat, -1)} disabled={stats[stat] <= baseStats[stat]}>-</button>
        </div>
      ))}
      <p>Remaining Stat Increments: {remainingIncrements - currentTotalIncrements}</p>

      {/* Reminder message if stat increments are lower than allowed */}
      {currentTotalIncrements < remainingIncrements && (
        <p style={{ color: 'orange' }}>
          Note: You have unused stat points available. Increase your stats up to {remainingIncrements} times.
        </p>
      )}

      {/* Skills Section */}
      <h2>Skills</h2>
      {['Skill1', 'Skill2', 'Skill3', 'Skill4'].map((skill) => (
        <div key={skill}>
          <label>{skill}: {skills[skill] || 0}</label>
          <button onClick={() => handleSkillChange(skill, 1)}>+</button>
          <button onClick={() => handleSkillChange(skill, -1)} disabled={(skills[skill] || 0) <= 0}>-</button>
        </div>
      ))}
      <p>Remaining Skill Points: {skillPoints - currentTotalSkillPoints}</p>

      {/* Reminder message if skill points are lower than allowed */}
      {currentTotalSkillPoints < skillPoints && (
        <p style={{ color: 'orange' }}>
          Note: You have unused skill points available. Allocate up to {skillPoints} points.
        </p>
      )}

      {/* Equipment Section */}
      <h2>Equipment</h2>
      {Object.keys(equipment).map((type) => (
        <div key={type}>
          <label>{type.charAt(0).toUpperCase() + type.slice(1)}:</label>
          <select
            value={equipment[type]}
            onChange={(e) => handleEquipmentChange(type, e.target.value)}
          >
            {equipmentList.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default CombatSimulatorPage;
