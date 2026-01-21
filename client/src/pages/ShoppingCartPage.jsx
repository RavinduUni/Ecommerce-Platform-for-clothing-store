import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const ShoppingCartPage = () => {

  const {cart,removeFromCart,updateCartQuantity, allProducts} = useContext(AppContext);

  const cartItems = cart.map(cartItem => {
    const product = allProducts.find(p => p._id === cartItem.productId);
    return {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: product.color,
      size: cartItem.size,
      quantity: cartItem.quantity
    };
  });
  

  const updateQuantity = (id, newQuantity, size) => {
    updateCartQuantity(id, size, newQuantity);
  };


  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;


  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight mb-2">Shopping Bag</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-widest font-medium">{cart.length} items in your cart</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product List Column */}
        <div className="flex-1">
          <div className="border-t border-[#e6e3db] dark:border-white/10">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 py-8 border-b border-[#e6e3db] dark:border-white/10 group">
                <Link to={`/product/${item.id}`} className="w-32 h-44 md:w-40 md:h-52 shrink-0 bg-gray-100 rounded-lg overflow-hidden bg-cover bg-center" style={{backgroundImage: `url(${item.image})`}}></Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link to={`/product/${item.id}`} className="text-lg font-bold group-hover:text-primary transition-colors">{item.name}</Link>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Color: {item.color} | Size: {item.size}</p>
                      <div className="mt-4 flex items-center gap-4">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#e6e3db] dark:border-white/20 rounded-lg h-9">
                          <button 
                           onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)} 
                           className={`px-3 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${item.quantity <= 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                           disabled={item.quantity <= 1}
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="px-4 text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)} className="px-3 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.size)} className="text-xs uppercase tracking-wider font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer">
                          <span className="material-symbols-outlined text-lg">delete</span>
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold tracking-tight">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-gray-400 mt-1 uppercase">Unit Price: ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Notice */}
          <div className="mt-8 p-4 bg-primary/5 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <p className="text-sm font-medium">Congratulations! You've unlocked <span className="font-bold">Free Shipping</span> on this order.</p>
          </div>
        </div>

        {/* Summary Sidebar */}
        <aside className="w-full lg:w-[400px]">
          <div className="bg-white dark:bg-white/5 border border-[#e6e3db] dark:border-white/10 p-8 rounded-xl sticky top-28 shadow-sm">
            <h2 className="text-xl font-bold mb-6 tracking-tight">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Estimated Shipping</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Estimated Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-4 border-t border-[#e6e3db] dark:border-white/10">
                {/* Promo Code Field */}
                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input className="flex-1 rounded-lg border-[#e6e3db] dark:bg-transparent dark:border-white/20 text-sm focus:border-primary focus:ring-1 focus:ring-primary h-10" placeholder="Enter code" type="text"/>
                    <button className="bg-[#f4f3f0] dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider">Apply</button>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-8">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-black tracking-tight">${total.toFixed(2)}</span>
                </div>

                <Link to="/checkout" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg uppercase tracking-widest text-sm shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 mb-4">
                  Proceed to Checkout
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>

                {/* Trust Badges */}
                <div className="flex flex-col items-center gap-4 mt-6">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Secure Payment</p>
                  <div className="flex gap-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                    <span className="material-symbols-outlined" title="Visa">credit_card</span>
                    <span className="material-symbols-outlined" title="Secure">verified_user</span>
                    <span className="material-symbols-outlined" title="Global">public</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Shop Link */}
          <div className="mt-6 text-center">
            <Link className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors" to="/products">
              <span className="material-symbols-outlined text-lg">keyboard_backspace</span>
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>

      {/* Recommended Items (Subtle Upsell) */}
      <section className="mt-24">
        <h2 className="text-2xl font-black mb-8 tracking-tight">Complete your look</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {allProducts.slice(0, 4).map((item) => (
            <Link to={`/product/${item._id}`} key={item._id} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden bg-cover bg-center mb-3" style={{backgroundImage: `url(${item.images[0]})`}}></div>
              <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{item.name}</h4>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ShoppingCartPage;
