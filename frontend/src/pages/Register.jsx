import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const submit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create Account</h1>
      {error && <p className="text-red-500 mb-4">{error.message || 'Registration failed'}</p>}
      <form onSubmit={submit} className="space-y-4">
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" required />
        <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded px-3 py-2" required />
        <button type="submit" disabled={loading} className="w-full bg-brand-500 text-white py-2 rounded-md hover:bg-brand-700 transition">
          {loading ? 'Creating...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Already have an account? <Link to="/login" className="text-brand-600">Login</Link>
      </p>
    </div>
  );
};

export default Register;