'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { marketplaceAPI } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

const STORAGE_KEY = 'sbay_marketplace_items';

function loadLocal() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLocal(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

const defaultItems = [
  { id: 'd1', title: 'Vintage Film Camera', price: '120', location: 'Phnom Penh', description: 'Classic film camera in great condition', category: 'Electronics', image: '', createdAt: Date.now() - 86400000 * 3 },
  { id: 'd2', title: 'Camping Tent 4P', price: '85', location: 'Siem Reap', description: '4-person tent, barely used', category: 'Outdoor', image: '', createdAt: Date.now() - 86400000 * 5 },
  { id: 'd3', title: 'Mountain Bike', price: '350', location: 'Battambang', description: 'Great condition mountain bike', category: 'Sports', image: '', createdAt: Date.now() - 86400000 * 2 },
  { id: 'd4', title: 'Hiking Backpack 60L', price: '95', location: 'Kampot', description: 'Spacious hiking backpack', category: 'Outdoor', image: '', createdAt: Date.now() - 86400000 * 4 },
];

const categories = ['All', 'Electronics', 'Outdoor', 'Sports', 'Fashion', 'Home', 'Vehicles', 'Other'];

export default function MarketplacePage({ toast }) {
  const { user } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [form, setForm] = useState({ title: '', price: '', location: '', description: '', category: 'Other' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await marketplaceAPI.getAll();
      setItems(res.data.data || []);
    } catch {
      let local = loadLocal();
      if (local.length === 0) {
        local = defaultItems;
        saveLocal(local);
      }
      setItems(local);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ title: '', price: '', location: '', description: '', category: 'Other' });
    setImageFile(null);
    setImagePreview('');
    setShowForm(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.price.trim()) {
      toast?.('Title and price are required');
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', form.title.trim());
      data.append('price', form.price.trim());
      data.append('location', form.location.trim() || 'Phnom Penh');
      data.append('description', form.description.trim());
      data.append('category', form.category);
      if (imageFile) data.append('image', imageFile);
      const res = await marketplaceAPI.create(data);
      setItems((prev) => [res.data.data, ...prev]);
      toast?.('Item listed successfully!');
      resetForm();
    } catch {
      const newItem = {
        id: 'local_' + Date.now(),
        title: form.title.trim(),
        price: form.price.trim(),
        location: form.location.trim() || 'Phnom Penh',
        description: form.description.trim(),
        category: form.category,
        image: imagePreview || '',
        seller: { id: user?.id, username: user?.username },
        createdAt: Date.now(),
      };
      const updated = [newItem, ...loadLocal()];
      saveLocal(updated);
      setItems(updated);
      toast?.('Item listed (offline mode)!');
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    const updated = items.filter((i) => i.id !== id);
    saveLocal(updated);
    setItems(updated);
    toast?.('Item removed');
  };

  const filtered = items
    .filter((i) => filterCat === 'All' || i.category === filterCat)
    .filter((i) => !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'newest' ? (b.createdAt || 0) - (a.createdAt || 0) : sortBy === 'oldest' ? (a.createdAt || 0) - (b.createdAt || 0) : sortBy === 'price-low' ? parseFloat(a.price || 0) - parseFloat(b.price || 0) : parseFloat(b.price || 0) - parseFloat(a.price || 0));

  return (
    <div className="animate-[fadeIn_.3s_ease]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#34d399] to-[#0ea5e9] flex items-center justify-center text-white text-xl"><i className="fa-solid fa-store" /></div>
          <div>
            <div className="font-[Sora] text-xl font-extrabold">Marketplace</div>
            <div className="text-sm text-[var(--text3)]">Buy and sell locally</div>
          </div>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-bold rounded-[12px] hover:bg-[var(--accent2)] hover:-translate-y-[1px] active:scale-[0.97] transition-all flex items-center gap-2">
          <i className="fa-solid fa-plus" /> Add Listing
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[160px] max-w-[260px]">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text3)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search marketplace..."
            className="w-full bg-[var(--bg2)] border border-[var(--border)] rounded-full pl-8 pr-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="bg-[var(--bg2)] border border-[var(--border)] rounded-full px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] cursor-pointer">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[var(--bg2)] border border-[var(--border)] rounded-full px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] cursor-pointer">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-low">Price: Low</option>
          <option value="price-high">Price: High</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map((i) => (
            <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden animate-pulse">
              <div className="h-36 bg-[var(--bg3)]" />
              <div className="p-3.5 space-y-2">
                <div className="h-3 w-3/4 bg-[var(--bg3)] rounded" />
                <div className="h-3 w-1/2 bg-[var(--bg3)] rounded" />
                <div className="h-2.5 w-1/3 bg-[var(--bg3)] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-sm text-[var(--text3)] py-16">
          <div className="text-4xl mb-3"><i className="fa-solid fa-store-slash" /></div>
          <div className="font-semibold text-[var(--text2)] mb-1">No listings found</div>
          <div>{search || filterCat !== 'All' ? 'Try a different search or filter' : 'Be the first to list an item!'}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.id} onClick={() => router.push(`/marketplace/${item.id}`)} className="group bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] overflow-hidden transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,.2)] cursor-pointer">
              <div className="h-36 flex items-center justify-center text-5xl relative overflow-hidden bg-[var(--bg3)]">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <i className="fa-solid fa-image text-[var(--text3)] text-4xl opacity-30" />
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can" />
                  </button>
                </div>
                {item.category && (
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {item.category}
                  </div>
                )}
              </div>
              <div className="p-3.5">
                <div className="font-bold text-sm truncate">{item.title}</div>
                <div className="text-sm font-extrabold text-[var(--accent3)] mt-0.5">${item.price}</div>
                <div className="text-xs text-[var(--text3)] mt-1">
                  <i className="fa-solid fa-location-dot mr-1" />{item.location}
                </div>
                {item.description && (
                  <div className="text-xs text-[var(--text2)] mt-1.5 line-clamp-2">{item.description}</div>
                )}
                {item.seller && (
                  <div className="text-[10px] text-[var(--text3)] mt-1.5">
                    <i className="fa-regular fa-user mr-1" />{item.seller.username || 'Unknown'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 pb-8">
          <div className="absolute inset-0 bg-black/60" onClick={resetForm} />
          <div className="relative bg-[var(--bg2)] rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl" style={{ animation: 'fadeIn .2s ease' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h3 className="font-[Sora] font-bold text-lg">Add Listing</h3>
              <button onClick={resetForm} className="w-8 h-8 rounded-full bg-[var(--bg3)] flex items-center justify-center text-[var(--text2)] hover:bg-[var(--border)] transition-colors">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div
                onClick={() => !imagePreview && fileRef.current?.click()}
                className="relative flex items-center justify-center bg-[var(--bg)] border-2 border-dashed border-[var(--border)] rounded-xl min-h-[180px] cursor-pointer hover:border-[var(--accent)] transition-colors"
              >
                {!imagePreview ? (
                  <div className="flex flex-col items-center gap-2 p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg3)] flex items-center justify-center text-xl text-[var(--text3)]">
                      <i className="fa-solid fa-camera" />
                    </div>
                    <div className="text-sm font-semibold text-[var(--text2)]">Upload a photo</div>
                    <div className="text-xs text-[var(--text3)]">Tap to select</div>
                  </div>
                ) : (
                  <div className="w-full relative">
                    <img src={imagePreview} alt="" className="w-full max-h-[250px] object-contain rounded-lg" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(''); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
                    >
                      <i className="fa-solid fa-xmark" />
                    </button>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text2)] mb-1">Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="What are you selling?" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text2)] mb-1">Price ($) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="0.00" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text2)] mb-1">Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Phnom Penh" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text2)] mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] cursor-pointer">
                  {categories.filter((c) => c !== 'All').map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text2)] mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe your item..." className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] resize-none" />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[var(--border)] flex justify-end gap-2">
              <button onClick={resetForm} className="px-5 py-2 bg-[var(--bg3)] text-[var(--text2)] text-sm font-semibold rounded-[10px] hover:bg-[var(--border)] transition-colors">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} className="px-5 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-[10px] hover:bg-[var(--accent2)] disabled:opacity-60 transition-colors flex items-center gap-2">
                {submitting ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Listing...</> : <>Publish <i className="fa-solid fa-arrow-right" /></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}