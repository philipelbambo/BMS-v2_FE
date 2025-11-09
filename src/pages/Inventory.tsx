    import React, { useState } from 'react';
    import { Package, Plus, Edit2, AlertCircle, Hammer, Lightbulb, Droplet, Settings, Paintbrush, Upload, AlertTriangle } from 'lucide-react';

    // 🔥 Updated TypeScript interface: added `damagedQuantity`
    interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;          // ✅ Usable/good stock
    damagedQuantity: number;   // ✅ NEW: damaged stock
    category: string;
    imageUrl: string;
    }

    interface Category {
    id: number;
    name: string;
    icon: React.ReactNode;
    }

    const InventoryPOS: React.FC = () => {
    // ✅ Convert categories to state for dynamic addition
    const [categories, setCategories] = useState<Category[]>([
        { 
        id: 1, 
        name: 'Cement', 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        },
        { 
        id: 2, 
        name: 'Lumber', 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
        },
        { 
        id: 3, 
        name: 'Nails', 
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/><circle cx="12" cy="21" r="2"/></svg>
        },
        { 
        id: 4, 
        name: 'Paints', 
        icon: <Paintbrush size={20} />
        },
        { 
        id: 5, 
        name: 'Tools', 
        icon: <Hammer size={20} />
        },
        { 
        id: 6, 
        name: 'Electrical', 
        icon: <Lightbulb size={20} />
        },
        { 
        id: 7, 
        name: 'Plumbing', 
        icon: <Droplet size={20} />
        },
        { 
        id: 8, 
        name: 'Hardware', 
        icon: <Settings size={20} />
        }
    ]);

    // 🔥 Updated initial products: added `damagedQuantity`
    const [products, setProducts] = useState<Product[]>([
        // Cement
        { id: 1, name: 'Portland Cement Type I - 40kg', price: 285, quantity: 150, damagedQuantity: 3, category: 'Cement', imageUrl: 'https://ik.imagekit.io/tuc2020/wp-content/uploads/2024/03/APO-CEMEX-PORTLAND-TYPE-1.jpg' },
        { id: 2, name: 'Portland Cement Type II - 40kg', price: 295, quantity: 8, damagedQuantity: 2, category: 'Cement', imageUrl: 'https://cebuhomebuilders.com/wp-content/uploads/2020/02/apo-pozzolan-cement..png' },
        { id: 3, name: 'Masonry Cement - 40kg', price: 270, quantity: 95, damagedQuantity: 0, category: 'Cement', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzOCAG_9SJJ6woGzqGAtGicnqZ05kquTpvWA&s' },
        { id: 4, name: 'White Cement - 40kg', price: 520, quantity: 5, damagedQuantity: 1, category: 'Cement', imageUrl: 'https://mackunhardware.com/cdn/shop/products/MPORT.png?v=1614046944' },
        
        // Lumber
        { id: 5, name: '2x4x8 Pine Lumber', price: 185, quantity: 200, damagedQuantity: 5, category: 'Lumber', imageUrl: 'https://images.unsplash.com/photo-161108139834-6b8f844fbe61?w=400' },
        { id: 6, name: '2x6x10 Pine Lumber', price: 320, quantity: 7, damagedQuantity: 0, category: 'Lumber', imageUrl: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=400' },
        { id: 7, name: '4x4x8 Treated Post', price: 450, quantity: 85, damagedQuantity: 2, category: 'Lumber', imageUrl: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400' },
        { id: 8, name: 'Plywood 4x8 - 1/2 inch', price: 680, quantity: 45, damagedQuantity: 3, category: 'Lumber', imageUrl: 'https://images.unsplash.com/photo-1601885353691-9db469bdc2af?w=400' },
        
        // Nails
        { id: 9, name: 'Common Nails 2 inch - 1kg', price: 65, quantity: 120, damagedQuantity: 0, category: 'Nails', imageUrl: 'https://images.unsplash.com/photo-1635003435037-a40c18587e0d?w=400' },
        { id: 10, name: 'Common Nails 3 inch - 1kg', price: 70, quantity: 9, damagedQuantity: 1, category: 'Nails', imageUrl: 'https://images.unsplash.com/photo-1616401776142-57818a4e4293?w=400' },
        { id: 11, name: 'Roofing Nails - 1kg', price: 85, quantity: 95, damagedQuantity: 0, category: 'Nails', imageUrl: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=400' },
        { id: 12, name: 'Finishing Nails - 500g', price: 45, quantity: 110, damagedQuantity: 0, category: 'Nails', imageUrl: 'https://images.unsplash.com/photo-1572981779307-e8f0c1d3e8e5?w=400' },
        
        // Paints
        { id: 13, name: 'Latex White Paint - 4L', price: 895, quantity: 55, damagedQuantity: 2, category: 'Paints', imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400' },
        { id: 14, name: 'Latex Beige Paint - 4L', price: 895, quantity: 6, damagedQuantity: 1, category: 'Paints', imageUrl: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=400' },
        { id: 15, name: 'Enamel Paint White - 1L', price: 320, quantity: 75, damagedQuantity: 0, category: 'Paints', imageUrl: 'https://images.unsplash.com/photo-1572981779307-e8f0c1d3e8e5?w=400' },
        { id: 16, name: 'Paint Primer - 4L', price: 650, quantity: 40, damagedQuantity: 1, category: 'Paints', imageUrl: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400' },
        
        // Tools
        { id: 17, name: 'Claw Hammer 16oz', price: 285, quantity: 30, damagedQuantity: 1, category: 'Tools', imageUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
        { id: 18, name: 'Screwdriver Set 6pcs', price: 450, quantity: 9, damagedQuantity: 0, category: 'Tools', imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400' },
        { id: 19, name: 'Measuring Tape 5m', price: 185, quantity: 45, damagedQuantity: 2, category: 'Tools', imageUrl: 'https://images.unsplash.com/photo-1572981779307-e8f0c1d3e8e5?w=400' },
        { id: 20, name: 'Hand Saw 20 inch', price: 395, quantity: 25, damagedQuantity: 1, category: 'Tools', imageUrl: 'https://images.unsplash.com/photo-1586864387634-29e49c7f1820?w=400' }
    ]);

    const [selectedCategory, setSelectedCategory] = useState<string>('Cement');
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // 🔥 Updated form state: added `damagedQuantity`
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        damagedQuantity: '',
        imageUrl: ''
    });

    const filteredProducts = products.filter(p => p.category === selectedCategory);

    const isLowStock = (quantity: number): boolean => quantity < 10;
    const hasDamaged = (damagedQuantity: number): boolean => damagedQuantity > 0;

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
        setShowAddForm(false);
        setEditingProduct(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', quantity: '', damagedQuantity: '', imageUrl: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
            ...formData,
            imageUrl: reader.result as string
            });
        };
        reader.readAsDataURL(file);
        }
    };

    const handleAddProduct = () => {
        const { name, price, quantity, damagedQuantity, imageUrl } = formData;
        if (!name || !price || !quantity || !imageUrl) {
        alert('Please fill all required fields (name, price, quantity, image)');
        return;
        }

        const parsedQuantity = parseInt(quantity);
        const parsedDamaged = parseInt(damagedQuantity || '0');

        if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        alert('Usable quantity must be a non-negative number.');
        return;
        }
        if (isNaN(parsedDamaged) || parsedDamaged < 0) {
        alert('Damaged quantity cannot be negative.');
        return;
        }

        const newProduct: Product = {
        id: products.length + 1,
        name,
        price: parseFloat(price),
        quantity: parsedQuantity,
        damagedQuantity: parsedDamaged,
        category: selectedCategory,
        imageUrl
        };

        setProducts([...products, newProduct]);
        setShowAddForm(false);
        resetForm();
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setFormData({
        name: product.name,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        damagedQuantity: product.damagedQuantity.toString(),
        imageUrl: product.imageUrl
        });
        setShowAddForm(false);
    };

    const handleSaveEdit = () => {
        if (!editingProduct) return;

        const { quantity, damagedQuantity } = formData;
        const newQuantity = parseInt(quantity);
        const newDamaged = parseInt(damagedQuantity || '0');

        if (isNaN(newQuantity) || newQuantity < 0) {
        alert('Usable quantity must be a non-negative number.');
        return;
        }
        if (isNaN(newDamaged) || newDamaged < 0) {
        alert('Damaged quantity cannot be negative.');
        return;
        }

        const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
            ? { 
                ...p, 
                name: formData.name, 
                price: parseFloat(formData.price), 
                quantity: newQuantity, 
                damagedQuantity: newDamaged,
                imageUrl: formData.imageUrl 
            }
            : p
        );

        setProducts(updatedProducts);
        setEditingProduct(null);
        resetForm();
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        resetForm();
    };

    return (
        <div className="min-h-screen bg-white">
        <header className="bg-[#DC0E0E] text-white shadow-lg">
            <div className="container mx-auto px-6 py-4">
            <div className="flex items-center space-x-3">
                <Package size={32} />
                <div>
                <h1 className="text-3xl font-bold">Hardware POS</h1>
                <p className="text-sm text-white/90">Inventory Management System</p>
                </div>
            </div>
            </div>
        </header>

        <div className="container mx-auto px-6 py-8">
            <div className="flex gap-8">
            <aside className="w-64 flex-shrink-0">
                <div className="bg-gray-50 rounded-lg shadow-md p-4 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Package size={24} className="mr-2" /> Categories
                </h2>
                <nav className="space-y-2">
                    {categories.map(category => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.name)}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                        selectedCategory === category.name
                            ? 'bg-[#DC0E0E] text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <span className="flex-shrink-0">{category.icon}</span>
                        <span>{category.name}</span>
                    </button>
                    ))}

                    {/* ✅ Add Category Button & Inline Form */}
                    {!showAddCategoryForm ? (
                    <button
                        onClick={() => setShowAddCategoryForm(true)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                    >
                        <Plus size={16} />
                        <span>Add Category</span>
                    </button>
                    ) : (
                    <div className="mt-2">
                        <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Category name"
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#DC0E0E] focus:border-transparent"
                            autoFocus
                        />
                        <button
                            onClick={() => {
                            const name = newCategoryName.trim();
                            if (!name) {
                                alert('Category name cannot be empty.');
                                return;
                            }
                            if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
                                alert('Category already exists!');
                                return;
                            }
                            const newCategory: Category = {
                                id: Math.max(...categories.map(c => c.id), 0) + 1,
                                name: name,
                                icon: <Package size={20} />
                            };
                            setCategories([...categories, newCategory]);
                            handleCategoryClick(name); // auto-select
                            setNewCategoryName('');
                            setShowAddCategoryForm(false);
                            }}
                            className="px-3 py-2 bg-[#DC0E0E] text-white rounded hover:bg-[#B80C0C] text-sm"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => {
                            setShowAddCategoryForm(false);
                            setNewCategoryName('');
                            }}
                            className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                        >
                            ✕
                        </button>
                        </div>
                    </div>
                    )}
                </nav>
                </div>
            </aside>

            <main className="flex-1">
                <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{selectedCategory}</h2>
                    <p className="text-gray-600 mt-1">{filteredProducts.length} items in stock</p>
                </div>
                <button
                    onClick={() => {
                    setShowAddForm(!showAddForm);
                    setEditingProduct(null);
                    resetForm();
                    }}
                    className="bg-[#DC0E0E] text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-[#B80C0C] transition-colors shadow-md"
                >
                    <Plus size={20} />
                    <span>Add New Product</span>
                </button>
                </div>

                {/* Add Product Form */}
                {showAddForm && (
                <div className="bg-gray-50 rounded-lg shadow-md p-6 mb-6 border-2 border-[#DC0E0E]">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Product to {selectedCategory}</h3>
                    <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Product Name</label>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DC0E0E] focus:border-transparent"
                        placeholder="Enter product name"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Product Image</label>
                        <div className="relative">
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DC0E0E] focus:border-transparent"
                            placeholder="Click icon to upload image"
                            readOnly
                        />
                        <label className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#DC0E0E] text-white p-2 rounded-lg cursor-pointer hover:bg-[#B80C0C] transition-colors">
                            <Upload size={20} />
                            <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            />
                        </label>
                        </div>
                        {formData.imageUrl && (
                        <div className="mt-3">
                            <img src={formData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm" />
                        </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-gray-700 font-medium mb-2">Price (₱)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DC0E0E] focus:border-transparent"
                            placeholder="0.00"
                            step="0.01"
                        />
                        </div>
                        <div>
                        <label className="block text-gray-700 font-medium mb-2">Usable Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DC0E0E] focus:border-transparent"
                            placeholder="0"
                            min="0"
                        />
                        </div>
                    </div>
                    {/* 🔥 Damaged Quantity Input */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Damaged Quantity (optional)</label>
                        <input
                        type="number"
                        name="damagedQuantity"
                        value={formData.damagedQuantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DC0E0E] focus:border-transparent"
                        placeholder="0"
                        min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Items that are damaged, expired, or unusable.</p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                        onClick={handleAddProduct}
                        className="bg-[#DC0E0E] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#B80C0C] transition-colors"
                        >
                        Add Product
                        </button>
                        <button
                        onClick={() => {
                            setShowAddForm(false);
                            resetForm();
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                        >
                        Cancel
                        </button>
                    </div>
                    </div>
                </div>
                )}

                {/* Edit Product Form */}
                {editingProduct && (
                <div className="bg-yellow-50 rounded-lg shadow-md p-6 mb-6 border-2 border-yellow-400">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Product</h3>
                    <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Product Name</label>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Product Image</label>
                        <div className="relative">
                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            readOnly
                        />
                        <label className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#DC0E0E] text-white p-2 rounded-lg cursor-pointer hover:bg-[#B80C0C] transition-colors">
                            <Upload size={20} />
                            <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            />
                        </label>
                        </div>
                        {formData.imageUrl && (
                        <div className="mt-3">
                            <img src={formData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-sm" />
                        </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-gray-700 font-medium mb-2">Price (₱)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            step="0.01"
                        />
                        </div>
                        <div>
                        <label className="block text-gray-700 font-medium mb-2">Usable Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            min="0"
                        />
                        </div>
                    </div>
                    {/* Damaged Quantity in Edit */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Damaged Quantity</label>
                        <input
                        type="number"
                        name="damagedQuantity"
                        value={formData.damagedQuantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        min="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                        Damaged: {editingProduct.damagedQuantity} | Usable: {editingProduct.quantity}
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button
                        onClick={handleSaveEdit}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                        Save Changes
                        </button>
                        <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                        >
                        Cancel
                        </button>
                    </div>
                    </div>
                </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                    <div
                    key={product.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all hover:shadow-lg ${
                        isLowStock(product.quantity) && !hasDamaged(product.damagedQuantity)
                        ? 'border-[#DC0E0E] bg-red-50'
                        : hasDamaged(product.damagedQuantity)
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200'
                    }`}
                    >
                    <div className="relative h-70 bg-white">
                        <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/eee/999?text=No+Image' }}
                        />
                        {/* Low Stock Badge */}
                        {isLowStock(product.quantity) && !hasDamaged(product.damagedQuantity) && (
                        <div className="absolute top-2 right-2 bg-[#DC0E0E] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                            <AlertCircle size={14} />
                            <span>Low Stock</span>
                        </div>
                        )}
                        {/* 🔥 Damaged Badge */}
                        {hasDamaged(product.damagedQuantity) && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                            <AlertTriangle size={14} />
                            <span>{product.damagedQuantity} Damaged</span>
                        </div>
                        )}
                    </div>

                    <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">{product.name}</h3>
                        
                        <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Price:</span>
                            <span className="text-xl font-bold text-[#DC0E0E]">₱{product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Available:</span>
                            <span className={`text-lg font-semibold ${
                            isLowStock(product.quantity) ? 'text-[#DC0E0E]' : 'text-gray-800'
                            }`}>
                            {product.quantity} units
                            </span>
                        </div>
                        {/* 🔥 Show damaged line only if >0 */}
                        {product.damagedQuantity > 0 && (
                            <div className="flex justify-between items-center">
                            <span className="text-gray-600">Damaged:</span>
                            <span className="text-lg font-semibold text-yellow-600">
                                {product.damagedQuantity} units
                            </span>
                            </div>
                        )}
                        {/* Optional: Show total physical stock */}
                        {product.damagedQuantity > 0 && (
                            <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Total Stock:</span>
                            <span className="text-gray-700 font-medium">
                                {product.quantity + product.damagedQuantity}
                            </span>
                            </div>
                        )}
                        </div>

                        <button
                        onClick={() => handleEditClick(product)}
                        className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors"
                        >
                        <Edit2 size={16} />
                        <span>Edit</span>
                        </button>
                    </div>
                    </div>
                ))}
                </div>

                {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                    <Package size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No products in this category</h3>
                    <p className="text-gray-500">Click "Add New Product" to get started</p>
                </div>
                )}
            </main>
            </div>
        </div>
        </div>
    );
    };

    export default InventoryPOS;