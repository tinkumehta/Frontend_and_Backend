import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="card animate-pulse">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-300">
        <div className="h-48 w-full"></div>
      </div>
      
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4 mb-3"></div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          <div className="flex items-center">
            <div className="h-4 bg-gray-300 rounded w-4"></div>
            <div className="h-3 bg-gray-300 rounded w-8 ml-1"></div>
          </div>
        </div>
        
        <div className="mt-2 space-y-1">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;