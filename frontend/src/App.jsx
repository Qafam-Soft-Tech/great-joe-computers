import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './store/slices/authSlice';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SkeletonLoader from './components/SkeletonLoader';
import { Toaster } from 'react-hot-toast';

const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));
const AdminRoute = lazy(() => import('./components/AdminRoute'));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <Suspense fallback={<SkeletonLoader type="page" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/orders/:id" element={<PrivateRoute><OrderTracking /></PrivateRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;