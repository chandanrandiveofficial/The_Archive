import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiChevronLeft, FiChevronRight, FiTrash2, FiRefreshCw } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MorePage = () => {
  const navigate = useNavigate();
  const [contentBlocks, setContentBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchContentBlocks();
  }, []);

  const getAuthToken = () => localStorage.getItem('token');

  const fetchContentBlocks = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      // Fetch all statuses for admin view
      const response = await fetch(`${API_URL}/more?status=`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      const result = await response.json();

      if (result.success) {
        setContentBlocks(result.data);
      } else {
        setError(result.message || 'Failed to load content');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching content blocks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/editmorepage/${id}`);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      try {
        const token = getAuthToken();
        const response = await fetch(`${API_URL}/more/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const result = await response.json();

        if (result.success) {
          setContentBlocks(contentBlocks.filter(block => block._id !== id));
        } else {
          alert(result.message || 'Failed to delete');
        }
      } catch (err) {
        alert('Failed to delete content block');
        console.error('Error deleting:', err);
      }
    }
  };

  const handleToggleStatus = async (block) => {
    try {
      const token = getAuthToken();
      const newStatus = block.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

      const response = await fetch(`${API_URL}/more/${block._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();

      if (result.success) {
        fetchContentBlocks();
      } else {
        alert(result.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Failed to update status');
      console.error('Error updating status:', err);
    }
  };

  // Pagination
  const totalPages = Math.ceil(contentBlocks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedBlocks = contentBlocks.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/admin" className="hover:text-gray-900">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">More Page</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Overview</h1>
            <p className="text-gray-600">
              Manage the entries displayed on the public 'More' page. Reorder or edit existing content blocks below.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchContentBlocks}
              className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
            <Link
              to="/admin/addmorepage"
              className="flex items-center gap-2 px-4 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add New Content
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button onClick={fetchContentBlocks} className="ml-4 underline">Retry</button>
          </div>
        )}

        {/* Content Blocks List */}
        <div className="space-y-4 mb-6">
          {displayedBlocks.map((block) => (
            <div
              key={block._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title and Status */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{block.title}</h3>
                    <button
                      onClick={() => handleToggleStatus(block)}
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded cursor-pointer hover:opacity-80 transition-opacity ${block.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : block.status === 'DRAFT'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      title="Click to toggle status"
                    >
                      {block.status}
                    </button>
                  </div>

                  {/* Content Preview */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {block.content}
                  </p>

                  {/* Meta Info */}
                  <div className="mt-3 text-xs text-gray-500">
                    <span>Slug: /{block.slug}</span>
                    {block.updatedAt && (
                      <span className="ml-4">
                        Updated: {new Date(block.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="ml-4 flex items-center gap-2">
                  <Link
                    to={`/more/${block.slug}`}
                    target="_blank"
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleEdit(block._id)}
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(block._id, block.title)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {contentBlocks.length === 0 && !loading && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No content blocks found</p>
            <Link
              to="/admin/addmorepage"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Your First Content
            </Link>
          </div>
        )}

        {/* Footer - Pagination */}
        {contentBlocks.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, contentBlocks.length)} of {contentBlocks.length} entries
            </p>

            <div className="flex items-center gap-2">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MorePage;
