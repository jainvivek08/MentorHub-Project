import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

// Display-only stars, e.g. <StarRating value={4.3} />
// Interactive stars, e.g. <StarRating value={rating} onChange={setRating} interactive />
const StarRating = ({ value = 0, onChange, interactive = false, size = "text-base" }) => {
  const [hovered, setHovered] = useState(0);

  const displayValue = interactive && hovered ? hovered : value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          onClick={interactive ? () => onChange(star) : undefined}
          onMouseEnter={interactive ? () => setHovered(star) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          className={`${size} ${interactive ? "cursor-pointer" : ""} ${
            star <= Math.round(displayValue)
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
