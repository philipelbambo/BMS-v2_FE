import React, { useState, useRef } from 'react';
import { 
Package, 
Plus, 
ArrowLeft, 
AlertTriangle, 
RotateCcw, 
Trash2, 
Search,
Upload
} from 'lucide-react';

interface Material {
id: string;
name: string;
quantity: number;
unit: string;
price: number;
damaged: number;
image: string; // Can be a public path OR a blob URL
description: string;
}

interface Category {
id: string;
name: string;
materials: Material[];
}

const HardwareInventory = () => {
const [categories, setCategories] = useState<Category[]>([
    {
    id: '1',
    name: 'Cement',
    materials: [
        { 
        id: '1-1', 
        name: 'Portland Cement Type I', 
        quantity: 250, 
        unit: 'bags', 
        price: 245.00, 
        damaged: 5, 
        image: '/cement.png',
        description: '40kg bag' 
        },
        { 
        id: '1-2', 
        name: 'Portland Cement Type II',
        quantity: 180, 
        unit: 'bags', 
        price: 255.00, 
        damaged: 2, 
        image: '/portland-cement-2.png',
        description: '40kg bag' 
        },
        { 
        id: '1-3', 
        name: 'Masonry Cement', 
        quantity: 120, 
        unit: 'bags', 
        price: 235.00, 
        damaged: 0, 
        image: '/masonry-cement.png',
        description: '40kg bag' 
        }
    ]
    },
    {
    id: '2',
    name: 'Hollow Blocks',
    materials: [
        { 
        id: '2-1', 
        name: 'CHB 4" Standard', 
        quantity: 5000, 
        unit: 'pcs', 
        price: 12.50, 
        damaged: 120, 
        image: '/hollow-blocks.png',
        description: '4 inches thickness' 
        },
        { 
        id: '2-2', 
        name: 'CHB 6" Standard',
        quantity: 3200, 
        unit: 'pcs', 
        price: 18.00, 
        damaged: 85, 
        image: '/chb-6.png',
        description: '6 inches thickness' 
        },
        { 
        id: '2-3', 
        name: 'CHB 8" Standard',
        quantity: 1500, 
        unit: 'pcs', 
        price: 24.00, 
        damaged: 45, 
        image: '/chb-8.png',
        description: '8 inches thickness' 
        }
    ]
    },
    {
    id: '3',
    name: 'Metal Roofing',
    materials: [
        { 
        id: '3-1', 
        name: 'G.I. Sheet 0.5mm', 
        quantity: 450, 
        unit: 'sheets', 
        price: 385.00, 
        damaged: 12, 
        image: '/metal-roofing.png',
        description: '8ft length' 
        },
        { 
        id: '3-2', 
        name: 'G.I. Sheet 0.8mm',
        quantity: 280, 
        unit: 'sheets', 
        price: 465.00, 
        damaged: 8, 
        image: '/gi-sheet-08.png',
        description: '8ft length' 
        },
        { 
        id: '3-3', 
        name: 'Long Span Roofing', 
        quantity: 320, 
        unit: 'sheets', 
        price: 520.00, 
        damaged: 15, 
        image: '/long-span.png',
        description: '10ft length' 
        }
    ]
    },
    {
    id: '4',
    name: 'Plywood',
    materials: [
        { 
        id: '4-1', 
        name: 'Marine Plywood 1/4"', 
        quantity: 180, 
        unit: 'sheets', 
        price: 485.00, 
        damaged: 8, 
        image: '/plywood.png',
        description: '4x8 feet' 
        },
        { 
        id: '4-2', 
        name: 'Marine Plywood 1/2"', 
        quantity: 220, 
        unit: 'sheets', 
        price: 785.00, 
        damaged: 5, 
        image: '/marine-half.png',
        description: '4x8 feet' 
        },
        { 
        id: '4-3', 
        name: 'Marine Plywood 3/4"', 
        quantity: 150, 
        unit: 'sheets', 
        price: 1050.00, 
        damaged: 3, 
        image: '/marine-three-quarter.png',
        description: '4x8 feet' 
        },
        { 
        id: '4-4', 
        name: 'Ordinary Plywood 1/4"', 
        quantity: 280, 
        unit: 'sheets', 
        price: 325.00, 
        damaged: 12, 
        image: '/ordinary-quarter.png',
        description: '4x8 feet' 
        },
        { 
        id: '4-5', 
        name: 'Ordinary Plywood 1/2"', 
        quantity: 195, 
        unit: 'sheets', 
        price: 565.00, 
        damaged: 9, 
        image: '/ordinary-half.png',
        description: '4x8 feet' 
        }
    ]
    }
]);

const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
const [view, setView] = useState<'categories' | 'materials' | 'details'>('categories');
const [showAddCategory, setShowAddCategory] = useState(false);
const [showAddMaterial, setShowAddMaterial] = useState(false);
const [showReturnModal, setShowReturnModal] = useState(false);
const [returnQuantity, setReturnQuantity] = useState(0);
const [searchQuery, setSearchQuery] = useState('');

const [newCategoryName, setNewCategoryName] = useState('');

const [newMaterial, setNewMaterial] = useState({
    name: '',
    quantity: 0,
    unit: '',
    price: 0,
    damaged: 0,
    image: '',
    description: '',
    file: null as File | null
});

const fileInputRef = useRef<HTMLInputElement>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);

