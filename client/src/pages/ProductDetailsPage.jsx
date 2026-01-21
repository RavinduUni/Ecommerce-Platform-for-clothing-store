import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const ProductDetailsPage = () => {

  const { id } = useParams();

  const { allProducts, fetchCart, backendUrl } = useContext(AppContext);

  const [selectedSize, setSelectedSize] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const product = allProducts.find(prod => prod._id.toString() === id);

  const completeTheLook = [
    {
      id: 1,
      name: "Luna Drop Earrings",
      description: "Elegant gold-plated drop earrings with pearl accents.",
      price: "$125.00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUA0yeXMnJpJXyVOx_hrZ3h9pWwew__X-4I8K9s9yfaiM104WJDHNh4ydEXhNpwqGU4WgPtK-n-rVnOgSkszuJeXnRhR7Ifm56744sIcs6LazsoR83Tj6qIWkclKs8kgoGB9rWjht0zHYugmsdp19_booY6gPX1mYN-LK6wq-WB7vPXumtyxVx2hrj-Jy64TMzRNa4GuTz3uVRCCj0kTuK1tlA3BMzYQDc3PAra8ox2-djazk1zqjjAkuDS_gpSbFxiLejEnqbts4h"
    },
    {
      id: 2,
      name: "Velvet Slingback Heels",
      description: "Luxurious velvet heels with a comfortable slingback design.",
      price: "$210.00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAaB7sp84T5F5cyGYiSvHUUqLK4eDUcTkNBh8sh2zjRbJaChiPuw7EGyMQ9krAmaCf-XADaW0mDGUBTgVEy5zwN1Vx3WWjjG60hbpyqIh5uQl3FHGS3rUPrf7ZSuQKev57w9jjr63SPvzsPqIfDs_t_AJT4faFIXrfeMC-m7snsPXryYLk3AKrnW1RnJczo9rXBwYiDNZZQgbVndbvskHCfi47ak1Ryn1dxNi9AZQzxtkIlWVzXjgQzAQD6TsCT1fNDsYz6SohSB9CE"
    },
    {
      id: 3,
      name: "Envelope Clutch",
      description: "Sophisticated envelope clutch with a sleek design and secure closure.",
      price: "$340.00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4AcnV0nhyXL8j3jdCr_9hH34Y_saiR9d8YL7qPvnGw-GqjdswN_NBbyHIzFRN6V0MkZ1idXrPS2Cdg3Of1_GvcatQJ21GdLkMr7ad0CvG0fKCklwpjjE_aiLs2EzUiiZwX-x79HiVwK0CO5vx157zv1s802a4jNzHgSmXrWZiEYd7nw0Cxrcg4MovhSfyEq6onKnE-D_iW5eVjiTCEQfvBdk-z0akV6G1FX5Ky-ZTdwlIGZj84BsaLGkZ1-gKbk2m8wcznIc3lzES"
    },
    {
      id: 4,
      name: "Evening Silk Shawl",
      description: "Delicate silk shawl with intricate embroidery for evening elegance.",
      price: "$145.00",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCq_pz1WWq0y4fwlrM5LZPBMCo5qnTer3Eq3yp4pHzLa1V05H2RkZ1FjLqSgyleNmWpRhxD426EbxGuPvwbyWDuLeW4Qmdxk1iOIkaf6aXIMzQg221EglHdXqPjOwk4Ogf8uM1RmZK9I1wZlj4m3n_r7r96mGy_cGnFkZhuY8hCRq2SnuLmji1lT0xWHZd6BMIPexCJhC-ICVkHRkobcHJ-QSbNsxvtDMvZB-YsaFD6Xavv2mLnD6Qy1fcWsrVqVxo5kJOGBHnNEgm7"
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const addToCart = async () => {
    try {

      if (!selectedSize) {
        alert("Please select a size before adding to cart.");
        return;
      }

      setIsAddingToCart(true);

      const { data } = await axios.post(`${backendUrl}/api/users/add-to-cart`, {
        productId: product._id,
        size: selectedSize,
        quantity: 1,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to add to cart");
      }

      alert("Product added to cart successfully!");
      fetchCart();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || error.message || "Error adding to cart");
    } finally {
      setIsAddingToCart(false);
    }
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 py-4 mb-4">
        <Link className="text-[#897f61] hover:text-primary text-xs font-medium uppercase tracking-wider" to="/">Home</Link>
        <span className="text-[#897f61] text-xs">/</span>
        {product && (
          <>
            <Link className="text-[#897f61] hover:text-primary text-xs font-medium uppercase tracking-wider" to="/products">{product.category}</Link>
            <span className="text-[#897f61] text-xs">/</span>
            <span className="text-[#181611] dark:text-white text-xs font-semibold uppercase tracking-wider">{product.name}</span>
          </>
        )}
      </div>

      {product && (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Image Gallery */}
          <div className="w-full lg:w-[60%] flex flex-col gap-4">
            {/* Main Image */}
            {product.images && product.images.length > 0 && (
              <div className="w-full aspect-[4/5] bg-center bg-cover rounded-lg" style={{ backgroundImage: `url(${product.images[0]})` }}></div>
            )}
          </div>

          {/* Right: Sticky Product Info */}
          <div className="w-full lg:w-[60%]">
            <div className="sticky top-8 flex flex-col">
              <div className="mb-8">
                <h1 className="text-[#181611] dark:text-white font-serif text-4xl lg:text-5xl leading-tight mb-2">{product.name}</h1>
                <p className="text-xl font-semibold text-primary">${product.price.toFixed(2)}</p>
              </div>

              <p className="mb-8 text-[#897f61]">{product.description}</p>

              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-bold uppercase tracking-widest text-[#897f61]">Select Size</p>
                  <button className="text-xs font-medium underline text-primary">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.availableSizes.map((size, index) => {
                    const isAvailable = size.qty > 0;
                    const isSelected = selectedSize === size.size;

                    return (
                      <button
                        key={index}
                        disabled={!isAvailable}
                        onClick={() => {
                          if (isAvailable) {
                            setSelectedSize(size.size);
                          }
                        }}

                        className={`px-6 py-2.5 rounded-full border text-sm font-medium transition-all ${isAvailable ? (isSelected ? 'bg-primary text-white border-primary' : 'border-[#e5e5e5] dark:border-[#3d3421] text-[#181611] dark:text-white hover:border-primary hover:text-primary cursor-pointer') : 'border-[#e5e5e5] dark:border-[#3d3421] text-sm font-medium opacity-40 cursor-not-allowed line-through'}`}
                      >
                        {size.size}
                      </button>
                    )
                  })}

                </div>
              </div>

              <div className="flex flex-col gap-4 mb-10">
                <button
                  onClick={addToCart}
                  disabled={isAddingToCart}
                  className={`w-full bg-primary hover:bg-[#b88e0e] text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2${isAddingToCart ? " opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
                </button>
                <Link to="/cart" className="w-full bg-white dark:bg-transparent border border-[#181611] dark:border-white text-[#181611] dark:text-white py-4 rounded-lg font-bold text-lg hover:bg-[#181611] hover:text-white dark:hover:bg-white dark:hover:text-background-dark transition-all text-center">
                  Checkout Now
                </Link>
              </div>

              {/* Collapsible Sections */}
              <div className="border-t border-[#e5e5e5] dark:border-[#3d3421]">
                <details className="group py-5 border-b border-[#e5e5e5] dark:border-[#3d3421]" open>
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-sm font-bold uppercase tracking-widest">Materials &amp; Care</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="mt-4 text-sm text-[#5a5a5a] dark:text-[#a0a0a0] leading-relaxed">
                    <ul className="list-disc pl-5 space-y-2">
                      <li>100% Grade-A Mulberry Silk</li>
                      <li>Hand-finished double-stitched seams</li>
                      <li>Sustainable organic dyes used</li>
                      <li>Dry clean only. Do not bleach. Cool iron on reverse.</li>
                    </ul>
                  </div>
                </details>

                <details className="group py-5 border-b border-[#e5e5e5] dark:border-[#3d3421]">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-sm font-bold uppercase tracking-widest">Shipping &amp; Returns</span>
                    <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                  </summary>
                  <div className="mt-4 text-sm text-[#5a5a5a] dark:text-[#a0a0a0] leading-relaxed">
                    <p>Free standard shipping on all orders over $300. Delivery typically takes 3-5 business days.</p>
                    <p className="mt-2">Easy 14-day returns with pre-paid labels. Items must be in original condition with tags attached.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete the Look Section */}
      <section className="mt-24 mb-16">
        <h2 className="text-2xl font-serif mb-8 text-center">Complete the Look</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {completeTheLook.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-center bg-cover rounded-lg overflow-hidden mb-4" style={{ backgroundImage: `url(${item.image})` }}>
                <button className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/80 py-2 rounded font-bold text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity">Quick Add</button>
              </div>
              <h3 className="font-medium text-sm group-hover:text-primary transition-colors">{item.name}</h3>
              <p className="text-sm font-bold mt-1">{item.price}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ProductDetailsPage;
