"use client"

import { useEffect, useState } from "react";

interface ForecastData {
  daily: {
    time: string[];
    precipitation_probability_max: number[];
  };
}

const RainForecast = () => {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=9.85&longitude=76.9667&daily=precipitation_probability_max&forecast_days=16&timezone=auto"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data");
        }
        const data: ForecastData = await response.json();
        setForecast(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Rain Forecast (Next 16 Days)</h2>
      <table style={{ border: "1px solid white"}}>
        <thead>
          <tr>
            <th>Date</th>
            <th style={{paddingLeft:"10px"}}>Precipitation Probability (%)</th>
          </tr>
        </thead>
        <tbody>
          {forecast?.daily.time.map((date, index) => (
            <tr key={date}>
              <td>{date}</td>
              <td style={{paddingLeft:"10px"}}>{forecast.daily.precipitation_probability_max[index]}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RainForecast;
