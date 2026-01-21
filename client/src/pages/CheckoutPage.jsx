import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, allProducts, createOrder, backendUrl } = useContext(AppContext);
  
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    email: '',
    phone: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    if (cart.length > 0 && allProducts.length > 0) {
      const products = cart.map(item => {
        const product = allProducts.find(p => p._id === item.productId);
        return {
          ...item,
          product
        };
      });
      setCartProducts(products);
    }
  }, [cart, allProducts]);

  const subtotal = cartProducts.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  const shipping = deliveryMethod === 'express' ? 15 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCompleteOrder = async () => {
    if (!formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.zipCode) {
      alert('Please fill in all shipping address fields');
      return;
    }

    if (paymentMethod === 'card' && (!formData.cardNumber || !formData.expiry || !formData.cvv)) {
      alert('Please fill in all payment details');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cartProducts.map(item => ({
          productId: item.productId,
          name: item.product.name,
          image: item.product.images[0],
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.product.colors?.[0] || ''
        })),
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData?.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: paymentMethod === 'card' ? 'card' : 'cod',
        paymentDetails: paymentMethod === 'card' ? {
          cardLastFour: formData.cardNumber.slice(-4),
          cardType: 'visa'
        } : {},
      };

      await createOrder(orderData);
      alert('Order placed successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 lg:px-10 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/products" className="text-primary hover:underline">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow max-w-[1280px] mx-auto w-full px-6 lg:px-10 py-8">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap gap-2 py-4 mb-4">
        <Link className="text-[#897f61] dark:text-[#b0a88e] text-sm font-medium" to="/">Home</Link>
        <span className="text-[#897f61] dark:text-[#b0a88e] text-sm font-medium">/</span>
        <Link className="text-[#897f61] dark:text-[#b0a88e] text-sm font-medium" to="/cart">Cart</Link>
        <span className="text-[#897f61] dark:text-[#b0a88e] text-sm font-medium">/</span>
        <span className="text-[#181611] dark:text-[#f8f8f6] text-sm font-medium">Checkout</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Checkout Form */}
        <div className="flex-1 max-w-[760px]">
          <h1 className="text-[#181611] dark:text-[#f8f8f6] text-3xl font-bold leading-tight tracking-[-0.015em] mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">lock</span> Secure Checkout
          </h1>

          <div className="flex flex-col space-y-2">
            {/* Step 1: Shipping */}
            <details className="group bg-white dark:bg-white/5 rounded-xl border border-[#e6e3db] dark:border-white/10 overflow-hidden" open>
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 list-none">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</span>
                  <p className="text-[#181611] dark:text-[#f8f8f6] text-lg font-bold">Shipping Address</p>
                </div>
                <span className="material-symbols-outlined text-[#897f61] group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-6 pb-8 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="e.g. James" type="text"/>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="e.g. Smith" type="text"/>
                  </div>
                  <div className="flex flex-col space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">Email</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="your@email.com" type="email"/>
                  </div>
                  <div className="flex flex-col space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="(123) 456-7890" type="tel"/>
                  </div>
                  <div className="flex flex-col space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">Address</label>
                    <input name="address" value={formData.address} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="Street Address" type="text"/>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">City</label>
                    <input name="city" value={formData.city} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="City" type="text"/>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">State</label>
                    <input name="state" value={formData.state} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="State" type="text"/>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">Postal Code</label>
                    <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="ZIP" type="text"/>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">Country</label>
                    <input name="country" value={formData.country} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="Country" type="text"/>
                  </div>
                </div>
              </div>
            </details>

            {/* Step 2: Delivery Method */}
            <details className="group bg-white dark:bg-white/5 rounded-xl border border-[#e6e3db] dark:border-white/10 overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 list-none">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center text-sm font-bold">2</span>
                  <p className="text-[#181611] dark:text-[#f8f8f6] text-lg font-bold">Delivery Method</p>
                </div>
                <span className="material-symbols-outlined text-[#897f61] group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-6 pb-8 pt-2 space-y-4">
                <label className={`flex items-center justify-between p-4 border ${deliveryMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-[#e6e3db] dark:border-white/10'} rounded-lg cursor-pointer`}>
                  <div className="flex items-center gap-3">
                    <input checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="text-primary focus:ring-primary" name="delivery" type="radio"/>
                    <div>
                      <p className="font-bold">Standard Delivery</p>
                      <p className="text-xs text-[#897f61]">3-5 Business Days</p>
                    </div>
                  </div>
                  <span className="font-bold">Free</span>
                </label>
                <label className={`flex items-center justify-between p-4 border ${deliveryMethod === 'express' ? 'border-primary bg-primary/5' : 'border-[#e6e3db] dark:border-white/10'} rounded-lg cursor-pointer hover:border-primary/50 transition-colors`}>
                  <div className="flex items-center gap-3">
                    <input checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} className="text-primary focus:ring-primary" name="delivery" type="radio"/>
                    <div>
                      <p className="font-bold">Express Delivery</p>
                      <p className="text-xs text-[#897f61]">1-2 Business Days</p>
                    </div>
                  </div>
                  <span className="font-bold">$15.00</span>
                </label>
              </div>
            </details>

            {/* Step 3: Payment */}
            <details className="group bg-white dark:bg-white/5 rounded-xl border border-[#e6e3db] dark:border-white/10 overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 list-none">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full border border-primary text-primary flex items-center justify-center text-sm font-bold">3</span>
                  <p className="text-[#181611] dark:text-[#f8f8f6] text-lg font-bold">Payment Information</p>
                </div>
                <span className="material-symbols-outlined text-[#897f61] group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-6 pb-8 pt-2 space-y-6">
                <div className="flex gap-2">
                  <div onClick={() => setPaymentMethod('card')} className={`flex-1 p-3 border ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-[#e6e3db] dark:border-white/10 hover:border-primary transition-colors'} rounded-lg flex flex-col items-center gap-1 cursor-pointer`}>
                    <span className="material-symbols-outlined">credit_card</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Card</span>
                  </div>
                  <div onClick={() => setPaymentMethod('cod')} className={`flex-1 p-3 border ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-[#e6e3db] dark:border-white/10 hover:border-primary transition-colors'} rounded-lg flex flex-col items-center gap-1 cursor-pointer`}>
                    <span className="material-symbols-outlined">payments</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Cash on Delivery</span>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-semibold">Cardholder Name</label>
                      <input name="cardName" value={formData.cardName} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white h-12 px-4 focus:ring-primary focus:border-primary" type="text"/>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-semibold">Card Number</label>
                      <div className="relative">
                        <input name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="w-full rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white h-12 px-4 focus:ring-primary focus:border-primary" placeholder="xxxx xxxx xxxx xxxx" type="text"/>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-60">
                          <span className="material-symbols-outlined text-lg">credit_card</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-semibold">Expiry Date</label>
                        <input name="expiry" value={formData.expiry} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white h-12 px-4 focus:ring-primary focus:border-primary" placeholder="MM / YY" type="text"/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-semibold">CVV</label>
                        <input name="cvv" value={formData.cvv} onChange={handleInputChange} className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:bg-white/5 dark:text-white h-12 px-4 focus:ring-primary focus:border-primary" placeholder="***" type="password"/>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <aside className="w-full lg:w-[400px]">
          <div className="bg-white dark:bg-white/5 border border-[#e6e3db] dark:border-white/10 rounded-xl p-6 sticky top-28">
            <h3 className="text-xl font-bold mb-6 flex items-center justify-between">
              Order Summary
              <span className="text-sm font-medium text-primary">{cartProducts.length} Items</span>
            </h3>

            {/* Item List */}
            <div className="space-y-6 mb-8 max-h-64 overflow-y-auto scrollbar-hide">
              {cartProducts.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="h-24 w-20 flex-shrink-0 bg-gray-100 dark:bg-white/10 rounded-lg overflow-hidden">
                    <img className="w-full h-full object-cover" src={item.product?.images[0]} alt={item.product?.name}/>
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <p className="font-bold text-sm">{item.product?.name}</p>
                      <p className="text-xs text-[#897f61] mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">${((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 border-t border-[#e6e3db] dark:border-white/10 pt-6">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#897f61]">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#897f61]">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#897f61]">Estimated Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-[#e6e3db] dark:border-white/10">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCompleteOrder}
              disabled={isProcessing}
              className="w-full mt-8 bg-[#181611] dark:bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-lg">lock</span>
              {isProcessing ? 'Processing...' : 'Complete Order'}
            </button>

            <div className="mt-6 flex justify-center items-center gap-4 opacity-40">
              <span className="material-symbols-outlined" style={{fontSize: '32px'}}>verified_user</span>
              <span className="material-symbols-outlined" style={{fontSize: '32px'}}>credit_score</span>
              <span className="material-symbols-outlined" style={{fontSize: '32px'}}>security</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default CheckoutPage;
