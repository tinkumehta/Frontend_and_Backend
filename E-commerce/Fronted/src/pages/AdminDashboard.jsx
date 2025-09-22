import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Welcome, {user?.name}!</h2>
          <p className="text-gray-600">You have administrator privileges.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Products</h3>
            <p className="text-2xl font-bold text-blue-700">0</p>
            <p className="text-sm text-blue-600">Total products</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">Orders</h3>
            <p className="text-2xl font-bold text-green-700">0</p>
            <p className="text-sm text-green-600">Total orders</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900">Users</h3>
            <p className="text-2xl font-bold text-yellow-700">0</p>
            <p className="text-sm text-yellow-600">Registered users</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900">Revenue</h3>
            <p className="text-2xl font-bold text-purple-700">₹0</p>
            <p className="text-sm text-purple-600">Total revenue</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
              Add Product
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
              View Orders
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;