import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="h-48 w-full object-cover object-center group-hover:opacity-75"
            />
          ) : (
            <div className="h-48 w-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-lg font-medium text-gray-900">₹{product.price}</p>
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-sm text-gray-600">
                {product.ratings || 'No ratings'}
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;