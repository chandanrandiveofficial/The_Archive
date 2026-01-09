import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLink, FiUploadCloud, FiX } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AddNewProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    productLink: '',
    category: 'Accessories',
    year: new Date().getFullYear().toString(),
    month: new Date().toLocaleString('default', { month: 'long' }),
  });

  const [visibility, setVisibility] = useState({
    bestSelling: false,
    editorsPick: false,
    bestSellers: false,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...mapped]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(images[index].preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      // Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description,
        productLink: formData.productLink || '',
        price: parseFloat(formData.price) || 0,
        sku: `SKU-${Date.now()}`,
        category: formData.category,
        year: parseInt(formData.year),
        month: formData.month,
        stock: 0,
        tags: [],
        status: 'Active',
        visibility: {
          published: true,
          bestSelling: visibility.bestSelling,
          editorsPick: visibility.editorsPick,
          bestSellers: visibility.bestSellers,
        },
        images: images.length > 0
          ? images.map((img, i) => ({ url: img.preview, alt: `${formData.name} image ${i + 1}` }))
          : [{ url: '/hero.png', alt: formData.name }],
      };

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.message || 'Failed to create product');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error creating product:', err);
    } finally {
      setLoading(false);
    }
  };

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
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i + 1).toString());

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Add New Product</h1>
          <p className="text-sm text-zinc-500">Create a new item for your collection.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin')} className="px-4 py-2 text-sm rounded-md border border-zinc-300 text-zinc-700 hover:bg-zinc-100">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 text-sm rounded-md bg-black text-white hover:bg-zinc-800 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Product Details">
            <div className="space-y-4">
              <Input label="Product Name" placeholder="e.g. Minimalist Black Vase" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
              <Input label="Product Link" type="url" placeholder="https://yourstore.com/product/black-vase" icon={<FiLink />} value={formData.productLink} onChange={(e) => handleInputChange('productLink', e.target.value)} />
              <Textarea label="Description" placeholder="Describe the product features..." hint="Write a few sentences about the product." value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Price ($)" placeholder="0.00" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} />
              </div>
            </div>
          </Card>

          <Card title="Product Images">
            <div className="space-y-4">
              {/* Existing Images with Replace/Delete */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={img.preview}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl bg-zinc-100"
                      />

                      {/* Overlay with Replace & Delete buttons */}
                      <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {/* Replace Button */}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                URL.revokeObjectURL(images[index].preview);
                                const newPreview = URL.createObjectURL(file);
                                setImages(prev => {
                                  const newImages = [...prev];
                                  newImages[index] = { file, preview: newPreview };
                                  return newImages;
                                });
                              }
                            }}
                          />
                          <div className="bg-white text-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-zinc-100 transition-colors text-xs font-medium">
                            Replace
                          </div>
                        </label>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-red-600 transition-colors text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>

                      {/* Image number badge */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Image Button */}
              <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center cursor-pointer hover:border-black transition">
                <FiUploadCloud className="mx-auto text-2xl text-zinc-400" />
                <p className="mt-2 text-sm font-medium text-zinc-700">
                  {images.length === 0 ? 'Upload a file or drag and drop' : 'Add more images'}
                </p>
                <p className="text-xs text-zinc-500">PNG, JPG, GIF up to 10MB</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
              </div>

              {images.length > 0 && (
                <p className="text-xs text-zinc-500 text-center">
                  {images.length} image{images.length !== 1 ? 's' : ''} • Hover to replace or delete
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Visibility">
            <Toggle label="Best Selling" desc="Mark as popular" checked={visibility.bestSelling} onChange={() => setVisibility(prev => ({ ...prev, bestSelling: !prev.bestSelling }))} />
            <Toggle label="Editor's Pick" desc="Featured curated item" checked={visibility.editorsPick} onChange={() => setVisibility(prev => ({ ...prev, editorsPick: !prev.editorsPick }))} />
            <Toggle label="Best Seller's" desc="Featured curated item" checked={visibility.bestSellers} onChange={() => setVisibility(prev => ({ ...prev, bestSellers: !prev.bestSellers }))} />
          </Card>

          <Card title="Timeline Tagging">
            <Select label="Year" options={years} value={formData.year} onChange={(e) => handleInputChange('year', e.target.value)} />
            <Select label="Month" options={months} value={formData.month} onChange={(e) => handleInputChange('month', e.target.value)} />
            <p className="text-xs text-zinc-500 mt-2">Assigns the product to a specific catalog timeline period.</p>
          </Card>

          <Card title="Categorization">
            {categories.map(cat => (
              <Radio key={cat} label={cat} value={cat} checked={formData.category === cat} onChange={() => handleInputChange('category', cat)} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl">
      <div className="px-4 py-3 border-b border-zinc-200 text-sm font-medium">{title}</div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Input({ label, placeholder, type = "text", icon, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-2.5 text-zinc-400">{icon}</span>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={`mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none ${icon ? "pl-9" : ""}`} />
      </div>
    </div>
  );
}

function Textarea({ label, placeholder, hint, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <textarea placeholder={placeholder} rows={4} value={value} onChange={onChange} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-black outline-none" />
      <p className="text-xs text-zinc-500 mt-1">{hint}</p>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div onClick={onChange} className="flex items-center justify-between py-2 cursor-pointer select-none">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-zinc-500">{desc}</p>
      </div>
      <div className={`w-10 h-6 rounded-full p-1 transition ${checked ? "bg-black" : "bg-zinc-300"}`}>
        <div className={`h-4 w-4 bg-white rounded-full transition ${checked ? "translate-x-4" : ""}`} />
      </div>
    </div>
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <div className="mb-3">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <select value={value} onChange={onChange} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Radio({ label, value, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 text-sm text-zinc-700 mb-2 cursor-pointer">
      <input type="radio" name="category" value={value} checked={checked} onChange={onChange} className="accent-black" />
      {label}
    </label>
  );
}
