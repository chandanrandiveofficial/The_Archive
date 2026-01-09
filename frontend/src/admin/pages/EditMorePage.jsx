import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiBold, FiItalic, FiList, FiImage, FiLink, FiEye } from 'react-icons/fi';
import { MdFormatUnderlined, MdFormatListNumbered } from 'react-icons/md';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EditMorePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'DRAFT',
    slug: ''
  });

  useEffect(() => {
    if (id) {
      fetchPage();
    }
  }, [id]);

  const getAuthToken = () => localStorage.getItem('token');

  const fetchPage = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/more/${id}`);
      const result = await response.json();

      if (result.success) {
        setFormData({
          title: result.data.title || '',
          content: result.data.content || '',
          status: result.data.status || 'DRAFT',
          slug: result.data.slug || ''
        });
      } else {
        setError(result.message || 'Page not found');
      }
    } catch (err) {
      setError('Failed to load page');
      console.error('Error fetching page:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!formData.content.trim()) {
      alert('Please enter content');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const token = getAuthToken();

      const response = await fetch(`${API_URL}/more/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          status: formData.status
        })
      });

      const result = await response.json();

      if (result.success) {
        navigate('/admin/morepage');
      } else {
        setError(result.message || 'Failed to save');
      }
    } catch (err) {
      setError('Failed to save changes');
      console.error('Error saving:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/morepage');
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Link to="/admin/morepage" className="bg-black text-white px-6 py-2 rounded-lg">
            Back to More Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/admin" className="hover:text-gray-900">Dashboard</Link>
          <span>/</span>
          <Link to="/admin/morepage" className="hover:text-gray-900">More Page</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Edit</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit More Page</h1>
          <p className="text-gray-600">
            Manage the content for the public-facing 'More' page. Changes will be reflected immediately after saving.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold">Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-8">
                <h1 className="text-4xl font-bold mb-6">{formData.title || 'Untitled'}</h1>
                <div className="prose max-w-none">
                  {formData.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">

          {/* Status Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Status
            </label>
            <div className="flex gap-3">
              {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status }))}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${formData.status === status
                    ? status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-700 border-2 border-green-500'
                      : status === 'DRAFT'
                        ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-500'
                        : 'bg-gray-100 text-gray-700 border-2 border-gray-500'
                    : 'bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Page Heading Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Page Heading
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Enter page heading"
            />
            {formData.slug && (
              <p className="text-xs text-gray-500 mt-2">
                Slug: /{formData.slug}
              </p>
            )}
          </div>

          {/* Content Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Content
            </label>

            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg">
              <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Bold">
                <FiBold className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Italic">
                <FiItalic className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Underline">
                <MdFormatUnderlined className="w-4 h-4 text-gray-700" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Bullet List">
                <FiList className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Numbered List">
                <MdFormatListNumbered className="w-4 h-4 text-gray-700" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Insert Link">
                <FiLink className="w-4 h-4 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="Insert Image">
                <FiImage className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Text Area */}
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={12}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none"
              placeholder="Enter content here..."
            />

            <p className="text-xs text-gray-500 mt-2">
              Use the toolbar to format your text. Markdown shortcuts are supported.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FiEye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-black text-white font-medium hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EditMorePage;
