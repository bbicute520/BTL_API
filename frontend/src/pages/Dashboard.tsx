import { useEffect, useMemo, useState } from 'react';
import api, { ChartPoint, Product, ProductActivity, Stats } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total_products: 0,
    price_drops: 0,
    active_watchlist: 0,
    total_notified: 0,
    total_crawls: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [activities, setActivities] = useState<ProductActivity[]>([]);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
    api.getProducts()
      .then((data) => {
        setProducts(data);
        if (data.length > 0) {
          setSelectedProductId((current) => current ?? data[0].id);
        }
      })
      .catch(console.error);
    api.getRecentActivity().then(setActivities).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedProductId) {
      setChartData([]);
      return;
    }
    api.getProductChart(selectedProductId).then(setChartData).catch(console.error);
  }, [selectedProductId]);

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedProductId) || null,
    [products, selectedProductId]
  );

  const chartStats = useMemo(() => {
    if (chartData.length === 0) {
      return null;
    }
    const prices = chartData.map((point) => point.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const lastPrice = prices[prices.length - 1];
    return { minPrice, maxPrice, lastPrice };
  }, [chartData]);

  const chartPoints = useMemo(() => {
    if (chartData.length === 0 || !chartStats) return '';
    const range = chartStats.maxPrice - chartStats.minPrice || 1;

    return chartData
      .map((point, index) => {
        const x = (index / Math.max(chartData.length - 1, 1)) * 1000;
        const y = 360 - ((point.price - chartStats.minPrice) / range) * 280;
        return `${x},${y}`;
      })
      .join(' ');
  }, [chartData, chartStats]);

  const chartLabels = useMemo(() => {
    if (chartData.length === 0) return [];
    const indices = [0, 1, 2, 3, 4]
      .map((i) => Math.round((i / 4) * (chartData.length - 1)))
      .filter((value, index, array) => array.indexOf(value) === index);
    return indices.map((index) => {
      const label = chartData[index]?.date || '';
      const date = new Date(label);
      if (Number.isNaN(date.getTime())) {
        return label;
      }
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    });
  }, [chartData]);

  const formatActivityTime = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  };

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
          <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h4 className="font-headline text-xl font-bold text-on-surface">Biến động giá sản phẩm</h4>
              <p className="text-on-surface-variant text-xs mt-1">
                {selectedProduct ? `Theo dõi giá: ${selectedProduct.name}` : 'Chưa có dữ liệu sản phẩm'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedProductId ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedProductId(value ? Number(value) : null);
                }}
                className="w-56 truncate px-4 py-1.5 rounded-full text-xs font-bold bg-surface border border-outline text-on-surface-variant hover:bg-surface-container transition-colors"
                disabled={products.length === 0}
              >
                {products.length === 0 ? (
                  <option value="">Chưa có sản phẩm</option>
                ) : (
                  products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[350px] w-full bg-gradient-to-t from-surface-container-low/20 to-transparent rounded-lg flex items-end overflow-hidden">
            {chartData.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-on-surface-variant">
                Chưa có dữ liệu lịch sử giá để hiển thị.
              </div>
            ) : (
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                <defs>
                  <linearGradient id="priceArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0c56d0" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0c56d0" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="#0c56d0"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartPoints}
                />
                <polygon
                  fill="url(#priceArea)"
                  points={`${chartPoints} 1000,380 0,380`}
                />
              </svg>
            )}

            {chartStats && (
              <div className="absolute top-4 right-4 bg-surface/90 border border-outline rounded-xl px-4 py-3 text-xs text-on-surface-variant space-y-1 shadow-sm">
                <div className="flex justify-between gap-4">
                  <span>Đỉnh</span>
                  <span className="font-bold text-on-surface">
                    {chartStats.maxPrice.toLocaleString()} ₫
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Đáy</span>
                  <span className="font-bold text-on-surface">
                    {chartStats.minPrice.toLocaleString()} ₫
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Mới nhất</span>
                  <span className="font-bold text-primary">
                    {chartStats.lastPrice.toLocaleString()} ₫
                  </span>
                </div>
              </div>
            )}

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
            {chartLabels.length === 0 ? (
              <span className="text-[10px] font-bold text-on-surface-variant">Chưa có mốc thời gian</span>
            ) : (
              chartLabels.map((label, index) => (
                <span key={`${label}-${index}`} className="text-[10px] font-bold text-on-surface-variant">
                  {label}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-surface border border-outline rounded-2xl p-6 flex flex-col">
          <h4 className="font-headline text-xl font-bold text-on-surface mb-8">Hoạt động gần đây</h4>
          <div className="space-y-8 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar">
            {activities.length === 0 ? (
              <div className="text-sm text-on-surface-variant">Chưa có hoạt động mới.</div>
            ) : (
              activities.map((activity, index) => {
                const isDrop = activity.activity_type === 'price_drop';
                const isIncrease = activity.activity_type === 'price_increase';
                const changeText =
                  activity.change_percent === null
                    ? 'Giá được cập nhật'
                    : `${activity.change_percent > 0 ? '+' : ''}${activity.change_percent}%`;
                return (
                  <div key={`${activity.product_id}-${index}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isDrop
                            ? 'bg-error ring-4 ring-error-container/20'
                            : isIncrease
                              ? 'bg-primary ring-4 ring-primary-container'
                              : 'bg-tertiary-dim ring-4 ring-tertiary-container'
                        }`}
                      ></div>
                      {index !== activities.length - 1 && (
                        <div className="w-px flex-1 bg-outline-variant/30 mt-2"></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                        {formatActivityTime(activity.recorded_at)}
                      </p>
                      <p className="text-sm font-bold text-on-surface leading-tight">
                        {isDrop ? 'Phát hiện giảm giá' : isIncrease ? 'Giá tăng' : 'Cập nhật giá'}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {activity.product_name} thay đổi {changeText}.
                      </p>
                      {activity.product_url && (
                        <div className="mt-3 flex gap-2">
                          <a
                            href={activity.product_url}
                            target="_blank"
                            className="text-[10px] font-bold text-primary px-3 py-1"
                          >
                            Xem sản phẩm
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

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
