import { useParams } from 'react-router-dom';

const OrderTracking = () => {
  const { id } = useParams();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">Order #{id}</h1>
      <p className="text-gray-500">Tracking details will appear here.</p>
    </div>
  );
};

export default OrderTracking;