import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const UserDashboardPage = () => {
  const { orders, fetchOrders, backendUrl } = useContext(AppContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'placed': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processing': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'shipped': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIndex = (status) => {
    const statuses = ['placed', 'processing', 'shipped', 'delivered'];
    return statuses.indexOf(status);
  };

  const OrderTimeline = ({ status, timeline }) => {
    const steps = [
      { key: 'placed', label: 'Order Placed', icon: 'shopping_bag' },
      { key: 'processing', label: 'Processing', icon: 'pending' },
      { key: 'shipped', label: 'Shipped', icon: 'local_shipping' },
      { key: 'delivered', label: 'Delivered', icon: 'done' }
    ];

    const currentIndex = getStatusIndex(status);

    return (
      <div className="relative">
        <div className="flex justify-between items-start">
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const timelineItem = timeline?.find(t => t.status === step.key);

            return (
              <div key={step.key} className="flex flex-col items-center flex-1 relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`absolute top-6 left-1/2 w-full h-0.5 ${isCompleted ? 'bg-primary' : 'bg-[#181611]/10 dark:bg-white/10'}`}></div>
                )}
                
                {/* Icon Circle */}
                <div className={`relative z-10 size-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                  isCompleted 
                    ? 'bg-primary text-[#181611]' 
                    : 'bg-[#181611]/5 dark:bg-white/5 text-[#181611]/40 dark:text-white/40'
                } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}>
                  <span className="material-symbols-outlined text-xl">{step.icon}</span>
                </div>

                {/* Label and Timestamp */}
                <div className="text-center">
                  <p className={`text-sm font-semibold uppercase tracking-wider mb-1 ${isCompleted ? 'text-[#181611] dark:text-white' : 'text-[#181611]/40 dark:text-white/40'}`}>
                    {step.label}
                  </p>
                  {timelineItem && (
                    <p className="text-xs text-[#181611]/60 dark:text-white/60">
                      {new Date(timelineItem.timestamp).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const OrderDetails = ({ order }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
        <div className="bg-background-light dark:bg-background-dark rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="sticky top-0 bg-background-light dark:bg-background-dark border-b border-[#181611]/10 dark:border-white/10 px-8 py-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-wide">Order Details</h2>
              <p className="text-sm text-[#181611]/60 dark:text-white/60 mt-1">Order #{order.orderNumber}</p>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="size-10 rounded-full hover:bg-[#181611]/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Order Timeline */}
            <div className="bg-[#181611]/5 dark:bg-white/5 rounded-lg p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Order Status</h3>
              <OrderTimeline status={order.status} timeline={order.timeline} />
            </div>

            {/* Products */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-[#181611]/5 dark:bg-white/5 rounded-lg">
                    <img src={item.image} alt={item.name} className="size-20 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <div className="flex gap-4 text-sm text-[#181611]/60 dark:text-white/60 mt-1">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two Column Layout for Shipping and Payment */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-[#181611]/5 dark:bg-white/5 rounded-lg p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  Shipping Address
                </h3>
                <div className="text-sm space-y-1">
                  <p className="font-semibold">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="pt-2 text-[#181611]/60 dark:text-white/60">{order.shippingAddress.phone}</p>
                  <p className="text-[#181611]/60 dark:text-white/60">{order.shippingAddress.email}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#181611]/5 dark:bg-white/5 rounded-lg p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payment</span>
                  Payment Method
                </h3>
                <div className="text-sm">
                  {order.paymentMethod === 'card' ? (
                    <div className="space-y-2">
                      <p className="font-semibold capitalize">{order.paymentDetails?.cardType || 'Credit'} Card</p>
                      <p className="text-[#181611]/60 dark:text-white/60">
                        •••• •••• •••• {order.paymentDetails?.cardLastFour || '****'}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-[#181611]/60 dark:text-white/60 mt-1">Pay when you receive</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-[#181611]/5 dark:bg-white/5 rounded-lg p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#181611]/60 dark:text-white/60">Subtotal</span>
                  <span className="font-medium">${order.pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#181611]/60 dark:text-white/60">Tax</span>
                  <span className="font-medium">${order.pricing.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#181611]/60 dark:text-white/60">Shipping</span>
                  <span className="font-medium">
                    {order.pricing.shipping === 0 ? 'FREE' : `$${order.pricing.shipping.toFixed(2)}`}
                  </span>
                </div>
                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${order.pricing.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-[#181611]/10 dark:border-white/10 pt-3 flex justify-between">
                  <span className="font-bold uppercase tracking-wider">Total</span>
                  <span className="font-bold text-xl text-primary">${order.pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Date */}
            <div className="text-center text-sm text-[#181611]/60 dark:text-white/60">
              Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 bg-background-light dark:bg-background-dark">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">My Dashboard</h1>
          <p className="text-[#181611]/60 dark:text-white/60">Manage your orders and account</p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-6 border-b border-[#181611]/10 dark:border-white/10 mb-8">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest relative transition-colors ${
              activeTab === 'orders' 
                ? 'text-primary' 
                : 'text-[#181611]/60 dark:text-white/60 hover:text-[#181611] dark:hover:text-white'
            }`}
          >
            Orders
            {activeTab === 'orders' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest relative transition-colors ${
              activeTab === 'profile' 
                ? 'text-primary' 
                : 'text-[#181611]/60 dark:text-white/60 hover:text-[#181611] dark:hover:text-white'
            }`}
          >
            Profile
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            )}
          </button>
        </div>

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div>
            {!orders || orders.length === 0 ? (
              <div className="text-center py-20">
                <div className="size-24 mx-auto mb-6 rounded-full bg-[#181611]/5 dark:bg-white/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-[#181611]/20 dark:text-white/20">shopping_bag</span>
                </div>
                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                <p className="text-[#181611]/60 dark:text-white/60 mb-6">Start shopping to see your orders here</p>
                <Link to="/products" className="inline-block bg-primary text-[#181611] px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#b8900f] transition-colors">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div 
                    key={order._id}
                    className="bg-white dark:bg-[#221d10] border border-[#181611]/10 dark:border-white/10 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-bold text-lg">Order #{order.orderNumber}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-[#181611]/60 dark:text-white/60">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">calendar_today</span>
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">inventory_2</span>
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">payment</span>
                            {order.paymentMethod === 'card' ? 'Card' : 'COD'}
                          </span>
                        </div>
                      </div>

                      {/* Product Thumbnails */}
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <img 
                              key={index}
                              src={item.image} 
                              alt={item.name}
                              className="size-12 rounded border-2 border-white dark:border-[#221d10] object-cover"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="size-12 rounded border-2 border-white dark:border-[#221d10] bg-[#181611]/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">${order.pricing.total.toFixed(2)}</p>
                          <p className="text-xs text-[#181611]/60 dark:text-white/60 uppercase tracking-wider">Total</p>
                        </div>
                        <span className="material-symbols-outlined text-[#181611]/40 dark:text-white/40">chevron_right</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="bg-white dark:bg-[#221d10] border border-[#181611]/10 dark:border-white/10 rounded-lg p-8">
              <h2 className="text-xl font-bold uppercase tracking-wide mb-6">Account Information</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-[#181611]/60 dark:text-white/60 uppercase tracking-wider text-xs mb-2">Email</label>
                  <p className="font-medium">{localStorage.getItem('userEmail') || 'user@example.com'}</p>
                </div>
                <div>
                  <label className="block text-[#181611]/60 dark:text-white/60 uppercase tracking-wider text-xs mb-2">Member Since</label>
                  <p className="font-medium">January 2026</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && <OrderDetails order={selectedOrder} />}
    </main>
  );
};

export default UserDashboardPage;
