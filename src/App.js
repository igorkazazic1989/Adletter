import { useState } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,300;9..144,600;9..144,800&display=swap');
`;

const TABS = ["Marketplace", "Bundles", "Publisher Dashboard", "Tracking & Reports", "Admin"];
const PRICING_MODES = ["Fixed Price", "CPM", "CPA"];

const NEWSLETTERS = [
  { id: 1, name: "Nordic Industry Weekly", category: "Industry", subs: 12400, or: 48.2, ctr: 4.1, price: 320, cpm: 25.8, cpa: 0.63, avail: ["2026-04-14", "2026-04-21", "2026-04-28"], verified: true, lastSync: "2 min ago", platform: "Mailchimp" },
  { id: 2, name: "SaaS Growth Digest", category: "SaaS/Tech", subs: 8700, or: 52.1, ctr: 5.8, price: 280, cpm: 32.2, cpa: 0.55, avail: ["2026-04-16", "2026-04-23"], verified: true, lastSync: "5 min ago", platform: "Beehiiv" },
  { id: 3, name: "The Lifestyle Letter", category: "Lifestyle", subs: 21000, or: 39.5, ctr: 3.2, price: 450, cpm: 21.4, cpa: 0.67, avail: ["2026-04-15", "2026-04-22", "2026-04-29"], verified: true, lastSync: "1 min ago", platform: "Substack" },
  { id: 4, name: "Dev Toolbox", category: "SaaS/Tech", subs: 5300, or: 61.0, ctr: 7.4, price: 190, cpm: 35.8, cpa: 0.48, avail: ["2026-04-17"], verified: true, lastSync: "8 min ago", platform: "Mailchimp" },
  { id: 5, name: "Green Living Nordic", category: "Lifestyle", subs: 9100, or: 44.8, ctr: 3.9, price: 260, cpm: 28.6, cpa: 0.73, avail: ["2026-04-14", "2026-04-21"], verified: false, lastSync: "—", platform: "Beehiiv" },
  { id: 6, name: "Founder's Playbook", category: "Business", subs: 15600, or: 46.3, ctr: 4.5, price: 380, cpm: 24.4, cpa: 0.54, avail: ["2026-04-18", "2026-04-25"], verified: true, lastSync: "3 min ago", platform: "Mailchimp" },
];

const BUNDLES = [
  { id: "B1", name: "SaaS/Tech Power Pack", desc: "Reach the entire tech audience in one click", newsletters: [2, 4], totalSubs: 14000, discount: 12, totalPrice: 414 },
  { id: "B2", name: "Lifestyle Blitz", desc: "Broad lifestyle reach across verified newsletters", newsletters: [3, 5], totalSubs: 30100, discount: 10, totalPrice: 639 },
  { id: "B3", name: "Full Network Blast", desc: "Every verified newsletter, maximum exposure", newsletters: [1, 2, 3, 4, 6], totalSubs: 63000, discount: 18, totalPrice: 1325 },
];

const CATEGORIES = ["All", "Industry", "SaaS/Tech", "Lifestyle", "Business"];
const AD_FORMATS = ["Sponsored Slot", "Shoutout", "Deep Dive"];

const CAMPAIGNS = [
  { id: "C-1041", newsletter: "SaaS Growth Digest", date: "2026-03-28", reached: 8700, opened: 4531, clicks: 504, leads: 38, status: "completed" },
  { id: "C-1039", newsletter: "Nordic Industry Weekly", date: "2026-03-21", reached: 12400, opened: 5977, clicks: 508, leads: 22, status: "completed" },
  { id: "C-1044", newsletter: "The Lifestyle Letter", date: "2026-04-15", reached: 0, opened: 0, clicks: 0, leads: 0, status: "scheduled" },
];

function Badge({ children, color = "emerald" }) {
  const colors = {
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    sky: "bg-sky-100 text-sky-700",
    rose: "bg-rose-100 text-rose-700",
    slate: "bg-slate-100 text-slate-600",
    violet: "bg-violet-100 text-violet-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors[color]}`}>{children}</span>;
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--card)" }}>
      <div className="text-xs uppercase tracking-widest opacity-50 mb-1" style={{ fontFamily: "'DM Sans'" }}>{label}</div>
      <div className="text-3xl font-semibold" style={{ fontFamily: "'Fraunces'", color: "var(--accent)" }}>{value}</div>
      {sub && <div className="text-xs opacity-40 mt-1">{sub}</div>}
    </div>
  );
}

