import { useState } from 'react';
import api from '../services/api';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://price-tracker-gp8d.onrender.com";

export default function Settings() {
  const [testEmail, setTestEmail] = useState('');
  const [loadingTele, setLoadingTele] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const handleTestTele = async () => {
    setLoadingTele(true);
    try {
      const res = await api.testTelegram();
      alert(res.message);
    } catch (err) {
      alert("Lỗi kết nối Telegram. Vui lòng kiểm tra config ở Backend.");
    } finally {
      setLoadingTele(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) return alert("Vui lòng nhập email test");
    setLoadingEmail(true);
    try {
      const res = await api.testEmail(testEmail);
      alert(res.message);
    } catch (err) {
      alert("Lỗi gửi Email. Vui lòng kiểm tra config SMTP ở Backend.");
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <h3 className="text-[32px] font-headline font-semibold text-on-surface tracking-[-0.8px] mb-2">Cấu hình hệ thống</h3>
        <p className="text-on-surface-variant text-lg">Quản lý các kênh thông báo và giao thức tích hợp toàn hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-surface border border-outline rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl">info</span>
              </div>
              <div>
                <h4 className="text-xl font-headline font-bold text-on-surface">Lưu ý cấu hình</h4>
                <p className="text-sm text-on-surface-variant">Hiện tại Token và SMTP được cấu hình qua file .env ở Backend để đảm bảo bảo mật.</p>
              </div>
            </div>
            
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Để thay đổi Token Telegram hoặc tài khoản Gmail SMTP, vui lòng cập nhật file <code className="bg-surface-container px-2 py-1 rounded">.env</code> tại thư mục gốc của Backend và khởi động lại server.
            </p>
          </section>

          {/* Test Notification Panel */}
          <section className="bg-surface border border-outline rounded-2xl p-6">
            <h4 className="text-xl font-headline font-bold text-on-surface mb-6">Trình kích hoạt thử nghiệm</h4>
            
            <div className="space-y-6">
              {/* Telegram Test */}
              <div className="bg-surface border border-outline p-6 rounded-xl border-l-4 border-l-primary">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-on-surface font-bold">
                    <span className="material-symbols-outlined text-primary">send</span>
                    Telegram Bot
                  </div>
                </div>
                <button 
                  onClick={handleTestTele}
                  disabled={loadingTele}
                  className="w-full py-3 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary/5 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loadingTele ? 'Đang gửi...' : 'Gửi tin nhắn thử nghiệm'}
                </button>
              </div>

              {/* Email Test */}
              <div className="bg-surface border border-outline p-6 rounded-xl border-l-4 border-l-secondary">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-on-surface font-bold">
                    <span className="material-symbols-outlined text-secondary">mail</span>
                    Email SMTP
                  </div>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="Nhập email để nhận test"
                    className="flex-1 bg-surface border border-outline rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <button 
                    onClick={handleTestEmail}
                    disabled={loadingEmail}
                    className="px-6 py-2 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loadingEmail ? '...' : 'Gửi'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-surface border border-outline rounded-2xl p-6">
            <h4 className="font-bold mb-4">Trạng thái Backend</h4>
            <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
              Kết nối ổn định
            </div>
            <p className="text-xs text-on-surface-variant mt-4 leading-relaxed">
              Mọi thay đổi về cấu hình thông báo sẽ có hiệu lực ngay lập tức sau khi bạn lưu file .env ở server.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Meta Info */}
      <div className="mt-16 pt-8 border-t border-outline-variant/15 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-surface-variant text-sm font-headline">Phiên bản 4.2.0-stable | Lõi Phân tích Tiki</p>
        <div className="flex gap-6">
          <a href={`${API_BASE_URL}/docs`} className="text-on-surface-variant text-sm hover:text-primary transition-colors">Tài liệu</a>
          <a href={`${API_BASE_URL}/redoc`} className="text-on-surface-variant text-sm hover:text-primary transition-colors">Tài liệu API</a>
          <a href="#" className="text-on-surface-variant text-sm hover:text-primary transition-colors">Chính sách bảo mật</a>
        </div>
      </div>
    </div>
  );
}