const getCategoryImage = (category: Category): string => {
    return category.materials.length > 0 
    ? category.materials[0].image 
    : '/placeholder.png';
};

// ✅ Improved ImageRenderer that supports blob URLs
const ImageRenderer = ({ src, alt = '', className = '' }: { 
    src: string; 
    alt?: string; 
    className?: string;
}) => {
    if (!src) {
    return <span className="text-gray-500 text-sm p-2 text-center bg-gray-100 w-full block">No image</span>;
    }

    // Handle blob URLs directly
    if (src.startsWith('blob:')) {
    return (
        <img 
        src={src} 
        alt={alt} 
        className={`${className} object-cover w-full h-full`}
        onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'text-gray-500 text-sm p-3 text-center bg-gray-100 w-full h-full flex items-center justify-center';
            fallback.textContent = 'Image not found';
            (e.target as HTMLImageElement).after(fallback);
        }}
        />
    );
    }

    // Handle public paths
    let normalizedSrc = src;
    if (!src.startsWith('http') && !src.startsWith('/')) {
    normalizedSrc = `/${src}`;
    }

    return (
    <img 
        src={normalizedSrc} 
        alt={alt} 
        className={`${className} object-cover w-full h-full`}
        onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'text-gray-500 text-sm p-3 text-center bg-gray-100 w-full h-full flex items-center justify-center';
        fallback.textContent = 'Image not found';
        (e.target as HTMLImageElement).after(fallback);
        }}
    />
    );
};

const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setView('materials');
    setSearchQuery('');
};

const handleMaterialClick = (material: Material) => {
    setSelectedMaterial(material);
    setView('details');
};

const handleBack = () => {
    if (view === 'details') {
    setView('materials');
    setSelectedMaterial(null);
    } else if (view === 'materials') {
    setView('categories');
    setSelectedCategory(null);
    }
};

const handleAddCategory = () => {
    if (newCategoryName.trim()) {
    const category: Category = {
        id: `cat-${Date.now()}`,
        name: newCategoryName.trim(),
        materials: []
    };
    setCategories([...categories, category]);
    setNewCategoryName('');
    setShowAddCategory(false);
    
    setSelectedCategory(category);
    setView('materials');
    setShowAddMaterial(true);
    }
};