function PricingToggle({ mode, setMode }) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: "var(--card)" }}>
      {PRICING_MODES.map(m => (
        <button key={m} onClick={() => setMode(m)} className="px-3 py-1 rounded-full text-xs font-medium transition-all"
          style={{ background: mode === m ? "var(--accent)" : "transparent", color: mode === m ? "#fff" : "inherit", opacity: mode === m ? 1 : 0.5 }}>{m}</button>
      ))}
    </div>
  );
}

function PriceDisplay({ n, mode }) {
  if (mode === "CPM") return <><span className="text-2xl font-bold" style={{ color: "var(--accent)", fontFamily: "'Fraunces'" }}>${n.cpm}</span><span className="text-xs opacity-40 ml-1">/ 1K subs</span></>;
  if (mode === "CPA") return <><span className="text-2xl font-bold" style={{ color: "var(--accent)", fontFamily: "'Fraunces'" }}>${n.cpa}</span><span className="text-xs opacity-40 ml-1">/ click</span></>;
  return <><span className="text-2xl font-bold" style={{ color: "var(--accent)", fontFamily: "'Fraunces'" }}>${n.price}</span><span className="text-xs opacity-40 ml-1">flat</span></>;
}

function getPrice(n, mode) {
  if (mode === "CPM") return Math.round(n.cpm * n.subs / 1000);
  if (mode === "CPA") return Math.round(n.cpa * n.subs * (n.ctr / 100));
  return n.price;
}

