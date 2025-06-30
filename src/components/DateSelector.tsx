import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTimezone } from '../contexts/TimezoneContext';

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
  const { userTimezone, convertToUtc, convertToUserTimezone } = useTimezone();

  const handleDateChange = (dateString: string) => {
    if (!dateString) {
      setSelectedDate('');
      onChange('');
      return;
    }

    try {
      // FIXED: Now uses TimezoneContext instead of basic Date constructor
      const localDate = new Date(dateString);
      const utcDate = convertToUtc(localDate);
      const isoString = utcDate.toISOString();
      
      setSelectedDate(dateString);
      onChange(isoString);
    } catch (error) {
      console.error('Error converting date with timezone:', error);
      // Fallback to basic date handling
      const fallbackDate = new Date(dateString);
      onChange(fallbackDate.toISOString());
    }
  };

  const displayDate = selectedDate ? 
    format(convertToUserTimezone(new Date(selectedDate)), 'PPP') : 
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
            Selected: {displayDate} ({userTimezone})
          </div>
        )}
      </div>
    </div>
  );
};
