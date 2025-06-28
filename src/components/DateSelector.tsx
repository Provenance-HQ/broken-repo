import React, { useState } from 'react';
import { format } from 'date-fns';

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

    const localDate = new Date(dateString);
    const isoString = localDate.toISOString();
    
    setSelectedDate(dateString);
    onChange(isoString);
  };

  const displayDate = selectedDate ? 
    format(new Date(selectedDate), 'PPP') : 
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
