import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Rate = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center justify-center gap-2 mt-2">
        <p className="text-sm text-gray-400 mr-2">Rate this app:</p>
        {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <label key={index}>
                    <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        onClick={() => setRating(ratingValue)}
                        className="hidden"
                    />
                    <Star
                        className="cursor-pointer transition-colors duration-200"
                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                        fill={ratingValue <= (hover || rating) ? "#ffc107" : "none"}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                        size={20}
                    />
                </label>
            );
        })}
    </div>
  );
};

export default Rate;
