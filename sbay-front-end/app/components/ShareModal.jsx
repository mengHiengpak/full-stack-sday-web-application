'use client';

export default function ShareModal({ open, onClose, toast, post }) {
  if (!open) return null;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const postUrl = post ? `${origin}/post/${post.id}` : origin;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast?.('🔗 Link copied to clipboard!');
      onClose();
    } catch {
      toast?.('Failed to copy link');
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/75 backdrop-blur-md flex items-center justify-center animate-[fadeIn_.2s]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-[460px] max-w-[95vw] bg-[var(--bg2)] border border-[var(--border)] rounded-2xl p-6 shadow-[0_30px_80px_rgba(0,0,0,.5)] animate-[slideUp_.3s_ease]" onClick={(e) => e.stopPropagation()}>
        <div className="font-[Sora] text-lg font-extrabold mb-5 flex items-center justify-between">
          Share Post
          <button onClick={onClose} className="bg-transparent border-none text-[var(--text2)] cursor-pointer text-xl"><i className="fa-solid fa-xmark" /></button>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { icon: 'fa-brands fa-facebook-f', label: 'Facebook', cls: 'text-[#1877f2]', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}` },
            { icon: 'fa-brands fa-twitter', label: 'Twitter', cls: 'text-[#1da1f2]', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}` },
            { icon: 'fa-brands fa-whatsapp', label: 'WhatsApp', cls: 'text-[#25d366]', url: `https://wa.me/?text=${encodeURIComponent(postUrl)}` },
            { icon: 'fa-brands fa-telegram', label: 'Telegram', cls: 'text-[#0088cc]', url: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}` },
            { icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn', cls: 'text-[#0a66c2]', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}` },
            { icon: 'fa-brands fa-instagram', label: 'Instagram', cls: 'text-[#e1306c]' },
            { icon: 'fa-brands fa-youtube', label: 'YouTube', cls: 'text-[#ff0000]' },
            { icon: 'fa-solid fa-link', label: 'Copy Link', cls: 'text-[var(--text3)]', action: copyLink },
          ].map((p, i) => (
            <div
              key={i}
              onClick={() => {
                if (p.action) p.action();
                else if (p.url) { window.open(p.url, '_blank', 'noopener'); toast?.(`📤 Shared on ${p.label}!`); onClose(); }
                else toast?.(`📤 Shared on ${p.label}!`);
              }}
              className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-xl bg-[var(--card)] border border-[var(--border)] cursor-pointer text-xs text-[var(--text2)] font-semibold hover:border-[var(--accent)] hover:text-[var(--text)] hover:-translate-y-0.5 transition-all"
            >
              <i className={`${p.icon} text-[22px] ${p.cls}`} />{p.label}
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 items-center bg-[var(--bg3)] border border-[var(--border)] rounded-full pl-4 pr-1 py-1">
          <input type="text" value={postUrl} readOnly className="flex-1 bg-transparent border-none outline-none text-xs text-[var(--text2)]" />
          <button onClick={copyLink} className="bg-[var(--accent)] text-white border-none rounded-full px-4 py-2 text-xs font-bold cursor-pointer hover:bg-[#5855d6] transition-all">Copy</button>
        </div>
      </div>
    </div>
  );
}
