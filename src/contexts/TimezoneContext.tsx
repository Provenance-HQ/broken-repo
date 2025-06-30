import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

interface TimezoneContextType {
  userTimezone: string;
  setUserTimezone: (timezone: string) => void;
  convertToUserTimezone: (utcDate: Date) => Date;
  convertToUtc: (localDate: Date) => Date;
  availableTimezones: string[];
}

const TimezoneContext = createContext<TimezoneContextType | undefined>(undefined);

const AVAILABLE_TIMEZONES = [
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland'
];

export const TimezoneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userTimezone, setUserTimezoneState] = useState<string>('America/New_York');

  useEffect(() => {
    // Load user's timezone preference from user profile/settings
    const savedTimezone = localStorage.getItem('user_timezone_preference');
    if (savedTimezone && AVAILABLE_TIMEZONES.includes(savedTimezone)) {
      setUserTimezoneState(savedTimezone);
    } else {
      // Fallback to browser timezone detection
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (AVAILABLE_TIMEZONES.includes(browserTimezone)) {
        setUserTimezoneState(browserTimezone);
      }
    }
  }, []);

  const setUserTimezone = (timezone: string) => {
    if (AVAILABLE_TIMEZONES.includes(timezone)) {
      setUserTimezoneState(timezone);
      localStorage.setItem('user_timezone_preference', timezone);
    }
  };

  const convertToUserTimezone = (utcDate: Date): Date => {
    return utcToZonedTime(utcDate, userTimezone);
  };

  const convertToUtc = (localDate: Date): Date => {
    return zonedTimeToUtc(localDate, userTimezone);
  };

  const value: TimezoneContextType = {
    userTimezone,
    setUserTimezone,
    convertToUserTimezone,
    convertToUtc,
    availableTimezones: AVAILABLE_TIMEZONES
  };

  return (
    <TimezoneContext.Provider value={value}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezone = (): TimezoneContextType => {
  const context = useContext(TimezoneContext);
  if (!context) {
    throw new Error('useTimezone must be used within a TimezoneProvider');
  }
  return context;
};
