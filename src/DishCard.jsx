import React from 'react';

function PublishedIcon({ className }) {
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

function UnpublishedIcon({ className }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 10-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 10-1.06-1.06L10 8.94 8.28 7.22z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function DishCard({ dish, onToggle }) {
  const { dishName, imageUrl, isPublished } = dish;

  return (
    <div className="group relative w-64 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
      <div
        className={`h-1 w-full ${
          isPublished
            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
            : 'bg-gradient-to-r from-amber-400 to-amber-500'
        }`}
      />

      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={dishName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent" />

        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full pl-1.5 pr-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md ${
            isPublished
              ? 'bg-emerald-50/95 text-emerald-700 ring-1 ring-emerald-200'
              : 'bg-amber-50/95 text-amber-700 ring-1 ring-amber-200'
          }`}
        >
          {isPublished ? (
            <PublishedIcon className="h-3.5 w-3.5" />
          ) : (
            <UnpublishedIcon className="h-3.5 w-3.5" />
          )}
          {isPublished ? 'Published' : 'Unpublished'}
        </span>
      </div>

      <div className="p-4 pt-3.5">
        <h3 className="text-base font-semibold text-gray-900 truncate mb-3 tracking-tight">
          {dishName}
        </h3>

        <button
          onClick={() => onToggle(dish.dishId)}
          className={`group/btn relative w-full overflow-hidden rounded-lg py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
            isPublished
              ? 'bg-gray-50 text-gray-700 ring-1 ring-gray-200 hover:bg-gray-100 hover:ring-gray-300 focus-visible:ring-gray-300'
              : 'bg-amber-600 text-white shadow-sm shadow-amber-600/30 hover:bg-amber-700 hover:shadow-amber-700/40 focus-visible:ring-amber-300'
          }`}
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-1.5">
            {isPublished ? (
              <UnpublishedIcon className="h-3.5 w-3.5 opacity-70" />
            ) : (
              <PublishedIcon className="h-3.5 w-3.5" />
            )}
            {isPublished ? 'Unpublish' : 'Publish'}
          </span>
        </button>
      </div>
    </div>
  );
}