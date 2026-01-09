import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiShare2, FiChevronLeft, FiChevronRight, FiCheck, FiCopy } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [id]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?._id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/${id}`);
      const result = await response.json();
      if (result.success) {
        setProduct(result.data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products/${id}/related`);
      const result = await response.json();
      if (result.success) {
        setRelatedProducts(result.data);
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  // Get all product images
  const getProductImages = () => {
    if (product?.images && product.images.length > 0) {
      return product.images.map(img => {
        const url = img.url;
        // Handle base64, absolute paths, http URLs, blobs and relative paths
        if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('http') || url.startsWith('blob:')) {
          return url;
        }
        return `/${url}`;
      });
    }
    return ['/hero.png'];
  };

  const getImageUrl = (product) => {
    if (product?.images && product.images.length > 0) {
      const url = product.images[0].url;
      // Handle base64, absolute paths, http URLs, blobs and relative paths
      if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('http') || url.startsWith('blob:')) {
        return url;
      }
      return `/${url}`;
    }
    return '/hero.png';
  };

  const formatPrice = (price) => `₹${price?.toFixed(2) || '0.00'}`;

  // Image navigation
  const images = getProductImages();
  const hasMultipleImages = images.length > 1;

  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Share functionality
  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: product?.name || 'Check out this product',
      text: `Check out ${product?.name} - ${formatPrice(product?.price)}`,
      url: shareUrl,
    };

    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }

    // Fallback to share menu
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Check out ${product?.name} - ${formatPrice(product?.price)}\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Check out ${product?.name} - ${formatPrice(product?.price)}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    setShowShareMenu(false);
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowShareMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 mb-4">{error || 'Product not found'}</p>
          <Link to="/" className="bg-black text-white px-6 py-2 rounded-full">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8">
          <FiArrowLeft className="w-5 h-5" />
          <span>Back to Archive</span>
        </Link>

        {/* Product Detail Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image Section - Amazon Style */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails - Left side on desktop, bottom on mobile */}
            {hasMultipleImages && (
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[500px] pb-2 lg:pb-0 lg:pr-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index
                      ? 'border-black ring-2 ring-black ring-offset-2'
                      : 'border-gray-200 hover:border-gray-400'
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image with Navigation */}
            <div className="relative flex-1 bg-[#F4F4F4] aspect-square rounded-lg overflow-hidden group">
              <img
                src={images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300"
              />

              {/* Navigation Arrows */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FiChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FiChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {hasMultipleImages && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.visibility?.bestSelling && (
                <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded">
                  BESTSELLER
                </span>
              )}
              {product.visibility?.editorsPick && (
                <span className="bg-black text-white text-xs font-semibold px-3 py-1 rounded">
                  EDITOR'S PICK
                </span>
              )}
              {product.visibility?.bestSellers && (
                <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded">
                  BEST SELLER'S
                </span>
              )}
            </div>

            {/* Category & Timeline */}
            <p className="text-sm text-gray-500 mb-2">
              {product.category} • {product.month} {product.year}
            </p>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-black mb-4">{product.name}</h1>

            {/* Price */}
            <p className="text-3xl font-bold text-black mb-6">{formatPrice(product.price)}</p>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            {/* Image Thumbnails Preview - Amazon Style (above buy button) */}
            {hasMultipleImages && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-3">Product Images ({images.length})</p>
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buy Button */}
            {product.productLink && (
              <div className="mb-6">
                <a
                  href={product.productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-black text-white py-4 px-8 rounded-full font-semibold text-center hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2"
                >
                  CLICK HERE TO BUY
                  <span>→</span>
                </a>
              </div>
            )}

            {/* Share Button with Dropdown */}
            <div className="relative inline-block">
              <button
                onClick={handleShare}
                className="w-14 h-14 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <FiShare2 className="w-5 h-5" />
              </button>

              {/* Share Menu Dropdown */}
              {showShareMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-700">Share this product</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={copyToClipboard}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      {copied ? <FiCheck className="w-5 h-5 text-green-500" /> : <FiCopy className="w-5 h-5 text-gray-500" />}
                      <span className="text-sm">{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                    <button
                      onClick={shareToWhatsApp}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span className="text-sm">WhatsApp</span>
                    </button>
                    <button
                      onClick={shareToTwitter}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="text-sm">Twitter/X</span>
                    </button>
                    <button
                      onClick={shareToFacebook}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="text-sm">Facebook</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Related Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link key={item._id} to={`/product/${item._id}`} className="group block">
                  <div className="bg-[#F4F4F4] aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={getImageUrl(item)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-sm group-hover:text-gray-600 transition-colors">{item.name}</h3>
                  <p className="font-semibold text-sm">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
