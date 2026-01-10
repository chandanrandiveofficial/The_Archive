import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FiUploadCloud, FiSave, FiX, FiRefreshCw } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';
import { MdImage, MdCalendarToday, MdToggleOn } from 'react-icons/md';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EditProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Multiple images support
  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    productLink: '',
    category: 'Accessories',
    year: new Date().getFullYear().toString(),
    month: 'January',
    status: 'Active',
    bestSellers: false,
    bestSelling: false,
    editorsPick: false,
    featuredProduct: false
  });

  const [bestSellersCount, setBestSellersCount] = useState(0);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
    fetchStats();
  }, [productId]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/products/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setBestSellersCount(result.data.bestSellersCount || 0);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products/${productId}`);
      const result = await response.json();

      if (result.success) {
        const product = result.data;
        setFormData({
          name: product.name || '',
          price: product.price?.toString() || '',
          description: product.description || '',
          productLink: product.productLink || '',
          category: product.category || 'Accessories',
          year: product.year?.toString() || new Date().getFullYear().toString(),
          month: product.month || 'January',
          status: product.status || 'Active',
          bestSellers: product.visibility?.bestSellers || false,
          bestSelling: product.visibility?.bestSelling || false,
          editorsPick: product.visibility?.editorsPick || false,
          featuredProduct: product.visibility?.featuredProduct || false,
          popularFeatured: product.visibility?.popularFeatured || false
        });

        // Set existing images
        if (product.images && product.images.length > 0) {
          setImages(product.images.map(img => ({
            url: img.url,
            alt: img.alt || product.name,
            isExisting: true
          })));
        }
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Replace specific image
  const handleImageReplace = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
          const newImages = [...prev];
          newImages[index] = {
            url: reader.result,
            alt: formData.name,
            isExisting: false
          };
          return newImages;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete image
  const handleImageDelete = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Add new image
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, {
          url: reader.result,
          alt: formData.name,
          isExisting: false
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem('token');

      const updateData = {
        name: formData.name,
        description: formData.description,
        productLink: formData.productLink || '',
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        year: parseInt(formData.year),
        month: formData.month,
        status: formData.status,
        visibility: {
          published: formData.status === 'Active',
          bestSellers: formData.bestSellers,
          bestSelling: formData.bestSelling,
          editorsPick: formData.editorsPick,
          featuredProduct: formData.featuredProduct,
          popularFeatured: formData.popularFeatured,
        },
        images: images.length > 0
          ? images.map(img => ({ url: img.url, alt: img.alt || formData.name }))
          : undefined,
      };

      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.message || 'Failed to update product');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error updating product:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i + 1).toString());
  const categories = [
    'Furniture',
    'Accessories',
    'Arts',
    'Apps',
    'Agriculture',
    'Automative and Industrial',
    'Baby, Kids & Parenting',
    'Beauty, Personal Care & Wellness',
    'B2B, Industrial & Manufacturing',
    'D2C Brands & Consumer Products',
    'Fashion, Apparel & Accessories',
    'Entertainment',
    'Education, Learning & EdTech',
    'Electric Vehicles, Mobility & Transport',
    'Food, Beverage & FMCG',
    'Health, Fitness & Medical',
    'Home, Kitchen & Lifestyle',
    'Services & Marketplaces',
    'Sustainability & Green Products',
    'Sports & Outdoor',
    'Gift',
    'Tech & Electronics',
    'Miscellaneous',
    'Lighting',
    'Decor'
  ];

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
        <nav className="flex items-center gap-2 text-sm text-[#8E8E8E] mb-6">
          <Link to="/admin" className="hover:text-black transition-colors">Dashboard</Link>
          <IoIosArrowForward className="w-4 h-4" />
          <span className="text-black">Edit Product</span>
        </nav>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Edit Product</h1>
            <p className="text-sm text-[#8E8E8E]">Update product details for "{formData.name}".</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button className="bg-black text-white hover:bg-[#333333] gap-2" onClick={handleSave} disabled={saving}>
              <FiSave className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MdImage className="w-5 h-5" />
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-black mb-2 block">Product Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter product name" />
                </div>
                <div>
                  <Label htmlFor="productLink" className="text-sm font-medium text-black mb-2 block">Product Link</Label>
                  <Input id="productLink" type="url" value={formData.productLink} onChange={(e) => handleInputChange('productLink', e.target.value)} placeholder="https://example.com/product" />
                </div>
                <div>
                  <Label htmlFor="price" className="text-sm font-medium text-black mb-2 block">Price (INR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]">₹</span>
                    <Input id="price" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} placeholder="0.00" className="pl-7" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-black mb-2 block">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="description" className="text-sm font-medium text-black">Description</Label>
                    <span className="text-xs text-[#8E8E8E]">{formData.description.length}/2000</span>
                  </div>
                  <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="Enter product description" className="min-h-[180px] resize-none" maxLength={2000} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MdImage className="w-5 h-5" />
                  Product Media
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Existing Images with Replace/Delete */}
                <div className="space-y-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={img.alt || `Product ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg bg-gray-100"
                      />

                      {/* Overlay with Replace & Delete buttons */}
                      <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        {/* Replace Button */}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageReplace(index, e)}
                          />
                          <div className="bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors">
                            <FiRefreshCw className="w-4 h-4" />
                            <span className="text-sm font-medium">Replace</span>
                          </div>
                        </label>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleImageDelete(index)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </div>

                      {/* Image number badge */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        Image {index + 1}
                      </div>
                    </div>
                  ))}

                  {/* Add New Image Button */}
                  <label className="block">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                      <FiUploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-black mb-1">
                        {images.length === 0 ? 'Upload Image' : 'Add Another Image'}
                      </p>
                      <p className="text-xs text-[#8E8E8E]">PNG, JPG or GIF</p>
                    </div>
                  </label>
                </div>

                <p className="text-xs text-[#8E8E8E] text-center mt-4">
                  {images.length} image{images.length !== 1 ? 's' : ''} • Hover to replace or delete
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MdCalendarToday className="w-5 h-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-[#8E8E8E] uppercase tracking-wide mb-2 block">Year</Label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                    <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                    <SelectContent>
                      {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-[#8E8E8E] uppercase tracking-wide mb-2 block">Month</Label>
                  <Select value={formData.month} onValueChange={(value) => handleInputChange('month', value)}>
                    <SelectTrigger><SelectValue placeholder="Select month" /></SelectTrigger>
                    <SelectContent>
                      {months.map(month => <SelectItem key={month} value={month}>{month}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MdToggleOn className="w-5 h-5" />
                  Status & Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs font-medium text-[#8E8E8E] uppercase tracking-wide mb-2 block">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Hidden">Hidden</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-black">Main Showcase</Label>
                    <p className="text-xs text-[#8E8E8E]">Show in landing page (Max 4)</p>
                  </div>
                  <Switch
                    disabled={!formData.bestSellers && bestSellersCount >= 4}
                    checked={formData.bestSellers}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        bestSellers: checked,
                        bestSelling: checked ? false : prev.bestSelling,
                        editorsPick: checked ? false : prev.editorsPick,
                        featuredProduct: checked ? false : prev.featuredProduct
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-black">Popular</Label>
                    <p className="text-xs text-[#8E8E8E]">Show in popular section</p>
                  </div>
                  <Switch
                    checked={formData.bestSelling}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        bestSellers: checked ? false : prev.bestSellers,
                        bestSelling: checked,
                        editorsPick: checked ? false : prev.editorsPick,
                        featuredProduct: checked ? false : prev.featuredProduct
                      }));
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-black">Editor's Pick</Label>
                    <p className="text-xs text-[#8E8E8E]">Feature on front page</p>
                  </div>
                  <Switch checked={formData.editorsPick} onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      bestSellers: checked ? false : prev.bestSellers,
                      bestSelling: checked ? false : prev.bestSelling,
                      editorsPick: checked,
                      featuredProduct: checked ? false : prev.featuredProduct
                    }));
                  }} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-black">⭐ Popular Featured</Label>
                    <p className="text-xs text-[#8E8E8E]">Big featured spot on Popular page (Only 1)</p>
                  </div>
                  <Switch checked={formData.popularFeatured} onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      popularFeatured: checked
                    }));
                  }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
