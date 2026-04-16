import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function TrackProduct() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [alertType, setAlertType] = useState<'fixed' | 'percent'>('fixed');
  const [targetPrice, setTargetPrice] = useState('');
  const [dropPercent, setDropPercent] = useState('10');
  const [cooldown, setCooldown] = useState('24');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Trích xuất tiki_id bằng Regex mạnh mẽ hơn
      let tikiId = url.trim();
      
      // Tìm mẫu p + số (ví dụ: p123456)
      const pMatch = url.match(/p(\d+)/);
      if (pMatch) {
        tikiId = pMatch[1];
      } else {
        // Tìm mẫu số đứng sau dấu gạch chéo cuối cùng (nếu người dùng chỉ dán ID hoặc link ngắn)
        const idMatch = url.match(/\/(\d+)(?:\?|$)/);
        if (idMatch) {
          tikiId = idMatch[1];
        }
      }

      // Kiểm tra xem tikiId có phải là chuỗi số không
      if (!/^\d+$/.test(tikiId)) {
        throw new Error("Định dạng link Tiki không hợp lệ. Link phải chứa mã sản phẩm (ví dụ: p123456)");
      }

      console.log("Đang thêm sản phẩm với Tiki ID:", tikiId);

      // 2. Thêm sản phẩm
      const product = await api.addProduct(tikiId);

      // 3. Thêm vào watchlist
      await api.addToWatchlist({
        email,
        product_id: product.id,
        alert_type: alertType,
        target_price: alertType === 'fixed' ? parseFloat(targetPrice) : undefined,
        drop_percentage: alertType === 'percent' ? parseFloat(dropPercent) : undefined,
        cooldown_hours: parseInt(cooldown)
      });

      alert("Thành công! Sản phẩm đã được đưa vào danh sách theo dõi.");
      navigate('/inventory');
    } catch (err: any) {
      console.error("Lỗi chi tiết:", err);
      // Hiển thị lỗi thân thiện từ Backend nếu có
      alert(err.message || "Không thể kết nối đến server hoặc Tiki chặn Crawler.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 min-h-[calc(100vh-5rem)] font-body">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Header Section */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-container/30 text-on-primary-container rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">add_chart</span>
            Hệ thống phân tích
          </div>
          <h1 className="text-[32px] font-semibold font-headline text-on-surface tracking-[-0.8px]">Theo dõi sản phẩm mới</h1>
          <p className="text-on-surface-variant max-w-lg mx-auto text-lg leading-relaxed font-medium">
            Dán link Tiki để bắt đầu giám sát biến động giá và nhận thông báo tự động.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Instruction Section */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-surface border border-outline rounded-2xl p-6 space-y-6 shadow-sm">
              <h3 className="font-headline font-bold text-lg text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">info</span>
                Hướng dẫn
              </h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-primary-dim text-sm">1</span>
                  <p className="text-sm text-on-surface-variant leading-snug">Sao chép URL sản phẩm từ <strong className="text-on-surface font-bold">tiki.vn</strong>.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-primary-dim text-sm">2</span>
                  <p className="text-sm text-on-surface-variant leading-snug">Dán vào ô nhập liệu bên cạnh.</p>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-primary-dim text-sm">3</span>
                  <p className="text-sm text-on-surface-variant leading-snug">Cài đặt mức giá hoặc phần trăm bạn muốn mua.</p>
                </li>
              </ul>
            </div>
          </aside>

          {/* Form Section */}
          <div className="lg:col-span-8 bg-surface border border-outline rounded-2xl p-8 space-y-8 shadow-sm">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* URL Field */}
              <div className="space-y-2">
                <label className="block font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">URL sản phẩm Tiki</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">link</span>
                  <input 
                    required
                    type="url" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Ví dụ: https://tiki.vn/p/iphone-15-pro-max-p272658145.html" 
                    className="w-full bg-surface border border-outline rounded-xl pl-12 pr-6 py-4 text-sm font-body focus:bg-surface-container-low focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Email nhận thông báo</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">alternate_email</span>
                    <input 
                      required
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your-email@gmail.com" 
                      className="w-full bg-surface border border-outline rounded-xl pl-12 pr-6 py-4 text-sm font-body focus:bg-surface-container-low focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Cooldown Field */}
                <div className="space-y-2">
                  <label className="block font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Hồi chiêu (giờ)</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">schedule</span>
                    <input 
                      type="number" 
                      value={cooldown}
                      onChange={(e) => setCooldown(e.target.value)}
                      className="w-full bg-surface border border-outline rounded-xl pl-12 pr-6 py-4 text-sm font-body focus:bg-surface-container-low focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Alert Configuration */}
              <div className="p-6 bg-surface border border-outline rounded-xl space-y-6">
                <div className="flex gap-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={alertType === 'fixed'} onChange={() => setAlertType('fixed')} className="text-primary focus:ring-primary" />
                    <span className="text-sm font-bold text-on-surface">Giá cố định (VND)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={alertType === 'percent'} onChange={() => setAlertType('percent')} className="text-primary focus:ring-primary" />
                    <span className="text-sm font-bold text-on-surface">Theo % giảm giá</span>
                  </label>
                </div>

                {alertType === 'fixed' ? (
                  <div className="space-y-2">
                    <input 
                      type="number" 
                      required
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      placeholder="Nhập giá bạn chờ đợi (ví dụ: 12000000)" 
                      className="w-full bg-surface border border-outline rounded-xl px-4 py-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <input 
                        type="number" 
                        required
                        value={dropPercent}
                        onChange={(e) => setDropPercent(e.target.value)}
                        placeholder="Nhập phần trăm muốn giảm" 
                        className="w-full bg-surface border border-outline rounded-xl px-4 py-4 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none shadow-sm"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-primary">%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-on-primary py-5 rounded-xl font-headline font-bold text-lg shadow-lg hover:bg-primary-dim active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 inner-glow"
                >
                  <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>{loading ? 'sync' : 'save'}</span>
                  {loading ? 'Đang xử lý...' : 'Bắt đầu theo dõi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