function BookingFlow({ selected, pricingMode }) {
  const [format, setFormat] = useState(AD_FORMATS[0]);
  const [booked, setBooked] = useState(null);
  const [step, setStep] = useState(1);
  const [adText, setAdText] = useState("");
  const [adLink, setAdLink] = useState("");
  const price = getPrice(selected, pricingMode);
  const platformFee = Math.round(price * 0.15);
  const total = price + platformFee;

  return (
    <div className="mt-6 rounded-2xl p-6" style={{ background: "var(--card)", border: "2px solid var(--accent)" }}>
      <div className="flex items-center gap-2 mb-5">
        {["Configure", "Ad Creative", "Review & Pay"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: step > i + 1 ? "#10b981" : step === i + 1 ? "var(--accent)" : "rgba(128,128,128,0.15)", color: step >= i + 1 ? "#fff" : "inherit" }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:inline" style={{ opacity: step === i + 1 ? 1 : 0.4 }}>{s}</span>
            </div>
            {i < 2 && <div className="w-6 h-px" style={{ background: "rgba(128,128,128,0.2)" }} />}
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "'Fraunces'" }}>Book — {selected.name}</h3>

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-widest opacity-50 block mb-2">Ad Format</label>
            <div className="flex flex-wrap gap-2">
              {AD_FORMATS.map(f => (
                <button key={f} onClick={() => setFormat(f)} className="px-3 py-1.5 rounded-full text-sm transition-all"
                  style={{ background: format === f ? "var(--accent)" : "rgba(128,128,128,0.15)", color: format === f ? "#fff" : "inherit" }}>{f}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest opacity-50 block mb-2">Available Dates</label>
            <div className="flex flex-wrap gap-2">
              {selected.avail.map(d => (
                <button key={d} onClick={() => setBooked(d)} className="px-3 py-1.5 rounded-lg text-sm transition-all"
                  style={{ background: booked === d ? "var(--accent)" : "rgba(128,128,128,0.15)", color: booked === d ? "#fff" : "inherit" }}>{d}</button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button onClick={() => booked && setStep(2)} className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: booked ? "var(--accent)" : "rgba(128,128,128,0.3)" }}>Next →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-sm opacity-50 mb-4">The publisher will review your creative before the ad goes live.</p>
          <label className="text-xs uppercase tracking-widest opacity-50 block mb-2">Ad Copy</label>
          <textarea value={adText} onChange={e => setAdText(e.target.value)} placeholder="Write your ad headline and body text..."
            className="w-full px-4 py-3 rounded-xl text-sm mb-3" rows={3}
            style={{ background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.15)", color: "inherit", resize: "vertical" }} />
          <label className="text-xs uppercase tracking-widest opacity-50 block mb-2">Destination URL</label>
          <input value={adLink} onChange={e => setAdLink(e.target.value)} placeholder="https://yoursite.com/offer"
            className="w-full px-4 py-2.5 rounded-xl text-sm font-mono mb-3"
            style={{ background: "rgba(128,128,128,0.08)", border: "1px solid rgba(128,128,128,0.15)", color: "inherit" }} />
          <label className="text-xs uppercase tracking-widest opacity-50 block mb-2">Image (optional)</label>
          <div className="rounded-xl border-2 border-dashed p-6 text-center opacity-40 mb-4" style={{ borderColor: "var(--accent)" }}>
            Drop image here or click to upload
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setStep(1)} className="px-5 py-2 rounded-xl text-sm font-medium" style={{ background: "rgba(128,128,128,0.1)" }}>← Back</button>
            <button onClick={() => setStep(3)} className="px-6 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--accent)" }}>Preview & Pay →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(128,128,128,0.06)", border: "1px solid rgba(128,128,128,0.1)" }}>
            <div className="text-xs uppercase tracking-widest opacity-40 mb-2">Order Summary</div>
            <div className="flex justify-between text-sm py-1"><span>{selected.name} · {format}</span><span>{booked}</span></div>
            <div className="flex justify-between text-sm py-1"><span>Ad placement ({pricingMode})</span><span>${price}</span></div>
            <div className="flex justify-between text-sm py-1 opacity-50"><span>Platform fee (15%)</span><span>${platformFee}</span></div>
            <div className="flex justify-between font-semibold text-base pt-2 mt-2" style={{ borderTop: "1px solid rgba(128,128,128,0.15)" }}>
              <span>Total</span><span style={{ color: "var(--accent)" }}>${total}</span>
            </div>
          </div>
          {adText && (
            <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(128,128,128,0.06)" }}>
              <div className="text-xs uppercase tracking-widest opacity-40 mb-2">Ad Preview</div>
              <p className="text-sm">{adText}</p>
              {adLink && <p className="text-xs font-mono opacity-50 mt-1">{adLink}</p>}
            </div>
          )}
          <div className="rounded-xl p-3 mb-4 flex items-start gap-2" style={{ background: "rgba(251,191,36,0.1)" }}>
            <span className="text-amber-500 text-lg">⚠</span>
            <p className="text-xs opacity-70">After payment, the publisher will review your ad creative. You will be notified once approved. If declined, you receive a full refund.</p>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setStep(2)} className="px-5 py-2 rounded-xl text-sm font-medium" style={{ background: "rgba(128,128,128,0.1)" }}>← Back</button>
            <button onClick={() => setStep(4)} className="w-48 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ background: "#10b981" }}>Confirm & Pay ${total}</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-xl font-semibold mb-1" style={{ fontFamily: "'Fraunces'" }}>Booking Submitted!</div>
          <p className="text-sm opacity-50 mb-1">Your ad creative has been sent to <strong>{selected.name}</strong> for approval.</p>
          <p className="text-xs opacity-40">You will receive an email notification within 24 hours.</p>
        </div>
      )}
    </div>
  );
}

