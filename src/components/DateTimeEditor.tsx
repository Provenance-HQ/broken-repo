import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

interface DateTimeEditorProps {
  value?: string; // ISO string or moment-parseable date
  onChange: (isoString: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  showTimezone?: boolean;
  format?: string;
}

export const DateTimeEditor: React.FC<DateTimeEditorProps> = ({
  value,
  onChange,
  placeholder = "Select date and time",
  label,
  disabled = false,
  showTimezone = true,
  format = 'YYYY-MM-DDTHH:mm'
}) => {
  const [localDateTime, setLocalDateTime] = useState<string>('');
  const [userTimezone, setUserTimezone] = useState<string>('');

  useEffect(() => {
    // Get user's timezone from moment
    const timezone = moment.tz.guess();
    setUserTimezone(timezone);

    // Convert incoming value to local datetime for input
    if (value) {
      const momentValue = moment(value);
      if (momentValue.isValid()) {
        // Convert to user's timezone and format for datetime-local input
        const localValue = momentValue.tz(timezone).format('YYYY-MM-DDTHH:mm');
        setLocalDateTime(localValue);
      }
    }
  }, [value]);

  const handleDateTimeChange = (dateTimeString: string) => {
    setLocalDateTime(dateTimeString);
    
    if (!dateTimeString) {
      onChange('');
      return;
    }

    try {
      // Parse the datetime string in the user's timezone
      const localMoment = moment.tz(dateTimeString, userTimezone);
      
      if (localMoment.isValid()) {
        // Convert to UTC and return as ISO string
        const utcIsoString = localMoment.utc().toISOString();
        onChange(utcIsoString);
      } else {
        console.warn('Invalid datetime provided:', dateTimeString);
        onChange('');
      }
    } catch (error) {
      console.error('Error converting datetime:', error);
      onChange('');
    }
  };

  const getDisplayValue = () => {
    if (!value) return '';
    
    const momentValue = moment(value);
    if (momentValue.isValid()) {
      return momentValue.tz(userTimezone).format('MMMM Do YYYY, h:mm A');
    }
    return '';
  };

  const getTimezoneDisplay = () => {
    if (!userTimezone) return '';
    
    const abbreviation = moment.tz(userTimezone).format('z');
    const offset = moment.tz(userTimezone).format('Z');
    return `${userTimezone} (${abbreviation} ${offset})`;
  };

  return (
    <div className="datetime-editor">
      {label && (
        <label htmlFor="datetime-input" className="datetime-label">
          {label}
        </label>
      )}
      
      <div className="datetime-input-container">
        <input
          id="datetime-input"
          type="datetime-local"
          value={localDateTime}
          onChange={(e) => handleDateTimeChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="datetime-input"
        />
        
        {showTimezone && userTimezone && (
          <div className="timezone-info">
            <small className="timezone-display">
              {getTimezoneDisplay()}
            </small>
          </div>
        )}
      </div>

      {value && (
        <div className="datetime-preview">
          <small className="preview-text">
            Preview: {getDisplayValue()}
          </small>
        </div>
      )}
    </div>
  );
};

export default DateTimeEditor;
