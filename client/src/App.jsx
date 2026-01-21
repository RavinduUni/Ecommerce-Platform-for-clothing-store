import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import InventoryManagementPage from './pages/InventoryManagementPage';
import AdminAuthPage from './pages/AdminAuthPage';
import UserDashboardPage from './pages/UserDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminContextProvider from './context/AdminContext';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  return (
    <Router>
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <AdminContextProvider>
          <div className="layout-container flex h-full grow flex-col bg-background-light dark:bg-background-dark text-[#181611] dark:text-[#f4f3f0]">
            <Routes>
              {/* Main Customer Routes */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </>
              } />
              <Route path="/products" element={
                <>
                  <Navbar />
                  <ProductListingPage />
                  <Footer />
                </>
              } />
              <Route path="/product/:id" element={
                <>
                  <Navbar />
                  <ProductDetailsPage />
                  <Footer />
                </>
              } />
              <Route path="/cart" element={
                <>
                  <ProtectedRoute allowedRoles={['user', 'admin']}>
                    <Navbar />
                    <ShoppingCartPage />
                    <Footer />
                  </ProtectedRoute>
                </>
              } />
              <Route path="/checkout" element={
                <>
                  <ProtectedRoute allowedRoles={['user', 'admin']}>
                    <Navbar />
                    <CheckoutPage />
                    <Footer />
                  </ProtectedRoute>
                </>
              } />
              <Route path="/dashboard" element={
                <>
                  <ProtectedRoute allowedRoles={['user', 'admin']}>
                    <Navbar />
                    <UserDashboardPage />
                    <Footer />
                  </ProtectedRoute>
                </>
              } />

              {/* Authentication Routes - No Navbar/Footer */}
              <Route path="/admin/login"
                element={
                  <AdminAuthPage />
                }
              />

              {/* Admin Routes - No Navbar/Footer */}
              <Route path="/admin/inventory" element={
                <AdminProtectedRoute allowedRoles={['admin']}>
                  <InventoryManagementPage />
                </AdminProtectedRoute>
              } />


            </Routes>
          </div>
        </AdminContextProvider>
      </div>
    </Router>
  );
}

export default App;