import React from 'react';
import { useTimezone } from '../contexts/TimezoneContext';

export const TimezoneSelector: React.FC = () => {
  const { userTimezone, setUserTimezone, availableTimezones } = useTimezone();

  return (
    <div className="timezone-selector">
      <label htmlFor="timezone-select">Timezone:</label>
      <select 
        id="timezone-select"
        value={userTimezone} 
        onChange={(e) => setUserTimezone(e.target.value)}
        className="timezone-select"
      >
        {availableTimezones.map(tz => (
          <option key={tz} value={tz}>
            {tz.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  );
};

