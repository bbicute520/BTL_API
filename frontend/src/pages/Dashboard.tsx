import { useEffect, useState } from 'react';
import api, { Stats } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total_products: 0,
    price_drops: 0,
    active_watchlist: 0,
    total_notified: 0,
    total_crawls: 0,
  });

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="p-12 space-y-10">
      {/* Header Section */}
      <section className="flex justify-between items-end">
        <div>
          <h2 className="font-headline text-[32px] font-semibold tracking-[-0.8px] text-on-surface">Nhịp đập thị trường</h2>
          <p className="text-on-surface-variant mt-2 font-medium">Theo dõi thời gian thực các danh mục hàng đầu trên Tiki.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => api.crawlAll().then(() => alert("Đã bắt đầu cập nhật giá trong background!"))}
            className="bg-surface border border-outline px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold text-primary tracking-wider uppercase">Cập nhật ngay</span>
          </button>
        </div>
      </section>

      {/* Metrics Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Card: Total Tracked */}
        <div className="bg-surface border border-outline p-6 rounded-2xl flex flex-col justify-between group hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <div className="bg-primary-container p-3 rounded-full">
              <span className="material-symbols-outlined text-primary">monitoring</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Trạng thái chung</span>
          </div>
          <div className="mt-8">
            <p className="text-on-surface-variant text-sm font-medium">Tổng sản phẩm theo dõi</p>
            <h3 className="font-headline text-[32px] font-semibold text-on-surface mt-1">{stats.total_products.toLocaleString()}</h3>
          </div>
          <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
            <span className="material-symbols-outlined text-base">trending_up</span>
            <span>Tổng cộng {stats.total_crawls.toLocaleString()} lượt crawl</span>
          </div>
        </div>

        {/* Metric Card: Price Drops */}
        <div className="bg-surface border border-outline p-6 rounded-2xl flex flex-col justify-between group hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <div className="bg-error-container/20 p-3 rounded-full">
              <span className="material-symbols-outlined text-error">sell</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cơ hội</span>
          </div>
          <div className="mt-8">
            <p className="text-on-surface-variant text-sm font-medium">Sản phẩm đang giảm giá</p>
            <h3 className="font-headline text-[32px] font-semibold text-on-surface mt-1">{stats.price_drops.toLocaleString()}</h3>
          </div>
          <div className="mt-6 flex items-center gap-2 text-error font-bold text-sm">
            <span className="material-symbols-outlined text-base">arrow_downward</span>
            <span>Phát hiện biến động lớn</span>
          </div>
        </div>

        {/* Metric Card: Active Alerts */}
        <div className="bg-surface border border-outline p-6 rounded-2xl flex flex-col justify-between group hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start">
            <div className="bg-tertiary-container p-3 rounded-full">
              <span className="material-symbols-outlined text-tertiary">notification_important</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Cảnh báo người dùng</span>
          </div>
          <div className="mt-8">
            <p className="text-on-surface-variant text-sm font-medium">Cảnh báo đang chờ</p>
            <h3 className="font-headline text-[32px] font-semibold text-on-surface mt-1">{stats.active_watchlist.toLocaleString()}</h3>
          </div>
          <div className="mt-6 flex items-center gap-2 text-on-surface-variant font-medium text-sm">
            <span className="material-symbols-outlined text-base">done_all</span>
            <span>Đã gửi {stats.total_notified} thông báo</span>
          </div>
        </div>
      </section>
      
      {/* ... (Các phần chart và activity giữ nguyên style nhưng có thể map dữ liệu thật sau) */}

      {/* Main Data Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Area Chart Container */}
        <div className="lg:col-span-2 bg-surface border border-outline rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="font-headline text-xl font-bold text-on-surface">Biến động giá thị trường</h4>
              <p className="text-on-surface-variant text-xs mt-1">Biểu đồ xu hướng của các danh mục hàng đầu trong 30 ngày qua</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary text-white">Hàng ngày</button>
              <button className="px-4 py-1.5 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Hàng tháng</button>
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[350px] w-full bg-gradient-to-t from-surface-container-low/20 to-transparent rounded-lg flex items-end overflow-hidden">
            {/* Simulated Area Chart Path */}
            <div 
              className="absolute inset-0 bg-primary/10 w-full h-full"
              style={{ clipPath: 'polygon(0% 100%, 0% 60%, 15% 55%, 30% 70%, 45% 40%, 60% 50%, 75% 30%, 90% 45%, 100% 35%, 100% 100%)' }}
            ></div>
            
            {/* Simulated Trend Line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
              <path d="M0,240 L150,220 L300,280 L450,160 L600,200 L750,120 L900,180 L1000,140" fill="none" stroke="#0c56d0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg" />
              <circle cx="450" cy="160" r="6" fill="#0c56d0" className="animate-pulse" />
              <circle cx="750" cy="120" r="6" fill="#0c56d0" />
            </svg>

            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-b border-on-surface"></div>
              <div className="border-b border-on-surface"></div>
              <div className="border-b border-on-surface"></div>
              <div className="border-b border-on-surface"></div>
              <div className="border-b border-on-surface"></div>
            </div>
          </div>
          
          <div className="flex justify-between mt-6 px-4">
            <span className="text-[10px] font-bold text-on-surface-variant">01 THG 3</span>
            <span className="text-[10px] font-bold text-on-surface-variant">08 THG 3</span>
            <span className="text-[10px] font-bold text-on-surface-variant">15 THG 3</span>
            <span className="text-[10px] font-bold text-on-surface-variant">22 THG 3</span>
            <span className="text-[10px] font-bold text-on-surface-variant">30 THG 3</span>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-surface border border-outline rounded-2xl p-6 flex flex-col">
          <h4 className="font-headline text-xl font-bold text-on-surface mb-8">Hoạt động gần đây</h4>
          <div className="space-y-8 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
            
            {/* Activity Item 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-error ring-4 ring-error-container/20"></div>
                <div className="w-px flex-1 bg-outline-variant/30 mt-2"></div>
              </div>
              <div className="pb-6">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">2 phút trước</p>
                <p className="text-sm font-bold text-on-surface leading-tight">Phát hiện giảm giá</p>
                <p className="text-xs text-on-surface-variant mt-1">Apple iPhone 15 Pro Max (256GB) giảm <span className="text-error font-bold">-12%</span> tại Tiki Trading.</p>
                <div className="mt-3 flex gap-2">
                  <button className="text-[10px] font-bold bg-white px-3 py-1 rounded border border-outline-variant/10 hover:bg-white/80">Chi tiết</button>
                  <button className="text-[10px] font-bold text-primary px-3 py-1">Mua ngay</button>
                </div>
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary-container"></div>
                <div className="w-px flex-1 bg-outline-variant/30 mt-2"></div>
              </div>
              <div className="pb-6">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">1 giờ trước</p>
                <p className="text-sm font-bold text-on-surface leading-tight">Đã tạo cảnh báo mới</p>
                <p className="text-xs text-on-surface-variant mt-1">Quản trị viên đã thêm cảnh báo giá mục tiêu cho <span className="font-semibold text-on-surface">Sony PS5 Slim</span> ở mức 12.500.000 ₫.</p>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-tertiary-dim ring-4 ring-tertiary-container"></div>
                <div className="w-px flex-1 bg-outline-variant/30 mt-2"></div>
              </div>
              <div className="pb-6">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">4 giờ trước</p>
                <p className="text-sm font-bold text-on-surface leading-tight">Hoàn tất quét thị trường</p>
                <p className="text-xs text-on-surface-variant mt-1">Cập nhật thành công 8.402 mã sản phẩm trong danh mục Điện tử. Không phát hiện bất thường.</p>
              </div>
            </div>

            {/* Activity Item 4 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-error ring-4 ring-error-container/20"></div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Hôm qua</p>
                <p className="text-sm font-bold text-on-surface leading-tight">Phát hiện giảm giá</p>
                <p className="text-xs text-on-surface-variant mt-1">Samsung Galaxy Tab S9 FE+ giảm <span className="text-error font-bold">-8%</span>.</p>
              </div>
            </div>

          </div>
          <button className="mt-auto pt-6 text-center text-xs font-bold text-primary hover:underline transition-all">Xem tất cả hoạt động</button>
        </div>
      </section>

      {/* Footer / Global Stats */}
      <footer className="mt-20 px-12 py-10 border-t border-outline flex justify-between items-center bg-transparent">
        <div className="flex gap-12">
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Đồng bộ lần cuối</p>
            <p className="text-xs font-bold text-on-surface mt-1">Hôm nay, 14:42:01</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Trạng thái hệ thống</p>
            <p className="text-xs font-bold text-primary mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              Hoạt động tốt
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Lưu trữ dữ liệu</p>
            <p className="text-xs font-bold text-on-surface mt-1">90 ngày</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-on-surface-variant">© 2024 Tiki Analytics Engine. Giám sát chính xác cho quyết định chính xác.</p>
        </div>
      </footer>
    </div>
  );
}
