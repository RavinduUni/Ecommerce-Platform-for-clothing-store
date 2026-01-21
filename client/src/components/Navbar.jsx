import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import UserAuthModal from './UserAuthModal';
import { AppContext } from '../context/AppContext';

const Navbar = () => {

  const { cart, logout } = useContext(AppContext);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };



  return (
    <>
      <UserAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#181611]/5 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-10 py-4 lg:px-20">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 text-[#181611] dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-[0.1em] uppercase">Fashion Store</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            <Link className="text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors" to="/products">Shop</Link>
            <a className="text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors" href="#story">Our Story</a>
            <a className="text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors" href="#journal">Journal</a>
          </nav>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <div className="hidden lg:flex items-center bg-[#181611]/5 dark:bg-white/5 rounded-full px-4 py-1.5 border border-transparent focus-within:border-primary/50 transition-all">
            <span className="material-symbols-outlined text-sm opacity-60">search</span>
            <input className="bg-transparent border-none outline-none focus:ring-0 text-sm w-40 placeholder:text-[#181611]/40 dark:placeholder:text-white/40" placeholder="Search collection" type="text" />
          </div>
          <div className="flex items-center gap-4">
            <button className="hover:text-primary transition-colors">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <Link to="/cart" className="hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-primary text-[#181611] text-[10px] font-bold rounded-full size-4 flex items-center justify-center">{cart.length}</span>
            </Link>
            {isLoggedIn ? (
              <div className='relative'>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="material-symbols-outlined hover:text-primary transition-colors"
                >
                  person
                </button>
                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#221d10] border border-[#181611]/10 dark:border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="p-4 border-b border-[#181611]/10 dark:border-white/10">
                        <p className="text-sm font-semibold">My Account</p>
                        <p className="text-xs text-[#181611]/60 dark:text-white/60 mt-1">{localStorage.getItem('userEmail')}</p>
                      </div>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#181611]/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">dashboard</span>
                        My Dashboard
                      </Link>
                      <Link 
                        to="/dashboard" 
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#181611]/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">shopping_bag</span>
                        My Orders
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-[#181611]/5 dark:hover:bg-white/5 transition-colors text-red-600 dark:text-red-400"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hover:text-white cursor-pointer transition-colors bg-primary hover:bg-[#b8900f] text-[#181611] font-bold py-1.5 px-4 rounded-full text-sm uppercase tracking-widest"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