function Marketplace() {
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState(null);
  const [pricingMode, setPricingMode] = useState("Fixed Price");
  const filtered = cat === "All" ? NEWSLETTERS : NEWSLETTERS.filter(n => n.category === cat);

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: "'Fraunces'" }}>Newsletter Marketplace</h2>
          <p className="opacity-50 text-sm">Browse, filter, and book ad placements across verified newsletters.</p>
        </div>
        <PricingToggle mode={pricingMode} setMode={setPricingMode} />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: cat === c ? "var(--accent)" : "var(--card)",
              color: cat === c ? "#fff" : "inherit",
              opacity: cat === c ? 1 : 0.7
            }}>{c}</button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map(n => (
          <div key={n.id} onClick={() => setSelected(selected?.id === n.id ? null : n)} className="rounded-2xl p-5 cursor-pointer transition-all hover:scale-[1.01]"
            style={{ background: "var(--card)", border: selected?.id === n.id ? "2px solid var(--accent)" : "2px solid transparent" }}>
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-lg" style={{ fontFamily: "'Fraunces'" }}>{n.name}</span>
                  {n.verified && <Badge color="emerald">✓ Verified</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge color="slate">{n.category}</Badge>
                  {n.verified && <span className="text-xs opacity-30">via {n.platform} · synced {n.lastSync}</span>}
                </div>
              </div>
              <div className="text-right">
                <PriceDisplay n={n} mode={pricingMode} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div><div className="text-xs opacity-40 uppercase tracking-wider">Subscribers</div><div className="text-lg font-semibold">{n.subs.toLocaleString()}</div></div>
              <div>
                <div className="text-xs opacity-40 uppercase tracking-wider flex items-center gap-1">
                  Open Rate
                  {n.verified && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" title="Auto-verified via API" />}
                </div>
                <div className="text-lg font-semibold">{n.or}%</div>
              </div>
              <div>
                <div className="text-xs opacity-40 uppercase tracking-wider flex items-center gap-1">
                  CTR
                  {n.verified && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" title="Auto-verified via API" />}
                </div>
                <div className="text-lg font-semibold">{n.ctr}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && <BookingFlow selected={selected} pricingMode={pricingMode} />}
    </div>
  );
}

function BundlesPage() {
  const [selectedBundle, setSelectedBundle] = useState(null);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: "'Fraunces'" }}>Niche Bundles</h2>
      <p className="opacity-50 text-sm mb-6">Book multiple newsletters in one click for broader reach and a bundle discount.</p>
      <div className="grid gap-4">
        {BUNDLES.map(b => {
          const nls = NEWSLETTERS.filter(n => b.newsletters.includes(n.id));
          const origPrice = nls.reduce((s, n) => s + n.price, 0);
          return (
            <div key={b.id} className="rounded-2xl p-6 transition-all cursor-pointer hover:scale-[1.005]"
              onClick={() => setSelectedBundle(selectedBundle === b.id ? null : b.id)}
              style={{ background: "var(--card)", border: selectedBundle === b.id ? "2px solid var(--accent)" : "2px solid transparent" }}>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold" style={{ fontFamily: "'Fraunces'" }}>{b.name}</span>
                    <Badge color="indigo">-{b.discount}%</Badge>
                  </div>
                  <p className="text-sm opacity-50">{b.desc}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs line-through opacity-30">${origPrice}</div>
                  <div className="text-2xl font-bold" style={{ color: "var(--accent)", fontFamily: "'Fraunces'" }}>${b.totalPrice}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {nls.map(n => (
                  <div key={n.id} className="px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5" style={{ background: "rgba(128,128,128,0.08)" }}>
                    <span>{n.name}</span>
                    <span className="opacity-30">·</span>
                    <span className="opacity-50">{n.subs.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm"><span className="font-semibold">{b.totalSubs.toLocaleString()}</span><span className="opacity-40"> total subscribers</span></div>
                {selectedBundle === b.id && (
                  <button className="px-6 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--accent)" }}>
                    Book Bundle — ${b.totalPrice}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PublisherDashboard() {
  const [activeNl] = useState(NEWSLETTERS[0]);
  const [approvalView, setApprovalView] = useState(null);
  const pendingAds = [
    { id: "P1", advertiser: "Acme SaaS", format: "Sponsored Slot", date: "2026-04-21", budget: 280, adText: "Supercharge your workflow with Acme — the #1 rated tool for SaaS teams. Try free for 30 days.", link: "https://acme.io/try" },
    { id: "P2", advertiser: "GreenTech AB", format: "Deep Dive", date: "2026-04-28", budget: 520, adText: "How GreenTech is helping Nordic companies cut energy costs by 40%. A deep dive into sustainable infrastructure.", link: "https://greentech.se/case-study" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: "'Fraunces'" }}>Publisher Dashboard</h2>
      <p className="opacity-50 text-sm mb-6">Manage your newsletter, availability, and incoming ad requests.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Subscribers" value={activeNl.subs.toLocaleString()} />
        <StatCard label="Open Rate" value={`${activeNl.or}%`} sub={`Auto-synced via ${activeNl.platform}`} />
        <StatCard label="CTR" value={`${activeNl.ctr}%`} sub={`Updated ${activeNl.lastSync}`} />
        <StatCard label="Revenue (MTD)" value="$960" sub="3 placements" />
      </div>

      <div className="rounded-2xl p-5 mb-6" style={{ background: "var(--card)" }}>
        <h3 className="font-semibold mb-3" style={{ fontFamily: "'Fraunces'" }}>Integration Status</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { name: "Mailchimp", connected: true, lastPull: "2 min ago", subs: "12,400", or: "48.2%" },
            { name: "Substack", connected: false },
            { name: "Beehiiv", connected: false },
          ].map(t => (
            <div key={t.name} className="px-4 py-3 rounded-xl flex-1 min-w-[160px]" style={{ background: "rgba(128,128,128,0.06)" }}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${t.connected ? "bg-emerald-400" : "bg-slate-300"}`} />
                <span className="text-sm font-medium">{t.name}</span>
              </div>
              {t.connected ? (
                <div className="text-xs opacity-40 ml-4">
                  Last pull: {t.lastPull}<br />Subs: {t.subs} · OR: {t.or}
                </div>
              ) : (
                <div className="ml-4"><button className="text-xs font-medium mt-1" style={{ color: "var(--accent)" }}>+ Connect</button></div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs opacity-30 mt-3">Stats are pulled automatically every 15 minutes via API. Manual overrides are disabled to ensure accuracy.</p>
      </div>

      <div className="rounded-2xl p-5 mb-6" style={{ background: "var(--card)" }}>
        <h3 className="font-semibold mb-3" style={{ fontFamily: "'Fraunces'" }}>Availability Calendar</h3>
        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} className="text-xs opacity-40 font-medium">{d}</div>)}
          {Array.from({ length: 28 }, (_, i) => {
            const day = i + 1;
            const isAvail = [1, 8, 15, 22].includes(day);
            const isBooked = [3, 10].includes(day);
            return (
              <div key={i} className="py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                style={{
                  background: isAvail ? "rgba(16,185,129,0.15)" : isBooked ? "rgba(239,68,68,0.12)" : "transparent",
                  color: isAvail ? "#10b981" : isBooked ? "#ef4444" : "inherit",
                  opacity: isAvail || isBooked ? 1 : 0.35
                }}>{day}</div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-xs opacity-50">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-400 inline-block" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-400 inline-block" /> Booked</span>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: "var(--card)" }}>
        <h3 className="font-semibold mb-3" style={{ fontFamily: "'Fraunces'" }}>Pending Approval</h3>
        {pendingAds.map((a, i) => (
          <div key={a.id} style={{ borderTop: i ? "1px solid rgba(128,128,128,0.12)" : "none" }}>
            <div className="flex items-center justify-between flex-wrap gap-3 py-3">
              <div>
                <div className="font-medium">{a.advertiser}</div>
                <div className="text-xs opacity-40">{a.format} · {a.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold" style={{ color: "var(--accent)" }}>${a.budget}</span>
                <button onClick={(e) => { e.stopPropagation(); setApprovalView(approvalView === a.id ? null : a.id); }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: "rgba(128,128,128,0.1)" }}>
                  {approvalView === a.id ? "Hide" : "Review"} Creative
                </button>
                <button className="px-4 py-1.5 rounded-full text-sm font-medium text-white" style={{ background: "#10b981" }}>Approve</button>
                <button className="px-4 py-1.5 rounded-full text-sm font-medium" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>Decline</button>
              </div>
            </div>
            {approvalView === a.id && (
              <div className="ml-0 mb-3 p-4 rounded-xl" style={{ background: "rgba(128,128,128,0.05)", border: "1px dashed rgba(128,128,128,0.2)" }}>
                <div className="text-xs uppercase tracking-widest opacity-40 mb-2">Ad Creative Preview</div>
                <p className="text-sm mb-1">{a.adText}</p>
                <p className="text-xs font-mono opacity-40">{a.link}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Tracking() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: "'Fraunces'" }}>Tracking & Reports</h2>
      <p className="opacity-50 text-sm mb-6">Unique tracking links, real-time analytics, and post-campaign reports.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Campaigns" value="14" />
        <StatCard label="Avg. Open Rate" value="47.3%" />
        <StatCard label="Total Clicks" value="3,241" />
        <StatCard label="Total Leads" value="182" />
      </div>

      <div className="rounded-2xl p-5 mb-6" style={{ background: "var(--card)" }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: "'Fraunces'" }}>Campaign History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-widest opacity-40 text-left">
                <th className="pb-3 pr-4">ID</th><th className="pb-3 pr-4">Newsletter</th><th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Reached</th><th className="pb-3 pr-4">Opened</th><th className="pb-3 pr-4">Clicks</th>
                <th className="pb-3 pr-4">Leads</th><th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map(c => (
                <tr key={c.id} style={{ borderTop: "1px solid rgba(128,128,128,0.1)" }}>
                  <td className="py-3 pr-4 font-mono text-xs">{c.id}</td>
                  <td className="py-3 pr-4 font-medium">{c.newsletter}</td>
                  <td className="py-3 pr-4 opacity-60">{c.date}</td>
                  <td className="py-3 pr-4">{c.reached.toLocaleString()}</td>
                  <td className="py-3 pr-4">{c.opened.toLocaleString()}</td>
                  <td className="py-3 pr-4 font-semibold" style={{ color: "var(--accent)" }}>{c.clicks}</td>
                  <td className="py-3 pr-4">{c.leads}</td>
                  <td className="py-3">
                    <Badge color={c.status === "completed" ? "emerald" : "amber"}>{c.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: "var(--card)" }}>
        <h3 className="font-semibold mb-3" style={{ fontFamily: "'Fraunces'" }}>UTM Link Generator</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {["utm_source", "utm_medium", "utm_campaign", "utm_content"].map(p => (
            <div key={p}>
              <label className="text-xs opacity-40 uppercase tracking-wider block mb-1">{p}</label>
              <input readOnly value={p === "utm_source" ? "newsletter_network" : p === "utm_medium" ? "email" : p === "utm_campaign" ? "spring_2026" : "sponsored_slot"}
                className="w-full px-4 py-2 rounded-xl text-sm font-mono" style={{ background: "rgba(128,128,128,0.1)", border: "none", color: "inherit" }} />
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl font-mono text-xs break-all" style={{ background: "rgba(128,128,128,0.08)" }}>
          https://yoursite.com/offer?utm_source=newsletter_network&utm_medium=email&utm_campaign=spring_2026&utm_content=sponsored_slot
        </div>
      </div>
    </div>
  );
}

function Admin() {
  const pubs = NEWSLETTERS.map(n => ({ ...n, status: n.verified ? "Verified" : "Pending Review" }));
  const totalRev = 4820;
  const platformCut = Math.round(totalRev * 0.15);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: "'Fraunces'" }}>Admin Panel</h2>
      <p className="opacity-50 text-sm mb-6">Verify publishers, enforce quality standards, and manage ad formats.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Publishers" value="6" />
        <StatCard label="Verified" value="5" />
        <StatCard label="Pending" value="1" />
        <StatCard label="Platform Revenue" value={`$${platformCut}`} sub={`15% of $${totalRev.toLocaleString()} GMV`} />
      </div>

      <div className="rounded-2xl p-5 mb-6" style={{ background: "rgba(224,122,66,0.06)", border: "1px solid rgba(224,122,66,0.15)" }}>
        <h3 className="font-semibold mb-2" style={{ fontFamily: "'Fraunces'" }}>Platform Fee Structure</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium">Advertiser sees</div>
            <div className="opacity-50">Base price + 15% platform fee shown separately at checkout</div>
          </div>
          <div>
            <div className="font-medium">Publisher receives</div>
            <div className="opacity-50">100% of the base price — fee is charged on top, not deducted</div>
          </div>
          <div>
            <div className="font-medium">Platform keeps</div>
            <div className="opacity-50">15% fee added at checkout — fully transparent to both sides</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5 mb-6" style={{ background: "var(--card)" }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: "'Fraunces'" }}>Publisher Verification</h3>
        {pubs.map((n, i) => (
          <div key={n.id} className="flex items-center justify-between flex-wrap gap-3 py-3" style={{ borderTop: i ? "1px solid rgba(128,128,128,0.1)" : "none" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: "rgba(128,128,128,0.1)" }}>
                {n.name[0]}
              </div>
              <div>
                <div className="font-medium">{n.name}</div>
                <div className="text-xs opacity-40">{n.subs.toLocaleString()} subs · OR {n.or}% · via {n.platform}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge color={n.verified ? "emerald" : "amber"}>{n.status}</Badge>
              {!n.verified && <button className="px-4 py-1.5 rounded-full text-sm font-medium text-white" style={{ background: "var(--accent)" }}>Verify</button>}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-5" style={{ background: "var(--card)" }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: "'Fraunces'" }}>Standardized Ad Formats</h3>
        {[
          { name: "Sponsored Slot", desc: "Short text block placed mid-newsletter. Best for awareness.", color: "sky" },
          { name: "Shoutout", desc: "Featured at the top of the newsletter. High visibility.", color: "violet" },
          { name: "Deep Dive", desc: "Entire newsletter dedicated to one product/service. Premium.", color: "rose" },
        ].map((f, i) => (
          <div key={i} className="flex items-start gap-3 py-3" style={{ borderTop: i ? "1px solid rgba(128,128,128,0.1)" : "none" }}>
            <Badge color={f.color}>{f.name}</Badge>
            <span className="text-sm opacity-60">{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <div style={{
      "--accent": "#e07a42",
      "--card": "rgba(128,128,128,0.06)",
      "--bg": "#faf9f6",
      fontFamily: "'DM Sans', sans-serif",
      background: "var(--bg)",
      color: "#1a1a1a",
      minHeight: "100vh",
    }}>
      <style>{FONTS}</style>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "'Fraunces'" }}>
            <span style={{ color: "var(--accent)" }}>Ad</span>Letter
          </h1>
          <p className="text-sm opacity-40 mt-1">The newsletter advertising network</p>
        </div>

        <nav className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className="px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: tab === i ? "var(--accent)" : "transparent",
                color: tab === i ? "#fff" : "inherit",
                opacity: tab === i ? 1 : 0.55,
              }}>{t}</button>
          ))}
        </nav>

        {tab === 0 && <Marketplace />}
        {tab === 1 && <BundlesPage />}
        {tab === 2 && <PublisherDashboard />}
        {tab === 3 && <Tracking />}
        {tab === 4 && <Admin />}
      </div>
    </div>
  );
}
