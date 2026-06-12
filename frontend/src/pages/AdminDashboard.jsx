import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { FiDollarSign, FiPackage, FiClock, FiTrendingUp, FiEdit, FiTrash2 } from 'react-icons/fi';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

const SummaryCard = ({ icon, title, value, color = 'text-brand-700' }) => (
  <div className="bg-white p-6 rounded-xl shadow flex items-center space-x-4">
    <div className="text-3xl text-brand-500">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordRes, prodRes] = await Promise.all([
          axios.get('http://localhost:5000/api/orders/admin', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/products'),
        ]);
        setOrders(ordRes.data.data);
        setProducts(prodRes.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // --- Computed metrics ---
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.paymentStatus === 'pending').length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / orders.filter(o => o.paymentStatus === 'paid').length || 0) : 0;

  // --- Monthly revenue data ---
  const monthlyRevenue = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + order.totalPrice;
      return acc;
    }, {});
  const barData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));

  // --- Category distribution (from products) ---
  const categoryCount = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

  // --- Order status distribution ---
  const statusCount = orders.reduce((acc, o) => {
    acc[o.deliveryStatus] = (acc[o.deliveryStatus] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <SummaryCard icon={<FiDollarSign />} title="Total Revenue" value={`₦${totalRevenue.toLocaleString()}`} />
        <SummaryCard icon={<FiPackage />} title="Total Orders" value={totalOrders} />
        <SummaryCard icon={<FiClock />} title="Pending Payments" value={pendingOrders} color="text-yellow-600" />
        <SummaryCard icon={<FiTrendingUp />} title="Avg. Order Value" value={`₦${Math.round(avgOrderValue).toLocaleString()}`} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Monthly Revenue Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Products by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Management Table */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Products ({products.length})</h2>
          <Link
            to="/admin/products/new"
            className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition"
          >
            + Add Product
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/40'}
                      alt={product.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span>{product.title}</span>
                  </td>
                  <td className="px-4 py-3 capitalize">{product.category}</td>
                  <td className="px-4 py-3">₦{product.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stockCount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        onClick={async () => {
                          if (window.confirm('Delete this product?')) {
                            try {
                              await axios.delete(`http://localhost:5000/api/products/${product._id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setProducts(products.filter((p) => p._id !== product._id));
                            } catch (err) {
                              alert('Delete failed');
                            }
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{order._id}</td>
                  <td className="px-4 py-3">{order.user?.name || 'N/A'}</td>
                  <td className="px-4 py-3">₦{order.totalPrice.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : order.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{order.deliveryStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;