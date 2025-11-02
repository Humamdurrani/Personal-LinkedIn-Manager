import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { generateContent } from '../services/geminiService';

const MIN_LENGTH = 5;

const timezones = [
    // North America
    { continent: 'North America', label: 'Atlanta (EST)', value: 'America/New_York' },
    { continent: 'North America', label: 'Boston (EST)', value: 'America/New_York' },
    { continent: 'North America', label: 'Chicago (CST)', value: 'America/Chicago' },
    { continent: 'North America', label: 'Dallas (CST)', value: 'America/Chicago' },
    { continent: 'North America', label: 'Denver (MST)', value: 'America/Denver' },
    { continent: 'North America', label: 'Houston (CST)', value: 'America/Chicago' },
    { continent: 'North America', label: 'Los Angeles (PST)', value: 'America/Los_Angeles' },
    { continent: 'North America', label: 'Mexico City (CST)', value: 'America/Mexico_City' },
    { continent: 'North America', label: 'Miami (EST)', value: 'America/New_York' },
    { continent: 'North America', label: 'Montreal (EST)', value: 'America/Toronto' },
    { continent: 'North America', label: 'New York (EST)', value: 'America/New_York' },
    { continent: 'North America', label: 'Phoenix (MST)', value: 'America/Phoenix' },
    { continent: 'North America', label: 'San Francisco (PST)', value: 'America/Los_Angeles' },
    { continent: 'North America', label: 'Seattle (PST)', value: 'America/Los_Angeles' },
    { continent: 'North America', label: 'Toronto (EST)', value: 'America/Toronto' },
    { continent: 'North America', label: 'Vancouver (PST)', value: 'America/Vancouver' },
    { continent: 'North America', label: 'Washington D.C. (EST)', value: 'America/New_York' },

    // South America
    { continent: 'South America', label: 'Bogota (COT)', value: 'America/Bogota' },
    { continent: 'South America', label: 'Buenos Aires (ART)', value: 'America/Argentina/Buenos_Aires' },
    { continent: 'South America', label: 'Caracas (VET)', value: 'America/Caracas' },
    { continent: 'South America', label: 'Lima (PET)', value: 'America/Lima' },
    { continent: 'South America', label: 'Rio de Janeiro (BRT)', value: 'America/Sao_Paulo' },
    { continent: 'South America', label: 'Santiago (CLT)', value: 'America/Santiago' },
    { continent: 'South America', label: 'São Paulo (BRT)', value: 'America/Sao_Paulo' },

    // Europe
    { continent: 'Europe', label: 'Amsterdam (CET)', value: 'Europe/Amsterdam' },
    { continent: 'Europe', label: 'Berlin (CET)', value: 'Europe/Berlin' },
    { continent: 'Europe', label: 'Brussels (CET)', value: 'Europe/Brussels' },
    { continent: 'Europe', label: 'Copenhagen (CET)', value: 'Europe/Copenhagen' },
    { continent: 'Europe', label: 'Dublin (GMT/IST)', value: 'Europe/Dublin' },
    { continent: 'Europe', label: 'Frankfurt (CET)', value: 'Europe/Berlin' },
    { continent: 'Europe', label: 'Helsinki (EET)', value: 'Europe/Helsinki' },
    { continent: 'Europe', label: 'Istanbul (TRT)', value: 'Europe/Istanbul' },
    { continent: 'Europe', label: 'Lisbon (WET)', value: 'Europe/Lisbon' },
    { continent: 'Europe', label: 'London (GMT/BST)', value: 'Europe/London' },
    { continent: 'Europe', label: 'Madrid (CET)', value: 'Europe/Madrid' },
    { continent: 'Europe', label: 'Milan (CET)', value: 'Europe/Rome' },
    { continent: 'Europe', label: 'Moscow (MSK)', value: 'Europe/Moscow' },
    { continent: 'Europe', label: 'Munich (CET)', value: 'Europe/Berlin' },
    { continent: 'Europe', label: 'Oslo (CET)', value: 'Europe/Oslo' },
    { continent: 'Europe', label: 'Paris (CET)', value: 'Europe/Paris' },
    { continent: 'Europe', label: 'Prague (CET)', value: 'Europe/Prague' },
    { continent: 'Europe', label: 'Rome (CET)', value: 'Europe/Rome' },
    { continent: 'Europe', label: 'Stockholm (CET)', value: 'Europe/Stockholm' },
    { continent: 'Europe', label: 'Vienna (CET)', value: 'Europe/Vienna' },
    { continent: 'Europe', label: 'Warsaw (CET)', value: 'Europe/Warsaw' },
    { continent: 'Europe', label: 'Zurich (CET)', value: 'Europe/Zurich' },

    // Africa
    { continent: 'Africa', label: 'Accra (GMT)', value: 'Africa/Accra' },
    { continent: 'Africa', label: 'Cairo (EET)', value: 'Africa/Cairo' },
    { continent: 'Africa', label: 'Cape Town (SAST)', value: 'Africa/Johannesburg' },
    { continent: 'Africa', label: 'Casablanca (WET)', value: 'Africa/Casablanca' },
    { continent: 'Africa', label: 'Dakar (GMT)', value: 'Africa/Dakar' },
    { continent: 'Africa', label: 'Johannesburg (SAST)', value: 'Africa/Johannesburg' },
    { continent: 'Africa', label: 'Lagos (WAT)', value: 'Africa/Lagos' },
    { continent: 'Africa', label: 'Nairobi (EAT)', value: 'Africa/Nairobi' },

    // Asia
    { continent: 'Asia', label: 'Abu Dhabi (GST)', value: 'Asia/Dubai' },
    { continent: 'Asia', label: 'Bangkok (ICT)', value: 'Asia/Bangkok' },
    { continent: 'Asia', label: 'Beijing (CST)', value: 'Asia/Shanghai' },
    { continent: 'Asia', label: 'Doha (AST)', value: 'Asia/Qatar' },
    { continent: 'Asia', label: 'Dubai (GST)', value: 'Asia/Dubai' },
    { continent: 'Asia', label: 'Ho Chi Minh City (ICT)', value: 'Asia/Ho_Chi_Minh' },
    { continent: 'Asia', label: 'Hong Kong (HKT)', value: 'Asia/Hong_Kong' },
    { continent: 'Asia', label: 'Jakarta (WIB)', value: 'Asia/Jakarta' },
    { continent: 'Asia', label: 'Karachi (PKT)', value: 'Asia/Karachi' },
    { continent: 'Asia', label: 'Kuala Lumpur (MYT)', value: 'Asia/Kuala_Lumpur' },
    { continent: 'Asia', label: 'Manila (PHT)', value: 'Asia/Manila' },
    { continent: 'Asia', label: 'Mumbai (IST)', value: 'Asia/Kolkata' },
    { continent: 'Asia', label: 'Riyadh (AST)', value: 'Asia/Riyadh' },
    { continent: 'Asia', label: 'Seoul (KST)', value: 'Asia/Seoul' },
    { continent: 'Asia', label: 'Shanghai (CST)', value: 'Asia/Shanghai' },
    { continent: 'Asia', label: 'Singapore (SGT)', value: 'Asia/Singapore' },
    { continent: 'Asia', label: 'Taipei (CST)', value: 'Asia/Taipei' },
    { continent: 'Asia', label: 'Tel Aviv (IST)', value: 'Asia/Jerusalem' },
    { continent: 'Asia', label: 'Tokyo (JST)', value: 'Asia/Tokyo' },

    // Australia/Oceania
    { continent: 'Australia/Oceania', label: 'Auckland (NZST)', value: 'Pacific/Auckland' },
    { continent: 'Australia/Oceania', label: 'Brisbane (AEST)', value: 'Australia/Brisbane' },
    { continent: 'Australia/Oceania', label: 'Melbourne (AEST)', value: 'Australia/Melbourne' },
    { continent: 'Australia/Oceania', label: 'Perth (AWST)', value: 'Australia/Perth' },
    { continent: 'Australia/Oceania', label: 'Sydney (AEST)', value: 'Australia/Sydney' },
    { continent: 'Australia/Oceania', label: 'Wellington (NZST)', value: 'Pacific/Auckland' },
];

