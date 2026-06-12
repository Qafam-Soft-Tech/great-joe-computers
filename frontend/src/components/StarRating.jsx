import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating, max = 5 }) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div className="flex text-yellow-400">
      {stars.map((star) => (
        <FiStar
          key={star}
          className={star <= rating ? 'fill-current' : 'text-gray-300'}
          size={16}
        />
      ))}
    </div>
  );
};

export default StarRating;