'use client';

import { useState, useEffect } from 'react';

type Entry = {
  food: string;
  calories: number;
  date: string;
};

export default function Home() {
  const [food, setFood] = useState('');
  const [calories, setCalories] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [summary, setSummary] = useState('');

  const fetchEntries = async () => {
    const res = await fetch('/api/log-calorie');
    const data = await res.json();
    setEntries(data.entries);
    setSummary(data.summary || '');
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAdd = async () => {
    const res = await fetch('/api/log-calorie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food, calories: Number(calories) }),
    });
    const data = await res.json();
    setEntries(data.entries);
    setSummary(data.summary || '');
    setFood('');
    setCalories('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Daily Calorie Logger</h1>

      <div className="mb-4">
        <input
          placeholder="Food"
          value={food}
          onChange={(e) => setFood(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          placeholder="Calories"
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white p-2 rounded">
          Add
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Entries</h2>
      <ul className="mb-4">
        {entries.map((entry, i) => (
          <li key={i}>
            {entry.food}: {entry.calories} kcal
          </li>
        ))}
      </ul>

      {summary && (
        <div className="bg-gray-100 p-2 rounded">
          <strong>Summary:</strong> {summary}
        </div>
      )}
    </div>
  );
}
