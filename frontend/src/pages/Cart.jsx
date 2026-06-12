import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty. <Link to="/catalog" className="text-brand-600 underline">Continue shopping</Link></p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded shadow">
                <div className="flex items-center space-x-4">
                  <img src={item.images?.[0]?.url || 'https://via.placeholder.com/80'} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">₦{item.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                      className="px-2 py-1 text-lg hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                      className="px-2 py-1 text-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white p-6 rounded shadow">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-4 block w-full text-center bg-brand-500 text-white py-3 rounded-md font-semibold hover:bg-brand-700 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;