const handleAddMaterial = () => {
    if (selectedCategory && newMaterial.name.trim()) {
    const material: Material = {
        id: `${selectedCategory.id}-${Date.now()}`,
        name: newMaterial.name.trim(),
        quantity: newMaterial.quantity,
        unit: newMaterial.unit,
        price: newMaterial.price,
        damaged: newMaterial.damaged,
        image: newMaterial.image, // This is now a blob URL or public path
        description: newMaterial.description.trim(),
    };

    const updatedCat: Category = {
        ...selectedCategory,
        materials: [...selectedCategory.materials, material]
    };

    setCategories(categories.map(cat => 
        cat.id === selectedCategory.id ? updatedCat : cat
    ));
    setSelectedCategory(updatedCat);

    setNewMaterial({ name: '', quantity: 0, unit: '', price: 0, damaged: 0, image: '', description: '', file: null });
    setShowAddMaterial(false);
    setImagePreview(null);
    }
};

const handleReturnDamaged = () => {
    if (selectedMaterial && selectedCategory && returnQuantity > 0 && returnQuantity <= selectedMaterial.damaged) {
    const updatedMaterial = { 
        ...selectedMaterial, 
        damaged: selectedMaterial.damaged - returnQuantity,
        quantity: selectedMaterial.quantity + returnQuantity
    };
    const updatedCat: Category = {
        ...selectedCategory,
        materials: selectedCategory.materials.map(m => 
        m.id === selectedMaterial.id ? updatedMaterial : m
        )
    };
    setSelectedMaterial(updatedMaterial);
    setSelectedCategory(updatedCat);
    setCategories(categories.map(cat => 
        cat.id === selectedCategory.id ? updatedCat : cat
    ));
    setReturnQuantity(0);
    setShowReturnModal(false);
    }
};

const handleDeleteMaterial = (materialId: string) => {
    if (selectedCategory) {
    const updatedCat: Category = {
        ...selectedCategory,
        materials: selectedCategory.materials.filter(m => m.id !== materialId)
    };
    setCategories(categories.map(cat => 
        cat.id === selectedCategory.id ? updatedCat : cat
    ));
    setSelectedCategory(updatedCat);
    if (selectedMaterial?.id === materialId) {
        setSelectedMaterial(null);
        setView('materials');
    }
    }
};

const filteredMaterials = selectedCategory?.materials.filter(mat =>
    mat.name.toLowerCase().includes(searchQuery.toLowerCase())
) || [];

// ✅ Fixed: Store blob URL in `newMaterial.image`
const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
    if (!/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name)) {
        alert("Only image files are allowed.");
        return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // 👇 Critical: store the blob URL, not just filename
    setNewMaterial(prev => ({ ...prev, image: previewUrl, file }));
    }
};

