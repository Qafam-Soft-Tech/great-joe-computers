import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis if needed
  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }
    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
      >
        <FiChevronLeft />
      </button>
      {getPages().map((page, idx) =>
        page === '...' ? (
          <span key={idx} className="px-2">…</span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-medium ${
              page === currentPage
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-lg border disabled:opacity-50 hover:bg-gray-100"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;