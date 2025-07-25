import React from 'react';

const StarRating = ({ rating, maxRating = 5 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const fullStarPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2l-2.81 6.63L2 9.24l5.46 4.73L5.82 21z";
  const leftHalfStarPath = "M12 4.24v11.75l-5.78 3.5 1.44-6.2-4.83-4.16 6.34-.54z";

  return (
    <div className="flex items-center text-yellow-500">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-5 h-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d={fullStarPath} />
        </svg>
      ))}

      {hasHalfStar && (
        <svg
          className="w-5 h-5 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d={fullStarPath} className="text-gray-300" /> 
          <path d={leftHalfStarPath} className="text-yellow-500" />
        </svg>
      )}

      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 fill-current text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d={fullStarPath} />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;

// I used Google Gemini to understand the logic behind the star rating system and how to implement it effectively