return (
    <div className="min-h-screen bg-white">
    {/* Header */}
    <header className="border-b-2 border-[#DC0E0E] bg-white">
        <div className="px-6 py-5 md:px-8 md:py-6">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            {view !== 'categories' && (
                <button 
                onClick={handleBack} 
                className="p-2.5 hover:bg-gray-100 rounded transition-colors focus:outline-none"
                >
                <ArrowLeft className="w-6 h-6 text-[#DC0E0E]" />
                </button>
            )}
            <Package className="w-8 h-8 text-[#DC0E0E]" />
            <h1 className="text-2xl md:text-3xl font-bold text-[#DC0E0E]">Hardware Inventory System</h1>
            </div>
            {view === 'categories' && (
            <button
                onClick={() => setShowAddCategory(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#DC0E0E] text-white hover:bg-red-800 rounded transition-colors"
            >
                <Plus className="w-5 h-5" />
                Add Category
            </button>
            )}
            {view === 'materials' && (
            <button
                onClick={() => setShowAddMaterial(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#DC0E0E] text-white hover:bg-red-800 rounded transition-colors"
            >
                <Plus className="w-5 h-5" />
                Add Material
            </button>
            )}
        </div>
        </div>
    </header>

    {/* Main Content */}
    <main className="px-4 sm:px-6 md:px-8 py-6 md:py-8">
        {view === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {categories.map(category => {
            const categoryImage = getCategoryImage(category);
            return (
                <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="border-2 border-white bg-white cursor-pointer hover:bg-gray-100 transition-colors rounded-lg overflow-hidden shadow-sm"
                role="button"
                tabIndex={0}
                >
                <div className="aspect-[5/5] w-full bg-gray-200 overflow-hidden">
                    <ImageRenderer 
                    src={categoryImage} 
                    alt={category.name}
                    className="w-full h-full"
                    />
                </div>
                <div className="p-5">
                    <h3 className="text-xl font-bold text-[#DC0E0E]">{category.name}</h3>
                    <p className="text-gray-600 mt-1">{category.materials.length} materials</p>
                </div>
                </div>
            );
            })}
        </div>
        )}

        {view === 'materials' && selectedCategory && (
        <div>
            <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#DC0E0E]">{selectedCategory.name}</h2>
            <div className="relative mt-3 max-w-2xl">
                <Search className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" />
                <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-white text-black placeholder-gray-500 focus:outline-none rounded-lg"
                />
            </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map(material => (
                <div
                key={material.id}
                onClick={() => handleMaterialClick(material)}
                className="border-2 border-white bg-white cursor-pointer hover:bg-gray-50 transition-colors rounded-lg overflow-hidden shadow-sm"
                role="button"
                tabIndex={0}
                >
                <div className="aspect-video w-full bg-gray-200 overflow-hidden">
                    <ImageRenderer 
                    src={material.image} 
                    alt={material.name}
                    className="w-full h-full"
                    />
                </div>
                <div className="p-4">
                    <h4 className="font-bold text-[#423939] mb-1 line-clamp-2">{material.name}</h4>
                    <div className="space-y-1.5 text-sm text-[#423939]">
                    <p>Stock: <span className="font-semibold">{material.quantity} {material.unit}</span></p>
                    <p>Price: <span className="font-semibold">₱{material.price.toFixed(2)}</span></p>
                    {material.damaged > 0 && (
                        <div className="flex items-center gap-1.5 text-[#423939] pt-1">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                        <span className="font-semibold">{material.damaged} damaged</span>
                        </div>
                    )}
                    </div>
                </div>
                </div>
            ))}
            {filteredMaterials.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                No materials yet. Click "Add Material" to begin.
                </div>
            )}
            </div>
        </div>
        )}

        {view === 'details' && selectedMaterial && (
        <div className="max-w-7xl mx-auto">
            <div className="border-2 border-[#ffffff] bg-white p-6 md:p-8 rounded-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
                <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-lg aspect-square overflow-hidden rounded-lg border-2 border-[#ffffff] bg-gray-200">
                    <ImageRenderer 
                    src={selectedMaterial.image} 
                    alt={selectedMaterial.name}
                    className="w-full h-full"
                    />
                </div>
                </div>
                <div className="space-y-5">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#DC0E0E]">{selectedMaterial.name}</h2>
                    <p className="text-gray-700 text-lg mt-2">{selectedMaterial.description}</p>
                </div>
                
                <div className="space-y-3 pt-5 border-t-2 border-[#fffefe]">
                    <div className="flex justify-between">
                    <span className="font-semibold text-[#DC0E0E] text-lg">Available Stock:</span>
                    <span className="text-xl font-bold text-[#DC0E0E]">{selectedMaterial.quantity} {selectedMaterial.unit}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="font-semibold text-[#DC0E0E] text-lg">Unit Price:</span>
                    <span className="text-xl font-bold text-[#DC0E0E]">₱{selectedMaterial.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span className="font-semibold text-[#DC0E0E] text-lg">Total Value:</span>
                    <span className="text-xl font-bold text-[#DC0E0E]">₱{(selectedMaterial.quantity * selectedMaterial.price).toFixed(2)}</span>
                    </div>
                </div>

                {selectedMaterial.damaged > 0 && (
                    <div className="border-2 border-[#ffffff] bg-gray-50 p-5 rounded-lg">
                    <div className="flex items-center gap-2.5 mb-3">
                        <AlertTriangle className="w-5 h-5 text-[#ad2020]" />
                        <span className="font-bold text-[#DC0E0E] text-lg">Damaged Items</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[#DC0E0E] text-lg">Damaged Quantity:</span>
                        <span className="text-2xl font-bold text-[#DC0E0E]">{selectedMaterial.damaged} {selectedMaterial.unit}</span>
                    </div>
                    <button
                        onClick={() => setShowReturnModal(true)}
                        className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-[#DC0E0E] text-white hover:bg-red-800 transition-colors rounded-lg"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Return to Inventory
                    </button>
                    </div>
                )}

                <div className="pt-3">
                    <button
                    onClick={() => handleDeleteMaterial(selectedMaterial.id)}
                    className="w-full flex items-center justify-center gap-2.5 px-5 py-3 border-2 border-[#DC0E0E] text-[#DC0E0E] hover:bg-gray-100 transition-colors rounded-lg"
                    >
                    <Trash2 className="w-5 h-5" />
                    Delete This Material
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
        )}
    </main>

    {/* Add Category Modal */}
    {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div className="bg-white border-2 border-[#DC0E0E] p-6 rounded-xl w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold text-[#DC0E0E] mb-5">➕ Add New Category</h3>
            <div className="space-y-5">
            <input
                type="text"
                placeholder="Category Name *"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-5 py-3.5 border-2 border-[#DC0E0E] text-black placeholder-gray-500 focus:outline-none rounded-lg text-lg"
                autoFocus
            />
            <p className="text-sm text-gray-600">
                📝 After creating, you'll be prompted to add the first material.  
                Its image will become the category's main image.
            </p>
            <div className="flex gap-3 pt-2">
                <button
                onClick={() => setShowAddCategory(false)}
                className="px-6 py-3.5 border-2 border-[#DC0E0E] text-[#DC0E0E] hover:bg-gray-100 transition-colors rounded-lg flex-1"
                >
                Cancel
                </button>
                <button
                onClick={handleAddCategory}
                className="px-6 py-3.5 bg-[#DC0E0E] text-white hover:bg-red-800 transition-colors rounded-lg flex-1"
                >
                ✅ Create & Add First Material
                </button>
            </div>
            </div>
        </div>
        </div>
    )}

    {/* Add Material Modal */}
    {showAddMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white border-2 border-[#DC0E0E] p-6 rounded-xl w-full max-w-2xl mx-4">
            <h3 className="text-2xl font-bold text-[#DC0E0E] mb-5">
            ➕ Add Material to <span className="text-blue-600">"{selectedCategory?.name}"</span>
            </h3>
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <input
                type="text"
                placeholder="Material Name *"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                className="w-full px-5 py-3.5 border-2 border-[#DC0E0E] text-black placeholder-gray-500 focus:outline-none rounded-lg text-lg"
                autoFocus
            />

            <div className="flex items-center gap-2">
                <input
                type="text"
                placeholder="Image will update automatically when you upload"
                value={newMaterial.image ? 'Image selected (see preview below)' : ''}
                readOnly
                className="flex-1 px-5 py-3.5 border-2 border-[#DC0E0E] text-black bg-gray-50 rounded-lg"
                />
                <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-gray-100 hover:bg-gray-200 border-2 border-gray-300 rounded-lg transition-colors focus:outline-none"
                aria-label="Upload image file"
                >
                <Upload className="w-5 h-5 text-gray-600" />
                </button>
                <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                />
            </div>
            <p className="text-sm text-gray-600 -mt-1 mb-3">
                📁 You can place files in <code className="bg-gray-100 px-1.5 py-0.5 rounded">public/</code> for permanent paths.
            </p>

            {/* Image Preview */}
            <div className="border-2 border-[#DC0E0E] p-3 rounded-lg">
                <h4 className="font-semibold text-[#DC0E0E] mb-2">Image Preview:</h4>
                {imagePreview ? (
                <img
                    src={imagePreview}
                    alt="Selected preview"
                    className="max-w-full h-auto max-h-48 object-contain rounded-md"
                />
                ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 rounded-md">
                    No image selected
                </div>
                )}
            </div>

            <input
                type="text"
                placeholder="Description"
                value={newMaterial.description}
                onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                className="w-full px-5 py-3.5 border-2 border-[#DC0E0E] text-black placeholder-gray-500 focus:outline-none rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4">
                <input
                type="number"
                placeholder="Quantity *"
                value={newMaterial.quantity || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, quantity: Number(e.target.value) })}
                min="0"
                className="w-full px-5 py-3.5 border-2 border-[#DC0E0E] text-black placeholder-gray-500 focus:outline-none rounded-lg"
                />
                <input
                type="text"
                placeholder="Unit (e.g., bags) *"
                value={newMaterial.unit}
                onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                className="w-full px-5 py-3.5 border-2 border-[#DC0E0E] text-black placeholder-gray-500 focus:outline-none rounded-lg"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input
                type="number"
                step="0.01"
                placeholder="Price *"
                value={newMaterial.price || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, price: Number(e.target.value) })}
                min="0"
                className="w-full px-5 py-3.5 border-2 border-[#DC0E0E] text-black placeholder-gray-500 focus:outline-none rounded-lg"
                />
                <input
                type="number"
                placeholder="Damaged"
                value={newMaterial.damaged || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, damaged: Number(e.target.value) })}
                min="0"
                className="w-full px-5 py-3.5 border-2 border-[#DC0E0E] text-black placeholder-gray-500 focus:outline-none rounded-lg"
                />
            </div>
            <div className="flex gap-3 pt-3">
                <button
                onClick={() => {
                    setShowAddMaterial(false);
                    setImagePreview(null);
                }}
                className="px-6 py-3.5 border-2 border-[#DC0E0E] text-[#DC0E0E] hover:bg-gray-100 transition-colors rounded-lg flex-1"
                >
                Cancel
                </button>
                <button
                onClick={() => {
                    handleAddMaterial();
                    setImagePreview(null);
                }}
                className="px-6 py-3.5 bg-[#DC0E0E] text-white hover:bg-red-800 transition-colors rounded-lg flex-1"
                >
                ✅ Add Material
                </button>
            </div>
            </div>
        </div>
        </div>
    )}

    {/* Return Modal */}
    {showReturnModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
        <div className="bg-white border-2 border-[#DC0E0E] p-6 rounded-xl w-full max-w-md mx-4">
            <h3 className="text-2xl font-bold text-[#DC0E0E] mb-4">🔄 Return Damaged Items</h3>
            <p className="text-[#DC0E0E] mb-5">
            Damaged stock: <span className="font-bold text-lg">{selectedMaterial.damaged} {selectedMaterial.unit}</span>
            </p>
            <input
            type="number"
            placeholder="Quantity to return"
            value={returnQuantity || ''}
            onChange={(e) => setReturnQuantity(Number(e.target.value))}
            max={selectedMaterial.damaged}
            min="1"
            className="w-full px-5 py-3.5 border-2 border-[#DC0E0E] text-black placeholder-gray-500 focus:outline-none rounded-lg text-lg mb-5"
            autoFocus
            />
            <div className="flex gap-3">
            <button
                onClick={() => {
                setShowReturnModal(false);
                setReturnQuantity(0);
                }}
                className="px-6 py-3.5 border-2 border-[#DC0E0E] text-[#DC0E0E] hover:bg-gray-100 transition-colors rounded-lg flex-1"
            >
                Cancel
            </button>
            <button
                onClick={handleReturnDamaged}
                disabled={returnQuantity <= 0 || returnQuantity > selectedMaterial.damaged}
                className={`px-6 py-3.5 rounded-lg flex-1 ${
                returnQuantity > 0 && returnQuantity <= selectedMaterial.damaged
                    ? 'bg-[#DC0E0E] text-white hover:bg-red-800'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
            >
                ✅ Confirm Return
            </button>
            </div>
        </div>
        </div>
    )}
    </div>
); 
};

export default HardwareInventory;