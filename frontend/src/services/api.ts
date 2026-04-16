const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export interface Product {
  id: number;
  name: string;
  tiki_id: string;
  url: string;
  image_url: string;
  current_price: number;
  lowest_price: number;
  last_checked: string;
}

export interface WatchlistDetail {
  id: number;
  email: string;
  product_id: number;
  alert_type: 'fixed' | 'percent';
  target_price: number | null;
  base_price: number | null;
  drop_percentage: number | null;
  cooldown_hours: number;
  is_notified: boolean;
  last_notified_at: string | null;
  product_name: string;
  product_image: string;
  current_price: number;
  lowest_price: number;
  product_url: string;
  tiki_id: string;
}

export interface Stats {
  total_products: number;
  price_drops: number;
  active_watchlist: number;
  total_notified: number;
  total_crawls: number;
}

export interface ChartPoint {
  date: string;
  price: number;
}

export interface ProductActivity {
  product_id: number;
  product_name: string;
  product_url: string | null;
  current_price: number;
  previous_price: number | null;
  change_amount: number | null;
  change_percent: number | null;
  recorded_at: string;
  activity_type: string;
}

const DEFAULT_STATS: Stats = {
  total_products: 0,
  price_drops: 0,
  active_watchlist: 0,
  total_notified: 0,
  total_crawls: 0,
};

const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}/products`);
    return res.json();
  },

  async getProductChart(productId: number): Promise<ChartPoint[]> {
    const res = await fetch(`${API_BASE_URL}/products/${productId}/chart`);
    return res.json();
  },

  async getRecentActivity(limit = 12): Promise<ProductActivity[]> {
    const res = await fetch(`${API_BASE_URL}/products/activity?limit=${limit}`);
    return res.json();
  },

  async addProduct(tikiId: string): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tiki_id: tikiId }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      const message = errorData.detail || "Không thể thêm sản phẩm. Vui lòng kiểm tra link Tiki.";
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }
    
    return res.json();
  },

  // Watchlist
  async getWatchlistDetails(): Promise<WatchlistDetail[]> {
    const res = await fetch(`${API_BASE_URL}/watchlist/details`);
    return res.json();
  },

  async addToWatchlist(payload: {
    email: string;
    product_id: number;
    alert_type: string;
    target_price?: number;
    drop_percentage?: number;
    cooldown_hours?: number;
  }) {
    const res = await fetch(`${API_BASE_URL}/watchlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Không thể đặt cảnh báo");
    }
    
    return res.json();
  },

  async deleteWatchlist(id: number) {
    await fetch(`${API_BASE_URL}/watchlist/${id}`, { method: "DELETE" });
  },

  async updateWatchlist(id: number, payload: any) {
    const res = await fetch(`${API_BASE_URL}/watchlist/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Crawler & Stats
  async getStats(): Promise<Stats> {
    const res = await fetch(`${API_BASE_URL}/crawl/stats`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const message = errorData?.detail || 'Không thể lấy thống kê hệ thống.';
      throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
    }

    const data = await res.json();
    return {
      ...DEFAULT_STATS,
      ...(data ?? {}),
    };
  },

  async crawlAll() {
    const res = await fetch(`${API_BASE_URL}/crawl/all`, { method: "POST" });
    return res.json();
  },

  async testTelegram() {
    const res = await fetch(`${API_BASE_URL}/crawl/test-telegram`, { method: "POST" });
    return res.json();
  },

  async testEmail(email: string) {
    const res = await fetch(`${API_BASE_URL}/crawl/test-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },
};

export default api;