const groupedTimezones = timezones.reduce((acc, tz) => {
    if (!acc[tz.continent]) {
        acc[tz.continent] = [];
    }
    acc[tz.continent].push(tz);
    return acc;
}, {} as Record<string, typeof timezones>);

const PostTimeFinder: React.FC = () => {
  const [industry, setIndustry] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
  const [localTime, setLocalTime] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timerId = setInterval(() => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString());
      setTargetTime(now.toLocaleTimeString('en-US', { timeZone: selectedTimezone, hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timerId);
  }, [selectedTimezone]);

  const handleFindTimes = async () => {
    const trimmedIndustry = industry.trim();
    if (!trimmedIndustry) {
      setError('Please enter your industry.');
      return;
    }
     if (trimmedIndustry.length < MIN_LENGTH) {
      setError(`Please provide a more descriptive industry (at least ${MIN_LENGTH} characters).`);
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const prompt = `
      Based on the 2025 LinkedIn strategy, what are the optimal posting times for someone in the "${industry}" industry?
      My target audience is primarily located in the region with the timezone "${selectedTimezone}". My local timezone is "${userTimezone}".
      
      Provide the top 3 best time slots (including days of the week). For each slot, provide the time in BOTH the target timezone (${selectedTimezone}) AND my local timezone (${userTimezone}).
      
      Explain the strategic reasoning behind each suggestion, citing principles from the strategy document like engagement windows and audience behavior for professionals in that industry and region.
    `;

    try {
      const response = await generateContent(prompt);
      setResult(response);
    } catch (err) {
      setError('An error occurred while finding the best posting times. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Post Time Finder">
      <div className="grid grid-cols-2 gap-4 mb-6 text-center">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm font-medium text-gray-500">Your Local Time</p>
          <p className="text-2xl font-bold text-gray-800">{localTime}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-blue-800">Target Time</p>
          <p className="text-2xl font-bold text-blue-800">{targetTime}</p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600">
          Select your target audience's location and describe your industry to discover the best times to post on LinkedIn.
        </p>
        <div>
          <label htmlFor="audience-location" className="block text-sm font-medium text-gray-700">Target Audience Location</label>
          <select
            id="audience-location"
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
          >
            {Object.entries(groupedTimezones).map(([continent, zones]) => (
                <optgroup label={continent} key={continent}>
                    {zones.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                </optgroup>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Your Industry</label>
          <input
            id="industry"
            type="text"
            value={industry}
            onChange={(e) => {
              setIndustry(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g., Enterprise SaaS, Healthcare Technology"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1"
          />
        </div>
        <Button onClick={handleFindTimes} isLoading={isLoading} disabled={!industry.trim()}>
          Find Best Times to Post
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {isLoading && <p className="text-gray-500 mt-2">Analyzing posting patterns...</p>}
        {result && (
          <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Optimal Posting Times:</h3>
            <pre className="whitespace-pre-wrap font-sans text-gray-700">{result}</pre>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PostTimeFinder;