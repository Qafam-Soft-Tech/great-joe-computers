import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../store/slices/cartSlice';
import axios from 'axios';

const statesLGAs = [
  { state: 'Lagos', cities: ['Ikeja', 'Surulere', 'Lekki', 'Victoria Island'] },
  { state: 'Abuja', cities: ['Garki', 'Wuse', 'Maitama'] },
  { state: 'Rivers', cities: ['Port Harcourt', 'Obio-Akpor'] },
  // more can be added
];

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: user?.shippingAddress?.street || '',
    city: user?.shippingAddress?.city || '',
    state: user?.shippingAddress?.state || '',
    zip: '',
  });

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const availableCities = statesLGAs.find((s) => s.state === address.state)?.cities || [];

  const payWithPaystack = async () => {
    const token = localStorage.getItem('token');
    try {
      // 1. Create order in backend
      const orderRes = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: items.map((i) => ({ product: i._id, quantity: i.quantity })),
          shippingAddress: address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const order = orderRes.data.data;

      // 2. Launch Paystack Popup
      const handler = window.PaystackPop.setup({
        key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'YOUR_PAYSTACK_PUBLIC_KEY',
        email: user.email,
        amount: total * 100, // Paystack expects kobo
        currency: 'NGN',
        ref: `GJC-${Date.now()}`,
        callback: async (response) => {
          // Verify payment with backend
          await axios.post(
            'http://localhost:5000/api/orders/verify',
            { reference: response.reference, orderId: order._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          dispatch(clearCart());
          navigate('/order-success');
        },
        onClose: () => {
          alert('Payment cancelled');
        },
      });
      handler.openIframe();
    } catch (error) {
      console.error(error);
      alert('Checkout failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
        <div className="space-y-4">
          <input name="street" value={address.street} onChange={handleChange} placeholder="Street address" className="w-full border rounded px-3 py-2" required />
          <div className="grid grid-cols-2 gap-4">
            <select name="state" value={address.state} onChange={handleChange} className="border rounded px-3 py-2" required>
              <option value="">Select State</option>
              {statesLGAs.map((s) => (
                <option key={s.state} value={s.state}>{s.state}</option>
              ))}
            </select>
            <select name="city" value={address.city} onChange={handleChange} className="border rounded px-3 py-2" required>
              <option value="">Select City</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <input name="zip" value={address.zip} onChange={handleChange} placeholder="Zip / Postal Code" className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {items.map((item) => (
          <div key={item._id} className="flex justify-between text-sm py-2">
            <span>{item.title} x {item.quantity}</span>
            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-xl">
          <span>Total</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
        <button
          onClick={payWithPaystack}
          className="mt-6 w-full bg-brand-500 text-white py-3 rounded-md font-semibold hover:bg-brand-700 transition"
        >
          Pay with Paystack
        </button>
      </div>
    </div>
  );
};

export default Checkout;