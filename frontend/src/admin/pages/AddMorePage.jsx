import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBold, FiItalic, FiList, FiImage, FiLink, FiEye } from 'react-icons/fi';
import { MdFormatUnderlined, MdFormatListNumbered } from 'react-icons/md';
import { BiSave } from 'react-icons/bi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AddMorePage = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'DRAFT'
  });

  const getAuthToken = () => localStorage.getItem('token');

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a heading');
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

      const response = await fetch(`${API_URL}/more`, {
        method: 'POST',
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
        setError(result.message || 'Failed to create content');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error creating:', err);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/admin" className="hover:text-gray-900">Dashboard</Link>
          <span>/</span>
          <Link to="/admin/morepage" className="hover:text-gray-900">More Page</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Add New</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New 'More' Entry</h1>
          <p className="text-gray-600">
            Create a new entry for the client-side 'More' section. This content will be visible on the public timeline after publishing.
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
                  className="text-gray-500 hover:text-gray-700 text-2xl"
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

        {/* Form */}
        <div className="space-y-6">

          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">
              Status
            </label>
            <div className="flex gap-3">
              {['DRAFT', 'PUBLISHED'].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status }))}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${formData.status === status
                      ? status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700 border-2 border-green-500'
                        : 'bg-yellow-100 text-yellow-700 border-2 border-yellow-500'
                      : 'bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Heading Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">
              Heading
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter section title..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Content Body */}
          <div>
            <label className="block text-xs font-semibold text-gray-900 mb-2 uppercase tracking-wide">
              Content Body
            </label>

            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-white border border-gray-300 border-b-0 rounded-t-lg">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Bold"
              >
                <FiBold className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Italic"
              >
                <FiItalic className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Underline"
              >
                <MdFormatUnderlined className="w-4 h-4 text-gray-700" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Bullet List"
              >
                <FiList className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Numbered List"
              >
                <MdFormatListNumbered className="w-4 h-4 text-gray-700" />
              </button>

              <div className="w-px h-6 bg-gray-300 mx-1"></div>

              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Insert Link"
              >
                <FiLink className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Insert Image"
              >
                <FiImage className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Text Area */}
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={12}
              placeholder="Start typing your content here..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
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
                className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-medium hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              >
                <BiSave className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AddMorePage;
