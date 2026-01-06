import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { shopService } from './shop.service';
import { useAuth } from '../../context/AuthContext';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaStar, FaClock, FaPhone, FaCut } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    minWaitTime: '',
    maxWaitTime: '',
    sort: 'newest'
  });
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useAuth();

  const fetchShops = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await shopService.getAllShops(params);
      
      if (response.success) {
        setShops(response.data.shops || []);
        setPagination(response.data.pagination || {});
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
      toast.error('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchShops(1);
  };

  const handlePageChange = (page) => {
    fetchShops(page);
  };

  const handleNearbyShops = () => {
    if (navigator.geolocation) {
      toast.loading('Getting your location...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await shopService.getNearbyShops(latitude, longitude);
            if (response.success) {
              setShops(response.data || []);
              toast.success('Showing shops near you');
            }
          } catch (error) {
            toast.error('Failed to load nearby shops');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      minWaitTime: '',
      maxWaitTime: '',
      sort: 'newest'
    });
    fetchShops(1);
  };

  if (loading && shops.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Barber</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Book appointments, check real-time wait times, and get the best haircuts in town
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search by shop name, location, or service..."
                  className="w-full pl-12 pr-32 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <button
                onClick={handleNearbyShops}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition"
              >
                <FaMapMarkerAlt className="h-4 w-4" />
                Nearby Shops
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition"
              >
                <FaFilter className="h-4 w-4" />
                Filters
              </button>
              
              {user?.role === 'barber' && (
                <Link
                  to="/shops/create"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-full transition"
                >
                  <FaCut className="h-4 w-4" />
                  Create Shop
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={filters.city}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Wait Time (min)</label>
                <input
                  type="number"
                  name="minWaitTime"
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={filters.minWaitTime}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Wait Time (min)</label>
                <input
                  type="number"
                  name="maxWaitTime"
                  placeholder="60"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={filters.maxWaitTime}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  name="sort"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={filters.sort}
                  onChange={handleFilterChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="waitTime">Lowest Wait Time</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
              
              <div className="md:col-span-4 flex gap-4">
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {shops.length} {shops.length === 1 ? 'Shop' : 'Shops'} Found
            </h2>
            <p className="text-gray-600 mt-1">
              {pagination.total ? `Showing ${shops.length} of ${pagination.total} shops` : ''}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={pagination.limit}
              onChange={(e) => {
                setPagination(prev => ({ ...prev, limit: parseInt(e.target.value) }));
                fetchShops(1);
              }}
            >
              <option value="9">9 per page</option>
              <option value="18">18 per page</option>
              <option value="27">27 per page</option>
            </select>
          </div>
        </div>

        {/* Shops Grid */}
        {shops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <FaCut className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No shops found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop) => (
                <div key={shop._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Shop Image/Status */}
                  <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        shop.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {shop.isActive ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>
                    
                    {/* Owner Badge */}
                    {user?._id === shop.owner?._id && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                          Your Shop
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Shop Details */}
                  <div className="p-6">
                    {/* Shop Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{shop.name}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                        <span className="text-sm">
                          {shop.address?.street ? `${shop.address.street}, ` : ''}
                          {shop.address?.city}, {shop.address?.state}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <FaClock className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600">Wait Time</p>
                        <p className="font-bold text-gray-900">{shop.averageWaitTime || 15}m</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <FaCut className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-sm text-gray-600">Services</p>
                        <p className="font-bold text-gray-900">{shop.services?.length || 0}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <FaStar className="h-4 w-4 text-yellow-500" />
                        </div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="font-bold text-gray-900">4.5</p>
                      </div>
                    </div>

                    {/* Services Preview */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Popular Services</h4>
                      <div className="space-y-2">
                        {shop.services?.slice(0, 2).map((service, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 truncate">{service.name}</span>
                            <span className="font-semibold text-gray-900">${service.price}</span>
                          </div>
                        ))}
                        {shop.services?.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{shop.services.length - 2} more services
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact & Action */}
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{shop.phone}</span>
                      </div>
                      
                      <div className="flex gap-3">
                        <Link
                          to={`/shops/${shop._id}`}
                          className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
                        >
                          View Details
                        </Link>
                        
                        {user?.role === 'barber' && user?._id === shop.owner?._id && (
                          <Link
                            to={`/shops/edit/${shop._id}`}
                            className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                          >
                            Edit
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  
                  {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 border rounded-lg ${
                          pagination.page === pageNum 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    Next
                    <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopList;