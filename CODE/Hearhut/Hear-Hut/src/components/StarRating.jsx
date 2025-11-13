import React from "react";

function StarRating({ rating, reviews, showReviews = true }) {
  // Convert rating string (like "★★★★★") to number
  const getRatingNumber = (ratingStr) => {
    if (typeof ratingStr === "number") return ratingStr;
    const stars = ratingStr.match(/★/g)?.length || 0;
    const halfStar = ratingStr.includes("½") ? 0.5 : 0;
    return stars + halfStar;
  };

  const ratingNum = getRatingNumber(rating);
  const fullStars = Math.floor(ratingNum);
  const hasHalfStar = ratingNum % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => (
          <i key={i} className="fas fa-star"></i>
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="far fa-star"></i>
        ))}
      </div>
      {showReviews && reviews && (
        <span className="review-count">({reviews})</span>
      )}
    </div>
  );
}

export default StarRating;

