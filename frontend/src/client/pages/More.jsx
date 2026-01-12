import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const More = () => {
  const { slug } = useParams();
  const [expandedSections, setExpandedSections] = useState({});
  const [pageContent, setPageContent] = useState([]);
  const [singlePage, setSinglePage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchSinglePage();
    } else {
      fetchAllPages();
    }
  }, [slug]);

  const fetchAllPages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/more?status=PUBLISHED`);
      const result = await response.json();

      if (result.success) {
        setPageContent(result.data);
      } else {
        setError('Failed to load content');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSinglePage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/more/slug/${slug}`);
      const result = await response.json();

      if (result.success) {
        setSinglePage(result.data);
      } else {
        setError('Page not found');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching page:', err);
    } finally {
      setLoading(false);
    }
  };

  const CHARACTER_LIMIT = 200;

  const toggleExpand = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getTruncatedContent = (content) => {
    if (content.length <= CHARACTER_LIMIT) return content;
    return content.substring(0, CHARACTER_LIMIT) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Link to="/more" className="bg-black text-white px-6 py-2 rounded-full">
            Back to More
          </Link>
        </div>
      </div>
    );
  }

  // Single Page View
  if (slug && singlePage) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Back Button */}
          <Link
            to="/more"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to More
          </Link>

          {/* Page Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{singlePage.title}</h1>

          {/* Content */}
          <div className="prose max-w-none">
            {singlePage.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-gray-700 leading-relaxed text-lg mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Meta */}
          {singlePage.updatedAt && (
            <p className="text-gray-500 text-sm mt-12 pt-6 border-t border-gray-200">
              Last updated: {new Date(singlePage.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  // All Pages View
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-12">More</h1>

        {/* Content Sections - Block by Block Column Layout */}
        {pageContent.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {pageContent.map((section) => {
              const isExpanded = expandedSections[section._id];
              const shouldShowButton = section.content.length > CHARACTER_LIMIT;
              const displayContent = isExpanded || !shouldShowButton
                ? section.content
                : getTruncatedContent(section.content);

              return (
                <div
                  key={section._id}
                  className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <Link
                    to={`/more/${section.slug}`}
                    className="text-2xl font-bold text-gray-900 mb-4 hover:text-gray-600 transition-colors block"
                  >
                    {section.title}
                  </Link>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                    {displayContent}
                  </p>

                  {/* Read More / Show Less Button */}
                  {shouldShowButton && (
                    <button
                      onClick={() => toggleExpand(section._id)}
                      className="flex items-center gap-2 text-black font-medium hover:text-gray-700 transition-colors text-sm"
                    >
                      {isExpanded ? (
                        <>
                          Show Less
                          <FiChevronUp className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Read More
                          <FiChevronDown className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No content available</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default More;
