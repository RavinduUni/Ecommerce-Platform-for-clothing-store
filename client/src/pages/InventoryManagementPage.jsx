import axios from 'axios';
import { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const InventoryManagementPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    images: [],
    sizes: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [activeView, setActiveView] = useState('inventory'); // 'inventory' or 'orders'
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const { allProducts, orders } = useContext(AppContext);
  const { adminLogout} = useContext(AdminContext);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLogoutDropdown(false);
      }
    };

    if (showLogoutDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutDropdown]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const getStatusClass = (color) => {
    const classes = {
      green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    };
    return classes[color] || classes.slate;
  };

  const handleFileInput = (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = [];

    for (let file of fileArray) {
      // Check if we already have 3 images
      if (uploadedImages.length + validFiles.length >= 3) {
        alert('You can only upload up to 3 images');
        break;
      }

      // Validate file type
      if (!file.type.match('image/(jpeg|jpg|png)')) {
        alert(`${file.name} is not a valid image. Only JPG and PNG files are allowed.`);
        continue;
      }

      // Validate file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum file size is 2MB.`);
        continue;
      }

      validFiles.push(file);
    }

    // Create preview URLs for valid files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages(prev => {
          if (prev.length < 3) {
            return [...prev, { file, preview: e.target.result, id: Date.now() + Math.random() }];
          }
          return prev;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileInput(e.dataTransfer.files);
    }
  };

  const handleBrowseFiles = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileInput(e.target.files);
    }
  };

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleModalClose = () => {
    setShowModal(false);
    setUploadedImages([]);
    setSelectedSizes([]);
    setProduct({
      name: '',
      sku: '',
      category: '',
      description: '',
      originalPrice: '',
      discountedPrice: '',
      images: [],
      sizes: []
    });
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => {
      const exists = prev.find(s => s.size === size);
      if (exists) {
        return prev.filter(s => s.size !== size);
      } else {
        return [...prev, { size, stock: 0, skuSuffix: `-${size}-BLK` }];
      }
    });
  };

  const updateSizeStock = (size, stock) => {
    setSelectedSizes(prev =>
      prev.map(s => s.size === size ? { ...s, stock: parseInt(stock) || 0 } : s)
    );
  };

  const updateSizeSku = (size, skuSuffix) => {
    setSelectedSizes(prev =>
      prev.map(s => s.size === size ? { ...s, skuSuffix } : s)
    );
  };

  const publishProduct = async (e) => {
    e.preventDefault();

    try {

      if (!product.name || !product.sku) {
        return alert("Name and SKU required");
      }

      if (uploadedImages.length === 0) {
        return alert("At least one image required");
      }

      setIsPublishing(true);

      const formData = new FormData();

      formData.append('name', product.name);
      formData.append('sku', product.sku);
      formData.append('category', product.category);
      formData.append('description', product.description);
      formData.append('originalPrice', product.originalPrice);
      formData.append('discountedPrice', product.discountedPrice);

      // Append images
      uploadedImages.forEach((img) => {
        formData.append('images', img.file);
      });

      // Append sizes as a JSON string
      formData.append('sizes', JSON.stringify(selectedSizes));

      const { data } = await axios.post(`${backendUrl}/api/products/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!data.success) {
        throw new Error(data.message || 'Failed to publish product');
      }

      alert('Product published successfully!');

      await fetchProducts();

      handleModalClose();
    } catch (error) {
      alert(error.message || 'An error occurred while publishing the product.');
    } finally {
      setIsPublishing(false);
    }
  };

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'ALL' || product.category?.toUpperCase() === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <>
      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-950 h-full overflow-y-auto shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800">
            <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-950/95 backdrop-blur px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Add New Product</h2>
                <p className="text-xs text-slate-500 font-medium">Create a new entry in your luxury collection</p>
              </div>
              <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={handleModalClose}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={publishProduct} className="p-8 space-y-10">
              <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">General Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Product Name</label>
                    <input className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-sm"
                      placeholder="e.g., Midnight Cashmere Overcoat"
                      type="text"
                      value={product.name}
                      onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">SKU</label>
                    <input
                      className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-sm"
                      placeholder="LUX-12345"
                      type="text"
                      value={product.sku}
                      onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Category</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-sm"
                      value={product.category}
                      onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      <option value="men">MEN</option>
                      <option value="women">WOMEN</option>
                      <option value="accessories">ACCESSORIES</option>
                    </select>
                  </div>
                </div>
              </section>
              <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="material-symbols-outlined text-primary">image</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Product Media</h3>
                </div>
                <div
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center group cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 transition-colors ${dragActive
                    ? 'border-primary bg-primary/5'
                    : uploadedImages.length >= 3
                      ? 'border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed'
                      : 'border-slate-200 dark:border-slate-800 hover:border-primary'
                    }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (uploadedImages.length < 3) {
                      document.getElementById('fileInput').click();
                    }
                  }}
                >
                  <div className="size-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {uploadedImages.length >= 3 ? 'Maximum 3 images uploaded' : 'Drag and drop high-quality images here'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PNG or JPG (max. 2MB each, up to 3 images)</p>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    multiple
                    onChange={handleBrowseFiles}
                    className="hidden"
                    disabled={uploadedImages.length >= 3}
                  />
                  <button
                    className="mt-4 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (uploadedImages.length < 3) {
                        document.getElementById('fileInput').click();
                      }
                    }}
                    disabled={uploadedImages.length >= 3}
                  >
                    Browse Files
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 relative group overflow-hidden">
                      <img
                        alt="Preview"
                        className="w-full h-full object-cover"
                        src={image.preview}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 size-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  ))}
                  {[...Array(3 - uploadedImages.length)].map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center border-dashed"
                    >
                      <span className="material-symbols-outlined text-slate-400">add</span>
                    </div>
                  ))}
                </div>
              </section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="material-symbols-outlined text-primary">payments</span>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Pricing</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Original Price (€)</label>
                      <input
                        className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-sm"
                        placeholder="0.00"
                        step="0.01"
                        type="number"
                        value={product.originalPrice}
                        onChange={(e) => setProduct({ ...product, originalPrice: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">Discounted Price (€)</label>
                      <input
                        className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-lg focus:ring-primary focus:border-primary px-4 py-3 text-sm"
                        placeholder="0.00"
                        step="0.01"
                        type="number"
                        value={product.discountedPrice}
                        onChange={(e) => setProduct({ ...product, discountedPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </section>
                <section className="space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="material-symbols-outlined text-primary">description</span>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Description</h3>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 flex gap-1">
                      <button type="button" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"><span className="material-symbols-outlined text-lg">format_bold</span></button>
                      <button type="button" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"><span className="material-symbols-outlined text-lg">format_italic</span></button>
                      <button type="button" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"><span className="material-symbols-outlined text-lg">format_list_bulleted</span></button>
                      <div className="w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>
                      <button type="button" className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"><span className="material-symbols-outlined text-lg">link</span></button>
                    </div>
                    <textarea
                      className="w-full border-none bg-white dark:bg-slate-950 focus:ring-0 text-sm p-4"
                      placeholder="Describe the craftsmanship, materials, and fit..."
                      rows="6"
                      value={product.description}
                      onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    ></textarea>
                  </div>
                </section>
              </div>
              <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="material-symbols-outlined text-primary">inventory_2</span>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Inventory &amp; Variants</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">Available Sizes</label>
                      <p className="text-xs text-slate-500 mb-3">Click on sizes to add them to inventory</p>
                      <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL'].map(size => {
                          const isSelected = selectedSizes.some(s => s.size === size);
                          return (
                            <button
                              key={size}
                              className={`px-3 py-1.5 border font-bold text-xs rounded transition-all ${isSelected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary'
                                }`}
                              type="button"
                              onClick={() => toggleSize(size)}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    {selectedSizes.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700 mb-2">inventory</span>
                        <p className="text-xs text-slate-500">No sizes selected</p>
                        <p className="text-xs text-slate-400">Click on sizes to add variants</p>
                      </div>
                    ) : (
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-slate-500 uppercase tracking-wider">
                            <th className="text-left pb-2">Variant</th>
                            <th className="text-center pb-2">Stock</th>
                            <th className="text-right pb-2">SKU Suffix</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {selectedSizes.map((sizeData) => (
                            <tr key={sizeData.size}>
                              <td className="py-2 font-medium">{sizeData.size} / Black</td>
                              <td className="py-2">
                                <input
                                  className="w-14 mx-auto block bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded py-1 text-xs text-center"
                                  type="number"
                                  value={sizeData.stock}
                                  onChange={(e) => updateSizeStock(sizeData.size, e.target.value)}
                                  min="0"
                                />
                              </td>
                              <td className="py-2">
                                <input
                                  className="w-20 ml-auto block bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded py-1 text-[10px] text-right"
                                  type="text"
                                  value={sizeData.skuSuffix}
                                  onChange={(e) => updateSizeSku(sizeData.size, e.target.value)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                  </div>

                </div>
              </section>
              <section className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">visibility</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Publish Status</p>
                    <p className="text-xs text-slate-500">Make this product visible to customers immediately</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </section>
              <div className="flex gap-4 pt-6">
                <button className="flex-1 px-6 py-4 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-widest" onClick={handleModalClose} type="button">
                  Discard Draft
                </button>
                <button
                  className="flex-2 px-12 py-4 bg-primary text-white rounded-lg font-black text-sm shadow-xl shadow-primary/20 hover:brightness-110 transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70"
                  type="submit"
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">
                        progress_activity
                      </span>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">save</span>
                      Publish Product
                    </>
                  )}
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100">
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">diamond</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">LUXE <span className="text-primary">ADMIN</span></h1>
              </div>
              <nav className="hidden md:flex items-center gap-6 ml-4">
                <button 
                  className={`text-sm font-semibold transition-colors ${
                    activeView === 'inventory' ? 'text-primary' : 'text-slate-500 hover:text-primary'
                  }`}
                  onClick={() => setActiveView('inventory')}
                >
                  Inventory
                </button>
                <button 
                  className={`text-sm font-semibold transition-colors ${
                    activeView === 'orders' ? 'text-primary' : 'text-slate-500 hover:text-primary'
                  }`}
                  onClick={() => setActiveView('orders')}
                >
                  Orders
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
              <div className="flex items-center gap-3 pl-2 relative" ref={dropdownRef}>
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold">Store Manager</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Admin</p>
                </div>
                <button 
                  onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
                  className="size-10 rounded-full bg-primary/20 border-2 border-primary/10 overflow-hidden flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary">person</span>
                </button>
                
                {/* Logout Dropdown */}
                {showLogoutDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-3"
                    >
                      <span className="material-symbols-outlined text-lg text-red-500">logout</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-[1440px] mx-auto px-6 py-8">
          {activeView === 'inventory' ? (
            // INVENTORY VIEW
            <>
          {/* Page Heading & Quick Actions */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Inventory Management</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your premium collection and stock levels.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <span className="material-symbols-outlined text-lg">file_download</span>
                Export CSV
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-110 transition-all" onClick={() => setShowModal(true)}>
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Add New Product
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 mb-6 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                placeholder="Search by name, SKU, or attribute..."
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {['ALL', 'MEN', 'WOMEN', 'ACCESSORIES'].map((category) => (
                <button
                  key={category}
                  onClick={() => { setFilterCategory(category); setCurrentPage(1); }}
                  className={`flex h-11 shrink-0 items-center gap-2 px-4 rounded-lg text-sm font-bold ${filterCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-primary/10 transition-colors'
                    }`}
                >
                  {category}
                </button>
              ))}
              <button className="flex h-11 shrink-0 items-center gap-2 px-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold">
                <span className="material-symbols-outlined text-lg">filter_list</span>
                More Filters
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Image</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Product Details</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">SKU</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Price($)</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Stock Level</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="size-14 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" src={product.images[0]} alt={product.name} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.category}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{product.sku}</td>
                      <td className="px-6 py-4 text-sm font-bold text-right">{product.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center bg-slate-100 dark:bg-slate-800 px-3 py-1 w-16 mx-auto rounded-md">
                          <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{product.availableSizes.reduce((total, size) => total + size.qty, 0)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusClass('In Stock')}`}>
                          In Stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-xl">edit_square</span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">Showing <span className="font-bold text-slate-900 dark:text-white">{}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredProducts.length}</span> products</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={goPrev}
                  disabled={currentPage === 1}
                  className={`size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 ${currentPage === 1 ? 'cursor-not-allowed opacity-40' : 'hover:border-primary transition-colors'}`}>
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`size-8 flex items-center justify-center rounded border text-sm font-medium ${currentPage === page
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary transition-colors'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={goNext}
                  disabled={currentPage === totalPages}
                  className={`size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 ${currentPage === totalPages ? 'cursor-not-allowed opacity-40' : 'hover:border-primary transition-colors'}`}>
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer / Status Info */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Valuation</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">${allProducts.map(product => product.price).reduce((a, b) => a + b, 0).toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Active Items</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{allProducts.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Out of Stock</p>
              <p className="text-2xl font-black text-red-500">12</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Restock Pending</p>
              <p className="text-2xl font-black text-amber-500">5</p>
            </div>
          </div>
            </>
          ) : (
            // ORDERS VIEW
            <>
              {/* Page Heading */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Order Management</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage customer orders.</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    <span className="material-symbols-outlined text-lg">file_download</span>
                    Export Orders
                  </button>
                </div>
              </div>

              {/* Orders Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">shopping_cart</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">+12.5%</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Orders</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="size-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400">payments</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">+8.2%</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Revenue</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    ${orders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + (order.pricing?.total || 0), 0).toFixed(2)}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="size-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">schedule</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                      {orders.filter(o => o.status === 'placed' || o.status === 'processing').length} active
                    </span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Pending Orders</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {orders.filter(o => o.status === 'placed' || o.status === 'processing').length}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="size-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                    </div>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                      {orders.filter(o => o.status === 'delivered').length}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Delivered</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Order ID</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Customer</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Date</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Items</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Total ($)</th>
                        <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {orders.map((order) => {
                        const statusConfig = {
                          delivered: { color: 'green', icon: 'check_circle' },
                          processing: { color: 'blue', icon: 'autorenew' },
                          shipped: { color: 'amber', icon: 'local_shipping' },
                          placed: { color: 'slate', icon: 'schedule' },
                          cancelled: { color: 'red', icon: 'cancel' }
                        };
                        const config = statusConfig[order.status] || statusConfig.placed;
                        
                        return (
                          <tr key={order._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-mono font-bold text-sm text-primary">{order.orderNumber}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-slate-400 text-lg">person</span>
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 dark:text-white text-sm">{order.shippingAddress?.fullName || 'N/A'}</p>
                                  <p className="text-xs text-slate-500">{order.shippingAddress?.email || 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md text-sm font-bold">{order.items?.length || 0}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className="font-black text-slate-900 dark:text-white">${(order.pricing?.total || 0).toFixed(2)}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${getStatusClass(config.color)}`}>
                                <span className="material-symbols-outlined text-sm">{config.icon}</span>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Orders Pagination */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">
                    Showing <span className="font-bold text-slate-900 dark:text-white">1-{orders.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{orders.length}</span> orders
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 cursor-not-allowed opacity-40">
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <button className="size-8 flex items-center justify-center rounded border text-sm font-medium bg-primary text-white border-primary">
                      1
                    </button>
                    <button className="size-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-not-allowed opacity-40">
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Average Order Value</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    ${orders.length > 0 ? (orders.filter(o => o.status !== 'cancelled').reduce((sum, order) => sum + (order.pricing?.total || 0), 0) / orders.filter(o => o.status !== 'cancelled').length).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Processing</p>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {orders.filter(o => o.status === 'processing').length}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">In Transit</p>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {orders.filter(o => o.status === 'shipped').length}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Cancelled</p>
                  <p className="text-2xl font-black text-red-500">
                    {orders.filter(o => o.status === 'cancelled').length}
                  </p>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default InventoryManagementPage;
