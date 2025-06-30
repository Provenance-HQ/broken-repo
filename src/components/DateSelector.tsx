import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

interface DateSelectorProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  value,
  onChange,
  placeholder = "Select date"
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(value || '');
  
  const handleDateChange = (dateString: string) => {
    if (!dateString) {
      setSelectedDate('');
      onChange('');
      return;
    }

    const isoString = (new Date(dateString)).toISOString();
    
    setSelectedDate(dateString);
    onChange(isoString);
  };

  const displayDate = selectedDate ? 
    format(utcToZonedTime(parseISO(selectedDate), "UTC"), 'PPP') : 
    '';

  return (
    <div className="date-selector">
      <div className="date-input">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          placeholder={placeholder}
        />
        {displayDate && (
          <div className="date-display">
            Selected: {displayDate}
          </div>
        )}
      </div>
    </div>
  );
};
