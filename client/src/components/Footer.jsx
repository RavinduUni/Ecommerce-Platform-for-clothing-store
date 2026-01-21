import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background-light dark:bg-background-dark pt-20 pb-10 px-10 border-t border-[#181611]/5 dark:border-white/5">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[#181611] dark:text-white">
            <div className="size-5 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44L18.0446 44L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-[0.1em] uppercase">Fashion Store</h2>
          </div>
          <p className="text-sm opacity-60 leading-relaxed font-light">
            Crafting timeless apparel for the conscious consumer. Designed in Stockholm, available worldwide.
          </p>
          <div className="flex gap-4">
            <a className="opacity-40 hover:opacity-100 hover:text-primary transition-all" href="#"><span className="material-symbols-outlined">public</span></a>
            <a className="opacity-40 hover:opacity-100 hover:text-primary transition-all" href="#"><span className="material-symbols-outlined">share</span></a>
            <a className="opacity-40 hover:opacity-100 hover:text-primary transition-all" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Shop</h4>
          <ul className="space-y-4 text-sm opacity-60">
            <li><Link className="hover:text-primary transition-colors" to="/products">Men's Collection</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/products">Women's Collection</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/products">Accessories</Link></li>
            <li><a className="hover:text-primary transition-colors" href="#">Gift Cards</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Support</h4>
          <ul className="space-y-4 text-sm opacity-60">
            <li><a className="hover:text-primary transition-colors" href="#">Contact Us</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Shipping &amp; Returns</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Sizing Guide</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest mb-8">Legal</h4>
          <ul className="space-y-4 text-sm opacity-60">
            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto border-t border-[#181611]/5 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] uppercase tracking-widest opacity-40">© 2024 Fashion Store. All Rights Reserved.</p>
        <div className="flex items-center gap-6 opacity-40">
          <span className="material-symbols-outlined text-2xl">payments</span>
          <span className="material-symbols-outlined text-2xl">credit_card</span>
          <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
