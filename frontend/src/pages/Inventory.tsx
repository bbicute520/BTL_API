import { useEffect, useState } from 'react';
import api, { WatchlistDetail } from '../services/api';

export default function Inventory() {
  const [items, setItems] = useState<WatchlistDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<WatchlistDetail | null>(null);
  const [editFormData, setEditFormData] = useState({
    email: '',
    alert_type: 'fixed' as 'fixed' | 'percent',
    target_price: '',
    drop_percentage: '',
    cooldown_hours: '24'
  });

  const fetchItems = async () => {
    try {
      const data = await api.getWatchlistDetails();
      setItems(data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mục theo dõi này?")) return;
    try {
      await api.deleteWatchlist(id);
      fetchItems();
    } catch (err) {
      alert("Lỗi khi xóa.");
    }
  };

  const handleEditClick = (item: WatchlistDetail) => {
    setEditingItem(item);
    setEditFormData({
      email: item.email,
      alert_type: item.alert_type,
      target_price: item.target_price?.toString() || '',
      drop_percentage: item.drop_percentage?.toString() || '',
      cooldown_hours: item.cooldown_hours.toString()
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      await api.updateWatchlist(editingItem.id, {
        email: editFormData.email,
        product_id: editingItem.product_id,
        alert_type: editFormData.alert_type,
        target_price: editFormData.alert_type === 'fixed' ? parseFloat(editFormData.target_price) : null,
        drop_percentage: editFormData.alert_type === 'percent' ? parseFloat(editFormData.drop_percentage) : null,
        cooldown_hours: parseInt(editFormData.cooldown_hours)
      });
      alert("Cập nhật thành công!");
      setEditingItem(null);
      fetchItems();
    } catch (err) {
      alert("Lỗi khi cập nhật.");
    }
  };

  return (
    <div className="p-12 min-h-[calc(100vh-5rem)] font-body">
      {/* Header Section */}
      <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
            <span>Hệ thống Tiki</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary">Kho sản phẩm</span>
          </nav>
          <h2 className="text-[32px] font-semibold font-headline text-on-surface tracking-[-0.8px]">Danh mục theo dõi</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl text-lg leading-relaxed font-medium">Quản lý các cảnh báo giá và xem lịch sử thấp nhất mọi thời đại của sản phẩm.</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-12 max-w-sm">
        <div className="bg-surface border border-outline p-6 rounded-2xl relative overflow-hidden group shadow-sm">
          <div className="relative z-10">
            <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-1">Cảnh báo đang hoạt động</p>
            <h3 className="text-[32px] font-semibold font-headline text-on-surface">{items.length}</h3>
            <div className="mt-4 flex items-center gap-2 text-primary font-bold text-sm">
              <span className="material-symbols-outlined text-base">analytics</span>
              <span>Dữ liệu khớp với Backend</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <span className="material-symbols-outlined text-[12rem]">monitoring</span>
          </div>
        </div>
      </section>

      {/* Inventory Table Section */}
      <section className="bg-surface border border-outline rounded-2xl overflow-hidden shadow-sm">
        <div className="p-8 pb-4">
          <h3 className="text-xl font-bold font-headline text-on-surface">Danh sách sản phẩm</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-on-surface-variant/70 border-b border-outline-variant/10 bg-surface-container/30">
                <th className="px-8 py-4 font-bold text-[11px] uppercase tracking-[1.5px] text-on-surface-variant">Sản phẩm</th>
                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-[1.5px] text-on-surface-variant">Giá hiện tại</th>
                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-[1.5px] text-on-surface-variant">Mục tiêu / ATL</th>
                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-[1.5px] text-on-surface-variant text-center">Trạng thái</th>
                <th className="px-6 py-4 font-bold text-[11px] uppercase tracking-[1.5px] text-on-surface-variant">Thông báo</th>
                <th className="px-8 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-20 font-medium text-on-surface-variant">Đang kết nối cơ sở dữ liệu...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-20 text-on-surface-variant font-medium">Chưa có sản phẩm nào. Hãy thêm sản phẩm mới để bắt đầu theo dõi!</td></tr>
              ) : items.map((item) => (
                <tr key={item.id} className="group hover:bg-surface-container/50 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-surface-container rounded-xl overflow-hidden flex-shrink-0 border border-outline shadow-sm">
                        <img src={item.product_image || 'https://via.placeholder.com/100'} alt={item.product_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="max-w-md">
                        <h4 className="text-sm font-bold text-on-surface leading-tight line-clamp-2" title={item.product_name}>{item.product_name}</h4>
                        <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase tracking-wider">TIKI ID: {item.tiki_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-lg font-black text-on-surface tracking-tight">
                      {item.current_price?.toLocaleString()} ₫
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-primary">notifications_active</span>
                        <span className="text-sm font-extrabold text-primary">
                          {item.alert_type === 'fixed' 
                            ? `${item.target_price?.toLocaleString()} ₫`
                            : `-${item.drop_percentage}%`
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-[11px] text-blue-600 font-bold uppercase tracking-tighter italic">Đáy: {item.lowest_price?.toLocaleString()} ₫</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-flex items-center justify-center rounded-full w-8 h-8 ${item.is_notified ? 'bg-surface-container-highest text-on-surface-variant opacity-40' : 'bg-primary-container text-primary shadow-inner-glow'}`}>
                      <span className="material-symbols-outlined text-lg">
                        {item.is_notified ? 'notifications_off' : 'notifications_active'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-xs font-semibold text-on-surface-variant">
                      <p className="truncate max-w-[140px] text-on-surface">{item.email}</p>
                      <div className="flex items-center gap-1 mt-1 opacity-60">
                        <span className="material-symbols-outlined text-[10px]">history</span>
                        <span>{item.cooldown_hours}h</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(item)}
                        className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-colors"
                        title="Chỉnh sửa"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <a href={item.product_url} target="_blank" className="p-2 hover:bg-surface-container-highest rounded-lg text-on-surface-variant transition-colors" title="Mở Tiki">
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 hover:bg-error-container/30 rounded-lg text-error transition-colors"
                        title="Xóa"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setEditingItem(null)}></div>
          <div className="relative bg-surface w-full max-w-lg rounded-3xl p-10 shadow-2xl border border-outline overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold font-headline text-on-surface">Cấu hình cảnh báo</h3>
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-1">Sản phẩm: {editingItem.product_name}</p>
              </div>
              <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Email nhận tin</label>
                <input 
                  type="email" 
                  required
                  value={editFormData.email}
                  onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full bg-surface border border-outline rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Loại cảnh báo</label>
                  <select 
                    value={editFormData.alert_type}
                    onChange={e => setEditFormData({...editFormData, alert_type: e.target.value as 'fixed' | 'percent'})}
                    className="w-full bg-surface border border-outline rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                  >
                    <option value="fixed">Giá cố định</option>
                    <option value="percent">% Giảm giá</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">Thời gian hồi (giờ)</label>
                  <input 
                    type="number" 
                    value={editFormData.cooldown_hours}
                    onChange={e => setEditFormData({...editFormData, cooldown_hours: e.target.value})}
                    className="w-full bg-surface border border-outline rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  {editFormData.alert_type === 'fixed' ? 'Giá mục tiêu (VND)' : 'Phần trăm giảm muốn báo (%)'}
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    required
                    value={editFormData.alert_type === 'fixed' ? editFormData.target_price : editFormData.drop_percentage}
                    onChange={e => setEditFormData({
                      ...editFormData, 
                      [editFormData.alert_type === 'fixed' ? 'target_price' : 'drop_percentage']: e.target.value
                    })}
                    className="w-full bg-surface border border-outline rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  {editFormData.alert_type === 'percent' && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">%</span>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-4 rounded-xl border border-outline text-sm font-bold text-on-surface hover:bg-surface-container transition-all active:scale-95"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 rounded-xl bg-primary text-on-primary text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
