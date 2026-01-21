import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useContext, useState } from 'react';

const ProductListingPage = () => {
  const { allProducts } = useContext(AppContext);

  const ITEMS_PER_LOAD = 8;
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_LOAD);
  const handleLoadMore = () => {
    setVisibleItems((prev) => prev + ITEMS_PER_LOAD);
  }

  const [categoryFilter, setCategoryFilter] = useState(null);
  const [sizeFilter, setSizeFilter] = useState(null);
  const [maxPrice, setMaxPrice] = useState(1200);

  const filterProducts = allProducts.filter(product => {
    const matchCategory = categoryFilter
      ? product.category?.toLowerCase() === categoryFilter.toLowerCase()
      : true;

    const matchSize = sizeFilter
      ? product.availableSizes.some(s => s.size === sizeFilter)
      : true;

    const matchPrice = maxPrice ? product.price <= maxPrice : true;

    return matchCategory && matchSize && matchPrice;
  })


  return (
    <main className="max-w-[1440px] mx-auto px-6 md:px-10 pb-20">
      {/* Breadcrumbs & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between py-8 gap-4">
        <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-gray-500 font-medium">
          <Link className="hover:text-primary transition-colors" to="/">Home</Link>
          <span className="text-[10px]">/</span>
          <Link className="hover:text-primary transition-colors" to="/products">Collections</Link>
          <span className="text-[10px]">/</span>
          <span className="text-[#181611] dark:text-[#f4f3f0]">Seasonal Collection</span>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-gray-500">Sort By</p>
          <select className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer pr-8 uppercase tracking-widest">
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Popularity</option>
          </select>
        </div>
      </div>

      {/* Page Heading */}
      <div className="mb-10">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-2">Seasonal Collection</h1>
        <p className="text-gray-500 font-medium tracking-wide">{allProducts.length} Curated Pieces</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-10">
          <div>
            <h3 className="uppercase tracking-[0.2em] text-[11px] font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-2">Category</h3>
            <div className="space-y-3">
              <button
                className="flex items-center justify-between w-full group cursor-pointer"
                onClick={() => {
                  setCategoryFilter(prev => prev === "MEN" ? null : "MEN");
                  setVisibleItems(ITEMS_PER_LOAD);
                }}
              >
                <span className={`text-sm ${categoryFilter === "MEN" ? "text-primary font-semibold" : "text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors"}`}>MEN</span>
                <span className="text-[10px] text-gray-400">{allProducts.filter(product => product.category === "men").length}</span>
              </button>
              <button
                className="flex items-center justify-between w-full group cursor-pointer"
                onClick={() => {
                  setCategoryFilter(prev => prev === "WOMEN" ? null : "WOMEN");
                  setVisibleItems(ITEMS_PER_LOAD);
                }}
              >
                <span className={`text-sm ${categoryFilter === "WOMEN" ? "text-primary font-semibold" : "text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors"}`}>WOMEN</span>
                <span className="text-[10px] text-primary">{allProducts.filter(product => product.category === "women").length}</span>
              </button>
              <button
                className="flex items-center justify-between w-full group cursor-pointer"
                onClick={() => {
                  setCategoryFilter(prev => prev === "ACCESSORIES" ? null : "ACCESSORIES");
                  setVisibleItems(ITEMS_PER_LOAD);
                }}
              >
                <span className={`text-sm ${categoryFilter === "ACCESSORIES" ? "text-primary font-semibold" : "text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors"}`}>ACCESSORIES</span>
                <span className="text-[10px] text-gray-400">{allProducts.filter(product => product.category === "accessories").length}</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="uppercase tracking-[0.2em] text-[11px] font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-2">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSizeFilter(prev => prev === size ? null : size);
                    setVisibleItems(ITEMS_PER_LOAD);
                  }}
                  className={`border border-gray-200 dark:border-white/10 py-2 text-[10px] ${sizeFilter === size ? "border-primary text-primary" : ""} font-bold hover:border-primary hover:text-primary transition-all rounded`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>


          <div>
            <h3 className="uppercase tracking-[0.2em] text-[11px] font-bold mb-6 border-b border-gray-200 dark:border-white/10 pb-2">Price Range</h3>
            <div className="px-2">
              <input
                className="w-full accent-primary bg-gray-200 h-1 rounded-lg appearance-none cursor-pointer"
                type="range"
                min="0"
                max="1200"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setVisibleItems(ITEMS_PER_LOAD);
                }}
              />
              <div className="flex justify-between mt-4 text-[11px] font-bold text-gray-500">
                <span>$0</span>
                <span>${maxPrice}+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {filterProducts && filterProducts.length > 0 ? filterProducts.slice(0, visibleItems).map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="product-card group flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-4 cursor-pointer">
                  <img alt={product.name} className="w-full h-full object-cover" src={product.images[0]} />
                  <button className="quick-add-btn absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-background-dark/95 text-black dark:text-white py-3 text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined !text-[16px]">add</span>
                    Quick Add
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  {product.category && (
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold">{product.category}</p>
                  )}
                  <h3 className="text-sm font-medium hover:text-primary cursor-pointer transition-colors uppercase tracking-wide">{product.name}</h3>
                  <p className="text-sm font-bold">${product.price}.00</p>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-20">
                <p className="text-lg font-semibold text-gray-500">
                  No products found
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Try changing or clearing your filters
                </p>
              </div>
            )}
          </div>

          {/* Load More */}
          <div className="mt-20 flex flex-col items-center gap-6">
            <p className="text-xs text-gray-400 font-medium">Showing {Math.min(visibleItems, filterProducts.length)} of {filterProducts.length} items</p>
            <div className="w-48 h-1 bg-gray-200 dark:bg-white/10 rounded-full relative">
              <div className="absolute inset-y-0 left-0 w-[6%] bg-primary rounded-full"
                style={{
                  width: `${(Math.min(visibleItems, filterProducts.length) / filterProducts.length) * 100}%`
                }}
              />
            </div>
            <button
              onClick={handleLoadMore}
              disabled={visibleItems >= filterProducts.length}
              className={`px-12 py-4 border border-[#e6e3db] dark:border-[#3d3621] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-primary hover:text-white hover:border-primary transition-all rounded-lg 
                ${visibleItems >= filterProducts.length ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700' : 'cursor-pointer hover:bg-primary hover:text-white hover:border-primary border-[#e6e3db] dark:border-[#3d3621]'}
            `}
            >
              Load More
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductListingPage;
