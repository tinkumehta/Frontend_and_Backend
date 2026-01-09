import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { shopService } from './shop.service';
import { useAuth } from '../../context/AuthContext'
import { FaMapMarkerAlt, FaPhone, FaPlus, FaTrash, FaLocationArrow } from 'react-icons/fa';
import toast from 'react-hot-toast';

const CreateShop = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India'
    },
    services: [
      { name: 'Haircut', price: 50, duration: 30 },
      { name: 'Beard Trim', price: 40, duration: 15 }
    ],
    longitude: '',
    latitude: ''
  });

  // Check if we're in edit mode
  useEffect(() => {
    if (id && user?.role === 'barber') {
      setIsEditMode(true);
      fetchShopDetails();
    }
  }, [id, user]);

  const fetchShopDetails = async () => {
    try {
      setLoading(true);
      const response = await shopService.getShopById(id);
      if (response.success) {
        const shop = response.data;
        setFormData({
          name: shop.name || '',
          phone: shop.phone || '',
          address: {
            street: shop.address?.street || '',
            city: shop.address?.city || '',
            state: shop.address?.state || '',
            country: shop.address?.country || 'India'
          },
          services: shop.services || [],
          longitude: shop.location?.coordinates?.[0] || '',
          latitude: shop.location?.coordinates?.[1] || ''
        });
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
      toast.error('Failed to load shop details');
      navigate('/shops');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = field === 'price' || field === 'duration' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      services: updatedServices
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: '', price: '', duration: 30 }]
    }));
  };

  const removeService = (index) => {
    if (formData.services.length > 1) {
      const updatedServices = formData.services.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        services: updatedServices
      }));
    } else {
      toast.error('At least one service is required');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          toast.success('Location captured successfully!');
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Shop name is required');
      return false;
    }
    
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    
    if (!formData.address.street.trim()) {
      toast.error('Street address is required');
      return false;
    }
    
    if (!formData.address.city.trim()) {
      toast.error('City is required');
      return false;
    }
    
    // Validate services
    for (const service of formData.services) {
      if (!service.name.trim()) {
        toast.error('Service name is required');
        return false;
      }
      
      if (!service.price || service.price <= 0) {
        toast.error('Service price must be greater than 0');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isEditMode) {
        const response = await shopService.updateShop(id, formData);
        if (response.success) {
          toast.success('Shop updated successfully!');
          navigate(`/shops/${id}`);
        }
      } else {
        const response = await shopService.createShop(formData);
        if (response.success) {
          toast.success('Shop created successfully!');
          navigate('/shops');
        }
      }
    } catch (error) {
      console.error('Error saving shop:', error);
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} shop`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Barbershop' : 'Create Your Barbershop'}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEditMode ? 'Update your shop information' : 'Set up your shop to start accepting customers'}
              </p>
            </div>
            <button
              onClick={() => navigate('/shops')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              ← Back to Shops
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Modern Cuts Barbershop"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      name="address.street"
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <select
                    name="address.country"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={formData.address.country}
                    onChange={handleChange}
                  >
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location Coordinates */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                Location (Optional)
                <span className="text-sm text-gray-500 font-normal ml-2">- For accurate distance calculation</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="40.7128"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="-74.0060"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition"
                  >
                    <FaLocationArrow className="h-5 w-5" />
                    Use Current Location
                  </button>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Services</h2>
                <button
                  type="button"
                  onClick={addService}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition"
                >
                  <FaPlus className="h-4 w-4" />
                  Add Service
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-900">Service {index + 1}</h3>
                      {formData.services.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800"
                        >
                          <FaTrash className="h-4 w-4" />
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Service Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          value={service.name}
                          onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                          placeholder="Haircut"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($) *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          value={service.price}
                          onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
                          placeholder="25.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          value={service.duration}
                          onChange={(e) => handleServiceChange(index, 'duration', e.target.value)}
                          placeholder="30"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/shops')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      {isEditMode ? 'Updating Shop...' : 'Creating Shop...'}
                    </span>
                  ) : isEditMode ? 'Update Shop' : 'Create Shop'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShop;