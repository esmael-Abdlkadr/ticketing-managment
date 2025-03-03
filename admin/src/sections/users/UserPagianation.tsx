import React from "react";

interface UserPaginationProps {
  currentPage: number;
  totalResults: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const UserPagination: React.FC<UserPaginationProps> = ({ 
  currentPage, 
  totalResults, 
  limit, 
  onPageChange 
}) => {
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = Math.ceil(totalResults / limit);
    const pageNumbers = [];
    
    // Logic to show a reasonable number of page links
    pageNumbers.push(1);
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    if (start > 2) pageNumbers.push('...');
    
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
    
    if (end < totalPages - 1) pageNumbers.push('...');
    
    if (totalPages > 1) pageNumbers.push(totalPages);
    
    return pageNumbers;
  };

  if (totalResults === 0) return null;

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
      <div className="text-sm text-gray-500">
        Showing {(currentPage - 1) * limit + 1} to{" "}
        {Math.min(currentPage * limit, totalResults)}{" "}
        of {totalResults} users
      </div>
      <nav className="flex items-center">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {getPageNumbers().map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === '...' ? (
              <span className="px-3 py-1">...</span>
            ) : (
              <button
                onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                className={`px-3 py-1 mx-1 rounded-md ${
                  pageNum === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pageNum}
              </button>
            )}
          </React.Fragment>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= Math.ceil(totalResults / limit)}
          className="ml-2 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  );
};

export default UserPagination;