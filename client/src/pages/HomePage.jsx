import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useContext } from 'react';

const HomePage = () => {

  const {allProducts} = useContext(AppContext);

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="w-full">
        <div className="flex min-h-[85vh] flex-col bg-cover bg-center bg-no-repeat items-center justify-center px-4 pb-20 text-center relative" style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVs4sDV3pSQ52wy1gRtOT2lJeptSWUsAGczMFqhFs0H4c2_11xJoew1oCCb8rvmrFBYJdv39ZfVYkIwVWNIlJyiZWaGI6zz2B-cDZqPF7XYGSj9jX94TqZU28KuoGImHVXqEg5bsQruNPYCp_YWeSZThhN18UAyYgV2vGRp1rhBdfHhZA8OYO-GaJ5pxMdBd7fKGv288VtscGZr4VNi8QP26IoxgWzgx5-PhfH6yglwGtCG5_55TErO94qElHIPgDFcbd28rV99TgY")`}}>
          <div className="max-w-4xl space-y-6">
            <p className="text-primary font-medium tracking-[0.4em] uppercase text-sm">New Arrival 2024</p>
            <h1 className="text-white text-6xl md:text-8xl font-black leading-tight tracking-tight uppercase">
              The Autumn <br/> Collection
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
              Sustainable craftsmanship meets contemporary minimalism. Explore our latest timeless pieces.
            </p>
            <div className="pt-8">
              <Link to="/products" className="bg-primary text-[#181611] px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white transition-all rounded inline-block">
                Shop Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Header */}
      <section className="max-w-[1440px] mx-auto px-10 pt-20">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight uppercase mb-4">Featured Categories</h2>
          <div className="w-20 h-1 bg-primary"></div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/products" className="group relative overflow-hidden aspect-[3/4] bg-[#181611]/10 rounded-lg cursor-pointer">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC2H9zcQQsbNPaWkfN7UB5erJb45lX0IswZrZaelHcFZIoPFn76Wsh-7ZKgDrt-Z1GvDrvcicbLb8cIj_nm-ZOEVeB-klkcWs5UAbSpD3B_MG_yuAFaGKuvwZzXoPCQ5XzcpnO7CTsDFImH8YoF8vPV-h7PrWE6D02ll630zy8OByEdebsggxAGJRnheq9awsukjL-3csb9VgIQaf8M2d3MvPo3DqqrnehhRPuvSd7wJ6PpcGmhVIRzF4-RDBOWe-Dc5XS6_3Q302JH")`}}></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-10">
              <h3 className="text-white text-2xl font-bold uppercase tracking-wider mb-2">The Modern Man</h3>
              <p className="text-white/70 text-sm uppercase tracking-widest">Explore Suits &amp; Basics</p>
            </div>
          </Link>

          <Link to="/products" className="group relative overflow-hidden aspect-[3/4] bg-[#181611]/10 rounded-lg cursor-pointer">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBRxGQVb5QDy6cxY37oxKZxsRgEXeqOkCxJjCTH5eZCYOdS6E4PRQuW6k2NKMeNHR212TivtiN2aNig3o92Sv33mg7sHLHscAsmH1dZCMPh5Xca4SR6W72OIoXa6oIBBoqIV_fIOtVSxt2iFqGZKD9dryRg3Jg_oXSdjhp1FeuWj9L4uSihJoZCb9zh6oPdnswAU77p0PjjDA0t_WrMd25raGtXvNMgM-ptafSo8c30erbjM1ZtfBkhg8QTINU_iwy7yPoc4RF_Edwb")`}}></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-10">
              <h3 className="text-white text-2xl font-bold uppercase tracking-wider mb-2">The Minimalist Woman</h3>
              <p className="text-white/70 text-sm uppercase tracking-widest">Shop Essential Knits</p>
            </div>
          </Link>

          <Link to="/products" className="group relative overflow-hidden aspect-[3/4] bg-[#181611]/10 rounded-lg cursor-pointer">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDttHQWWSc11ajuhOudu7LAsC4rEe40_ruvjwc-J1zxE8BU73qfdZ5RC0IELBBxganDf4EqlS_P_1nkgeEb-QbDsrLptvZSsojrFXRylxEPx4DVCGUqlvOCjgHg_lv6qTiEyVHmDvq_lQWF6sZgXpBtzBPmsJlMel9-k5wWX1hxWEUDaU0DhxRnb1GK-OmsecBtsM6aIC1kFaHcvKoUEsf3BtIJIa3uQxYlY9857DxJxD0ji605qp8N_Dsspm8-aiC6SNPBSnGiFk4r")`}}></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-10">
              <h3 className="text-white text-2xl font-bold uppercase tracking-wider mb-2">Essential Objects</h3>
              <p className="text-white/70 text-sm uppercase tracking-widest">Premium Accessories</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Best Sellers Carousel Header */}
      <section className="max-w-[1440px] mx-auto px-10 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-primary font-semibold tracking-widest text-xs uppercase mb-2">Our Curation</p>
            <h2 className="text-3xl font-bold tracking-tight uppercase">Best Sellers</h2>
          </div>
          <div className="flex gap-4">
            <button className="size-10 rounded-full border border-[#181611]/10 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-[#181611] transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button className="size-10 rounded-full border border-[#181611]/10 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:text-[#181611] transition-all">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Product Grid/Carousel Mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {allProducts.slice(0, 4).map(product => (
            <Link key={product._id} to={`/product/${product._id}`} className="product-card group cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden bg-background-light dark:bg-background-dark border border-[#181611]/5 dark:border-white/5 rounded-lg mb-4">
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url(${product.images[0]})`}}></div>
                <div className="alternate-view opacity-0 absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url(${product.images[1]})`}}></div>
                <div className="absolute bottom-4 left-4 right-4 translate-y-15 group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-white/90 backdrop-blur py-3 text-xs font-bold uppercase tracking-widest text-[#181611] hover:bg-primary transition-colors rounded">Quick Add +</button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest opacity-60">{product.category}</p>
                <h4 className="text-sm font-semibold uppercase tracking-wide">{product.name}</h4>
                <p className="text-sm text-primary font-bold">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* Newsletter Section */}
      <section className="bg-[#181611] dark:bg-[#12110c] text-white py-24 px-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <span className="material-symbols-outlined text-4xl text-primary">mail</span>
          <h2 className="text-3xl font-bold uppercase tracking-widest">Join the Club</h2>
          <p className="text-white/60 font-light tracking-wide">
            Stay updated with our latest collections, exclusive launches, and sustainable fashion insights. No spam, just pure style.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 mt-8">
            <input className="flex-1 bg-white/10 border-white/20 rounded py-4 px-6 focus:ring-primary focus:border-primary text-white placeholder:text-white/40" placeholder="Email Address" type="email"/>
            <button className="bg-primary text-[#181611] font-bold uppercase tracking-widest px-10 py-4 hover:bg-white transition-all rounded">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
