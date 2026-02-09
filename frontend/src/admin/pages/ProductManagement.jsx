import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { FiSearch, FiPlus, FiMoreVertical, FiChevronDown, FiChevronRight, FiStar } from 'react-icons/fi';
import { MdInventory, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { BiEdit, BiHide, BiTrash, BiShow } from 'react-icons/bi';
import { IoRefresh } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import DeleteAlertModal from '../components/DeleteAlertModal';


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const ProductManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [expandedYears, setExpandedYears] = useState({});
    const [products, setProducts] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        hidden: 0,
        bestSellersCount: 0,
        editorsPickCount: 0,
        featuredProductCount: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [deleteModal, setDeleteModal] = useState({ open: false, product: null });


    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, [sortBy, statusFilter]);


    const getAuthToken = () => localStorage.getItem('token');


    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const statusParam = statusFilter === 'all' ? '' : statusFilter;
            const response = await fetch(`${API_URL}/products?limit=200&sortBy=${sortBy}&status=${statusParam}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            const result = await response.json();
            if (result.success) {
                setProducts(result.data);
                // Auto-expand current year
                const currentYear = new Date().getFullYear();
                setExpandedYears(prev => ({ ...prev, [currentYear]: true }));
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };


    const fetchStats = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/products/stats/summary`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                setStats(result.data);
            }
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };


    const handleDelete = async (productId) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) {
                fetchProducts();
                fetchStats();
            }
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };


    const handleToggleVisibility = async (product, field) => {
        // Prevent adding more than 4 Best Sellers from the frontend too
        if (field === "bestSellers" && !product.visibility?.[field] && stats.bestSellersCount >= 4) {
            alert('Limit reached: You can only have 4 Main Showcase products at a time. Please remove one before adding another.');
            return;
        }

        try {
            const token = getAuthToken();
            const response = await fetch(`${API_URL}/products/${product._id}/visibility`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: !product.visibility?.[field] })
            });
            const result = await response.json();

            if (result.success) {
                fetchProducts();
                fetchStats();
            } else if (result.isLimitReached) {
                alert(result.message);
            } else {
                console.error("Error updating visibility:", result.message);
            }
        } catch (err) {
            console.error("Error updating visibility:", err);
        }
    };


    const handleToggleStatus = async (product) => {
        try {
            const token = getAuthToken();
            const newStatus = product.status === 'Active' ? 'Hidden' : 'Active';
            const response = await fetch(`${API_URL}/products/${product._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            const result = await response.json();
            if (result.success) {
                fetchProducts();
                fetchStats();
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };


    // Group products by year and month
    const groupedProducts = products.reduce((acc, product) => {
        const year = product.year;
        const month = `${(product.month || 'Unknown').toUpperCase()} ${year}`;


        if (!acc[year]) {
            acc[year] = { total: 0, months: {} };
        }
        if (!acc[year].months[month]) {
            acc[year].months[month] = [];
        }
        acc[year].months[month].push(product);
        acc[year].total++;
        return acc;
    }, {});


    // Filter products by search
    const filteredGroupedProducts = Object.keys(groupedProducts).reduce((acc, year) => {
        const yearData = groupedProducts[year];
        const filteredMonths = {};
        let total = 0;


        Object.keys(yearData.months).forEach(month => {
            const filtered = yearData.months[month].filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (filtered.length > 0) {
                filteredMonths[month] = filtered;
                total += filtered.length;
            }
        });


        if (total > 0) {
            acc[year] = { total, months: filteredMonths };
        }
        return acc;
    }, {});


    const toggleYear = (year) => {
        setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
    };


    const handleDeleteClick = (product) => {
        setDeleteModal({ open: true, product });
    };


    const handleDeleteConfirm = () => {
        if (deleteModal.product) {
            handleDelete(deleteModal.product._id);
        }
        setDeleteModal({ open: false, product: null });
    };


    const getImageUrl = (product) => {
        if (product.images && product.images.length > 0) {
            const url = product.images[0].url;
            if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('http') || url.startsWith('blob:')) {
                return url;
            }
            return `/${url}`;
        }
        return '/hero.png';
    };


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
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-2">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Product Inventory</h1>
                            <p className="text-sm text-[#8E8E8E]">Overview of your product catalog organized by timeline.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={fetchProducts}>
                                <IoRefresh className="w-5 h-5" />
                            </Button>
                            <Button className="bg-black text-white hover:bg-[#333333] gap-2 flex-1 sm:flex-initial" onClick={() => navigate('/admin/add')}>
                                <FiPlus className="w-4 h-4" />
                                Add New Product
                            </Button>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-[#8E8E8E] uppercase tracking-wide mb-2">Total Products</p>
                                <p className="text-3xl font-bold text-black">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <MdInventory className="w-6 h-6 text-black" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-[#8E8E8E] uppercase tracking-wide mb-2">Published</p>
                                <p className="text-3xl font-bold text-black">{stats.published}</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <MdVisibility className="w-6 h-6 text-black" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-[#8E8E8E] uppercase tracking-wide mb-2">Hidden</p>
                                <p className="text-3xl font-bold text-black">{stats.hidden}</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <MdVisibilityOff className="w-6 h-6 text-black" />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Active">Published</SelectItem>
                                <SelectItem value="Hidden">Hidden</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200">
                                <SelectItem value="newest">Sort: Newest</SelectItem>
                                <SelectItem value="oldest">Sort: Oldest</SelectItem>
                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                <SelectItem value="name">Name: A to Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>


                <div className="space-y-4">
                    {Object.keys(filteredGroupedProducts).sort((a, b) => {
                        if (sortBy === 'oldest') return a - b;
                        return b - a;
                    }).map((year) => {
                        const yearData = filteredGroupedProducts[year];
                        const monthOrder = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
                        const sortedMonths = Object.keys(yearData.months).sort((a, b) => {
                            const aMonth = a.split(' ')[0];
                            const bMonth = b.split(' ')[0];
                            if (sortBy === 'oldest') return monthOrder.indexOf(aMonth) - monthOrder.indexOf(bMonth);
                            return monthOrder.indexOf(bMonth) - monthOrder.indexOf(aMonth);
                        });

                        return (
                            <Collapsible key={year} open={expandedYears[year]} onOpenChange={() => toggleYear(year)}>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <CollapsibleTrigger className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            {expandedYears[year] ? <FiChevronDown className="w-5 h-5 text-gray-400" /> : <FiChevronRight className="w-5 h-5 text-gray-400" />}
                                            <h2 className="text-xl font-bold text-black">{year}</h2>
                                            <span className="text-sm text-[#8E8E8E]">{yearData.total} Items</span>
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="border-t border-gray-200">
                                            {sortedMonths.map((month) => (
                                                <div key={month}>
                                                    <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200">
                                                        <h3 className="text-xs font-medium text-[#8E8E8E] uppercase tracking-wide">{month}</h3>
                                                    </div>
                                                    {yearData.months[month].map((product) => (
                                                        <div key={product._id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                                            {/* Mobile Layout (< 640px) */}
                                                            <div className="sm:hidden">
                                                                <div className="flex items-start gap-3">
                                                                    {/* Product Image */}
                                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                                        <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover" />
                                                                    </div>

                                                                    {/* Product Info & Actions */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                                            <div className="flex-1 min-w-0">
                                                                                <h4 className="text-sm font-semibold text-black mb-1">{product.name}</h4>
                                                                                <div className="flex flex-wrap items-center gap-1">
                                                                                    {product.visibility?.bestSellers && <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Showcase</Badge>}
                                                                                    {product.visibility?.bestSelling && <Badge className="bg-orange-100 text-orange-700 text-[10px]">Popular</Badge>}
                                                                                    {product.visibility?.editorsPick && <Badge className="bg-purple-100 text-purple-700 text-[10px]">Editor's Pick</Badge>}
                                                                                    {product.visibility?.popularFeatured && <Badge className="bg-pink-100 text-pink-700 text-[10px]">⭐ Popular Featured</Badge>}
                                                                                </div>
                                                                            </div>
                                                                            {/* Actions Menu - Mobile */}
                                                                            <DropdownMenu>
                                                                                <DropdownMenuTrigger asChild>
                                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                                                                        <FiMoreVertical className="w-4 h-4" />
                                                                                    </Button>
                                                                                </DropdownMenuTrigger>
                                                                                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                                                                                    <DropdownMenuItem onClick={() => navigate(`/admin/edit?id=${product._id}`)} className="gap-2 cursor-pointer">
                                                                                        <BiEdit className="w-4 h-4" /> Edit Product
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => handleToggleStatus(product)} className="gap-2 cursor-pointer">
                                                                                        {product.status === 'Active' ? <BiHide className="w-4 h-4" /> : <BiShow className="w-4 h-4" />}
                                                                                        {product.status === 'Active' ? 'Hide' : 'Show'}
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem
                                                                                        onClick={() => handleToggleVisibility(product, 'bestSellers')}
                                                                                        className={`gap-2 cursor-pointer ${!product.visibility?.bestSellers && stats.bestSellersCount >= 4 ? 'opacity-50' : ''}`}
                                                                                        disabled={!product.visibility?.bestSellers && stats.bestSellersCount >= 4}
                                                                                    >
                                                                                        <FiStar className="w-4 h-4" />
                                                                                        {product.visibility?.bestSellers ? 'Remove from Showcase' : 'Add to Showcase'}
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => handleToggleVisibility(product, 'bestSelling')} className="gap-2 cursor-pointer">
                                                                                        <FiStar className="w-4 h-4" />
                                                                                        {product.visibility?.bestSelling ? 'Remove from Popular' : 'Add to Popular'}
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => handleToggleVisibility(product, 'editorsPick')} className="gap-2 cursor-pointer">
                                                                                        <FiStar className="w-4 h-4" />
                                                                                        {product.visibility?.editorsPick ? "Remove from Editor's Pick" : "Add to Editor's Pick"}
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem onClick={() => handleToggleVisibility(product, 'popularFeatured')} className="gap-2 cursor-pointer">
                                                                                        <FiStar className="w-4 h-4" />
                                                                                        {product.visibility?.popularFeatured ? "Remove Popular Featured" : "Set as Popular Featured"}
                                                                                    </DropdownMenuItem>
                                                                                    <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600 cursor-pointer" onClick={() => handleDeleteClick(product)}>
                                                                                        <BiTrash className="w-4 h-4" /> Delete
                                                                                    </DropdownMenuItem>
                                                                                </DropdownMenuContent>
                                                                            </DropdownMenu>
                                                                        </div>

                                                                        <p className="text-xs text-[#8E8E8E] mb-2">{product.category}</p>

                                                                        <div className="flex items-center justify-between">
                                                                            <Badge variant={product.status === 'Active' ? 'default' : 'secondary'} className={product.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600'}>
                                                                                <span className="w-2 h-2 rounded-full bg-current mr-1.5"></span>
                                                                                {product.status}
                                                                            </Badge>

                                                                            <span className="text-base font-bold text-black">
                                                                                ₹{product.price.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Desktop Layout (>= 640px) */}
                                                            <div className="hidden sm:flex items-center justify-between">
                                                                <div className="flex items-center gap-4 flex-1">
                                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                                        <img src={getImageUrl(product)} alt={product.name} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                            <h4 className="text-sm font-semibold text-black mb-1 truncate">{product.name}</h4>
                                                                            {product.visibility?.bestSellers && <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">Showcase</Badge>}
                                                                            {product.visibility?.bestSelling && <Badge className="bg-orange-100 text-orange-700 text-[10px]">Popular</Badge>}
                                                                            {product.visibility?.editorsPick && <Badge className="bg-purple-100 text-purple-700 text-[10px]">Editor's Pick</Badge>}
                                                                            {product.visibility?.popularFeatured && <Badge className="bg-pink-100 text-pink-700 text-[10px]">⭐ Popular Featured</Badge>}
                                                                        </div>
                                                                        <p className="text-xs text-[#8E8E8E]">{product.category}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-6">
                                                                    <Badge variant={product.status === 'Active' ? 'default' : 'secondary'} className={product.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600'}>
                                                                        <span className="w-2 h-2 rounded-full bg-current mr-1.5"></span>
                                                                        {product.status}
                                                                    </Badge>
                                                                    <span className="text-base font-bold text-black min-w-[100px] text-right">₹{product.price.toFixed(2)}</span>
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                                <FiMoreVertical className="w-4 h-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                                                                            <DropdownMenuItem onClick={() => navigate(`/admin/edit?id=${product._id}`)} className="gap-2 cursor-pointer">
                                                                                <BiEdit className="w-4 h-4" /> Edit Product
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleToggleStatus(product)} className="gap-2 cursor-pointer">
                                                                                {product.status === 'Active' ? <BiHide className="w-4 h-4" /> : <BiShow className="w-4 h-4" />}
                                                                                {product.status === 'Active' ? 'Hide' : 'Show'}
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleToggleVisibility(product, 'bestSellers')}
                                                                                className={`gap-2 cursor-pointer ${!product.visibility?.bestSellers && stats.bestSellersCount >= 4 ? 'opacity-50' : ''}`}
                                                                                disabled={!product.visibility?.bestSellers && stats.bestSellersCount >= 4}
                                                                            >
                                                                                <FiStar className="w-4 h-4" />
                                                                                {product.visibility?.bestSellers ? 'Remove from Showcase' : 'Add to Showcase'}
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleToggleVisibility(product, 'bestSelling')} className="gap-2 cursor-pointer">
                                                                                <FiStar className="w-4 h-4" />
                                                                                {product.visibility?.bestSelling ? 'Remove from Popular' : 'Add to Popular'}
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleToggleVisibility(product, 'editorsPick')} className="gap-2 cursor-pointer">
                                                                                <FiStar className="w-4 h-4" />
                                                                                {product.visibility?.editorsPick ? "Remove from Editor's Pick" : "Add to Editor's Pick"}
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => handleToggleVisibility(product, 'popularFeatured')} className="gap-2 cursor-pointer">
                                                                                <FiStar className="w-4 h-4" />
                                                                                {product.visibility?.popularFeatured ? "Remove Popular Featured" : "Set as Popular Featured"}
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600 cursor-pointer" onClick={() => handleDeleteClick(product)}>
                                                                                <BiTrash className="w-4 h-4" /> Delete
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>
                        )
                    })}
                </div>


                {Object.keys(filteredGroupedProducts).length === 0 && (
                    <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                        <p className="text-xl text-gray-500">No products found</p>
                    </div>
                )}
            </div>
            <DeleteAlertModal
                open={deleteModal.open}
                onOpenChange={(open) => setDeleteModal({ open, product: null })}
                productName={deleteModal.product?.name || ''}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
};


export default ProductManagement;
