import { Link } from 'react-router-dom';
import { useState } from 'react';

const CheckoutPage = () => {
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

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
                    <input className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10  dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="e.g. James" type="text"/>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">Last Name</label>
                    <input className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10  dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="e.g. Smith" type="text"/>
                  </div>
                  <div className="flex flex-col space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">Address</label>
                    <input className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10  dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="Street Address" type="text"/>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">City</label>
                    <input className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10  dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="City" type="text"/>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-semibold text-[#181611] dark:text-[#f8f8f6]">Postal Code</label>
                    <input className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10  dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 transition-all" placeholder="ZIP" type="text"/>
                  </div>
                </div>
                <button className="mt-6 w-full md:w-auto px-10 py-3 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition-all">Continue to Delivery</button>
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
                  <div onClick={() => setPaymentMethod('paypal')} className={`flex-1 p-3 border ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-[#e6e3db] dark:border-white/10 hover:border-primary transition-colors'} rounded-lg flex flex-col items-center gap-1 cursor-pointer`}>
                    <span className="material-symbols-outlined">payments</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">PayPal</span>
                  </div>
                  <div onClick={() => setPaymentMethod('apple')} className={`flex-1 p-3 border ${paymentMethod === 'apple' ? 'border-primary bg-primary/5' : 'border-[#e6e3db] dark:border-white/10 hover:border-primary transition-colors'} rounded-lg flex flex-col items-center gap-1 cursor-pointer`}>
                    <span className="material-symbols-outlined">token</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Apple Pay</span>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-semibold">Cardholder Name</label>
                      <input className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:text-white h-12 px-4 focus:ring-primary focus:border-primary" type="text"/>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-semibold">Card Number</label>
                      <div className="relative">
                        <input className="w-full rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:text-white h-12 px-4 focus:ring-primary focus:border-primary" placeholder="xxxx xxxx xxxx xxxx" type="text"/>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-60">
                          <span className="material-symbols-outlined text-lg">credit_card</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-semibold">Expiry Date</label>
                        <input className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:text-white h-12 px-4 focus:ring-primary focus:border-primary" placeholder="MM / YY" type="text"/>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-semibold">CVV</label>
                        <input className="rounded-lg bg-slate-50 border-[#e6e3db] dark:border-white/10 dark:text-white h-12 px-4 focus:ring-primary focus:border-primary" placeholder="***" type="password"/>
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
              <span className="text-sm font-medium text-primary">2 Items</span>
            </h3>

            {/* Item List */}
            <div className="space-y-6 mb-8">
              <div className="flex gap-4">
                <div className="h-24 w-20 flex-shrink-0 bg-gray-100 dark:bg-white/10 rounded-lg overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhMg08XZMzFPJp4DRFZVTeI-cJyF3w376Hj-zEYn2WBiz_8vpdoFAs_-Jp1c-sWKASnOqHbAXmYpQ58MgQHX1A3QFf0lYJSROZJORp1XiQSCMDaRmMUsXCpXxMyH4ChSok8rrjl5UMx8SWQD1pyO4AO5HCxS4fExpJLvlRtiBklxqntejnqmmZCV9fGEl-lQbUVOGwXaLxz48tXUXLy_d_DRif0u6EqLHPhUaoidIt-g5mvsrxyvCb9BBPYJmwBhIdEMHqQqCjAtEP" alt="Product"/>
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <p className="font-bold text-sm">Merino Wool Overcoat</p>
                    <p className="text-xs text-[#897f61] mt-1">Size: L | Color: Sand</p>
                  </div>
                  <p className="font-bold">$495.00</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-24 w-20 flex-shrink-0 bg-gray-100 dark:bg-white/10 rounded-lg overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXHbENMfZDymzS0Byx6bGBX9nqknPS93inxbb_gcqFczKanMzBsW1G6qIgY0Q2Gv4ki1G4crohHY4j9ZV0757VNSgWF6HgyOij9Nb91l4Gjod3cz6tYNQUAdr5vnhsTSADXlmpN8sq85VqqhYV_Pwx2vm_jrGhjEU6RF5FloqjObGw32JZiqJRqmnDo8qQIc-WB9u5zJiTufSsa0PkWSwyX6nMW4obTfs8HnCvmGIlQ_jhU2Wfs-uLVfoG3zya-oUOBi0qO1p0ayHf" alt="Product"/>
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <p className="font-bold text-sm">Signature Leather Tote</p>
                    <p className="text-xs text-[#897f61] mt-1">Size: OS | Color: Onyx</p>
                  </div>
                  <p className="font-bold">$320.00</p>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="flex gap-2 mb-8">
              <input className="flex-1 rounded-lg border-[#e6e3db] dark:border-white/10 bg-transparent h-11 px-4 text-sm focus:ring-primary focus:border-primary" placeholder="Promo code" type="text"/>
              <button className="px-4 py-2 border border-[#181611] dark:border-[#f8f8f6] text-sm font-bold rounded-lg hover:bg-[#181611] hover:text-white dark:hover:bg-[#f8f8f6] dark:hover:text-[#181611] transition-all">Apply</button>
            </div>

            {/* Calculations */}
            <div className="space-y-3 border-t border-[#e6e3db] dark:border-white/10 pt-6">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#897f61]">Subtotal</span>
                <span>$815.00</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#897f61]">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="text-[#897f61]">Estimated Tax</span>
                <span>$65.20</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-[#e6e3db] dark:border-white/10">
                <span>Total</span>
                <span className="text-primary">$880.20</span>
              </div>
            </div>

            <button className="w-full mt-8 bg-[#181611] dark:bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-lg">lock</span>
              Complete Order
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
