import React, { useState, useEffect } from 'react';
import DishCard from './DishCard';

function PlateIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  );
}

function CheckCircleIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function App() {
  const [dishes, setDishes] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('http://127.0.0.1:8000/api/dishes/stream');

    eventSource.onopen = () => setIsConnected(true);

    eventSource.onmessage = (event) => {
      const updatedDishes = JSON.parse(event.data);
      setDishes(updatedDishes);
    };
    eventSource.onerror = (error) => {
      console.error("SSE connection lost. Reconnecting...", error);
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleTogglePublish = async (dishId) => {
    setDishes(prevDishes =>
      prevDishes.map(dish =>
        dish.dishId === dishId
          ? { ...dish, isPublished: !dish.isPublished }
          : dish
      )
    );

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/dishes/${dishId}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to update status on server');
      }
    } catch (error) {
      console.error("Error updating dish status:", error);
    }
  };

  const publishedCount = dishes.filter(d => d.isPublished).length;
  const unpublishedCount = dishes.length - publishedCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-gray-50 to-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-6 border-b border-gray-200/70">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dish Management</h1>
              <p className="text-sm text-gray-500">Keep your menu fresh and up to date</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700 ring-1 ring-gray-200 shadow-sm">
                <PlateIcon className="h-3.5 w-3.5 text-gray-400" />
                {dishes.length} total
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                <CheckCircleIcon className="h-3.5 w-3.5" />
                {publishedCount} published
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
                {unpublishedCount} unpublished
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-500 ring-1 ring-gray-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                {isConnected && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    isConnected ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                />
              </span>
              {isConnected ? 'Live' : 'Connecting…'}
            </div>
          </div>
        </div>

        {dishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-gray-300 rounded-2xl bg-white/60">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-4">
              <PlateIcon className="h-6 w-6" />
            </div>
            <p className="text-gray-900 font-medium mb-1">No dishes yet</p>
            <p className="text-sm text-gray-500">Dishes will show up here as soon as they're added.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {dishes.map(dish => (
              <DishCard
                key={dish.dishId}
                dish={dish}
                onToggle={handleTogglePublish}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}