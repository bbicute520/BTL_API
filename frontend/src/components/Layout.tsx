import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-outline bg-surface flex flex-col py-10 px-6 z-50">
        <div className="mb-10 px-2">
          <h1 className="text-[20px] font-bold tracking-[-0.5px] text-on-surface font-headline flex items-center gap-2">
            <div className="w-6 h-6 bg-on-surface rounded-md"></div>
            PriceTracker
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">Phân tích Doanh nghiệp</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 font-headline text-sm transition-all duration-200 ${
                isActive
                  ? 'text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium active:scale-95'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-on-surface' : 'bg-transparent'}`}></div>
                <span className="material-symbols-outlined">dashboard</span>
                <span>Tổng quan</span>
              </>
            )}
          </NavLink>
          
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 font-headline text-sm transition-all duration-200 ${
                isActive
                  ? 'text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium active:scale-95'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-on-surface' : 'bg-transparent'}`}></div>
                <span className="material-symbols-outlined">inventory_2</span>
                <span>Danh mục sản phẩm</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 font-headline text-sm transition-all duration-200 ${
                isActive
                  ? 'text-on-surface font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface font-medium active:scale-95'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-on-surface' : 'bg-transparent'}`}></div>
                <span className="material-symbols-outlined">settings</span>
                <span>Cài đặt hệ thống</span>
              </>
            )}
          </NavLink>
        </nav>

        <div className="mt-auto px-4 py-6">
          <NavLink
            to="/track-new"
            className="w-full bg-primary text-on-primary py-3 px-4 rounded-xl font-headline font-bold text-sm inner-glow flex items-center justify-center gap-2 hover:bg-primary-dim transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Theo dõi sản phẩm mới
          </NavLink>
          
          <div className="mt-8 space-y-4">
            <button className="flex items-center gap-3 text-[#586064] text-xs font-medium hover:text-primary transition-colors w-full">
              <span className="material-symbols-outlined text-lg">help_outline</span>
              Hỗ trợ
            </button>
            <button className="flex items-center gap-3 text-[#586064] text-xs font-medium hover:text-primary transition-colors w-full">
              <span className="material-symbols-outlined text-lg">logout</span>
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 bg-surface border-b border-outline flex justify-between items-center px-12 h-20 w-full">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl group-focus-within:text-primary transition-colors">search</span>
              <input 
                type="text" 
                placeholder="Tìm kiếm sản phẩm..." 
                className="bg-surface border border-outline rounded-full pl-10 pr-6 py-2 text-sm w-80 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>
            <nav className="hidden lg:flex gap-8">
              <a href="#" className="text-primary border-b-2 border-primary pb-2 font-headline text-base font-semibold">Tổng quan thị trường</a>
              <a href="#" className="text-on-surface-variant hover:text-primary transition-all font-headline text-base">Cảnh báo giá</a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">history</span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-outline-variant/20 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-on-surface leading-none">Quản trị viên</p>
                <p className="text-[10px] text-on-surface-variant mt-1">Quản lý hệ thống</p>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB24EyXCU4MnYeAWujUVFxYROjj8-umY1lHEss_ToDfWqsOrf8-Itc32-F4_-OYszEyz1SZ_V56sj0e5-NgsjfaRsOKucB67Hk4vm3UNUyhSEg1W8fkMNSAYwVrFKTy11wAUJHhxd2ex-d7LiQRj7bxC_VRBTvY6tq9HJ62BBOzHTzL2tH0n1Lk6XAjqucmwX9RDkrsEO7ykhrgGplnwhhwG87UJ9DC2GhzgN66PRn_EydHxKPfmzHownRnPOwj2Y_g8IEBN80zLhbT" 
                alt="Admin" 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/10 group-hover:border-primary/30 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
