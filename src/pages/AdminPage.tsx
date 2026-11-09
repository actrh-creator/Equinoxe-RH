import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BarChart2, CheckCircle, ChevronDown, ChevronRight, Edit2, ExternalLink, Eye, EyeOff,
  FileText, HelpCircle, Image, Inbox, LayoutDashboard, LogOut, Mail, Phone,
  MessageSquare, Plus, Save, Settings, Star, Trash2, Upload, X, XCircle,
  type LucideIcon,
} from 'lucide-react';
import { hasSupabaseConfig, supabase } from '../lib/supabaseClient';
import { slugify } from '../lib/slugify';
import { faqs as staticFaqs, posts, services, testimonials } from '../data/content';
import { RichTextEditor } from '../components/RichTextEditor';
import { ArticleView } from './BlogPages';
import type { BlogPost, FAQ, Testimonial } from '../types';

type Tab = 'dashboard' | 'articles' | 'contacts' | 'avis' | 'faqs' | 'stats' | 'settings';

// ─── SEO filename ────────────────────────────────────────────────────────────
function seoFilename(title: string, category: string): string {
  return [title, category, 'act-rh']
    .map((s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    .filter(Boolean).join('-') + '.webp';
}

// ─── WebP conversion ─────────────────────────────────────────────────────────
function convertToWebP(file: File, quality = 0.88): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('canvas unavailable'));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error('conversion failed')), 'image/webp', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('load failed')); };
    img.src = url;
  });
}

// ─── Cover image uploader ────────────────────────────────────────────────────
function CoverImageUploader({ title, category, value, onChange }: {
  title: string; category: string; value?: string | null; onChange: (url: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPreview(value ?? null); }, [value]);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) { setError('Seules les images sont acceptees.'); return; }
    if (!supabase) { setError('Supabase non configure.'); return; }
    setError(null); setUploading(true);
    try {
      const webpBlob = await convertToWebP(file);
      const filename = seoFilename(title || 'article', category || 'blog');
      const { error: uploadError } = await supabase.storage.from('blog-covers').upload(filename, webpBlob, { contentType: 'image/webp', upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('blog-covers').getPublicUrl(filename);
      setPreview(data.publicUrl);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur upload');
    } finally { setUploading(false); }
  }

  return (
    <div className="grid gap-2">
      <p className="text-sm font-semibold text-ink">Photo de couverture</p>
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-sand">
          <img src={preview} alt="Apercu" className="aspect-[16/7] w-full object-cover" />
          <button type="button" onClick={() => { setPreview(null); onChange(''); }} className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow hover:bg-white"><X size={14} /></button>
          <p className="truncate bg-white/90 px-3 py-1.5 text-xs font-mono text-anthracite/70">{preview}</p>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 transition ${dragging ? 'border-sage-dark bg-rose-50' : 'border-sand bg-ivory hover:border-sage-dark/50'}`}
        >
          {uploading ? <div className="h-8 w-8 animate-spin rounded-full border-4 border-sand border-t-sage-dark" /> : <Upload size={28} className="text-sage-dark" />}
          <div className="text-center">
            <p className="text-sm font-semibold text-ink">{uploading ? 'Conversion et upload...' : 'Glissez une image ou cliquez'}</p>
            <p className="mt-1 text-xs text-anthracite/60">PNG, JPG — converti en WebP nomme automatiquement</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

// ─── Root admin ──────────────────────────────────────────────────────────────
export function AdminPage() {
  const [session, setSession] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const localMode = !hasSupabaseConfig || !supabase;
  const ADMIN_EMAIL = 'admin@actrh.fr';

  useEffect(() => {
    if (!supabase) { setSession(true); return; }
    supabase.auth.getSession().then(({ data }) => setSession(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(Boolean(s)));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!localMode && supabase && !session) {
    return (
      <AdminShell>
        <div className="flex min-h-screen items-center justify-center px-4 py-12">
          <form
            className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-[0_32px_80px_rgba(0,0,0,0.10)] sm:p-10"
            onSubmit={async (e) => { e.preventDefault(); await supabase!.auth.signInWithPassword({ email: ADMIN_EMAIL, password }); }}
          >
            <div className="mb-8 text-center">
              <p className="font-serif text-3xl font-semibold text-ink">Administration</p>
              <p className="mt-1 font-serif text-xl text-sage-dark">ACT&RH</p>
            </div>
            <input
              className="w-full rounded-2xl border border-ink/15 bg-ivory px-5 py-4 text-center text-sm font-semibold tracking-widest text-ink outline-none transition focus:border-sage-dark focus:bg-white focus:ring-2 focus:ring-sage-dark/20"
              type="password" placeholder="Mot de passe" value={password}
              onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
            />
            <button type="submit" className="mt-4 w-full rounded-2xl bg-ink py-4 text-sm font-bold text-white transition hover:bg-sage-dark active:scale-[0.98]">Connexion</button>
          </form>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
        <aside className="border-r border-ink/10 bg-white p-5">
          <p className="font-serif text-2xl text-ink">ACT&RH Admin</p>
          <nav className="mt-8 grid gap-1">
            {NAV_ITEMS.map(({ key, label, Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${tab === key ? 'bg-sage/20 text-ink' : 'text-anthracite/60 hover:bg-ivory hover:text-ink'}`}
              >
                <Icon size={16} className="shrink-0" />{label}
              </button>
            ))}
          </nav>
          {!localMode && supabase ? (
            <button onClick={() => supabase!.auth.signOut()} className="mt-8 flex items-center gap-2 text-sm font-semibold text-anthracite/60 hover:text-ink">
              <LogOut size={16} /> Deconnexion
            </button>
          ) : null}
        </aside>
        <main className="p-6 md:p-10">
          {tab === 'dashboard' && <Dashboard />}
          {tab === 'articles' && <BlogAdmin />}
          {tab === 'contacts' && <ContactsAdmin />}
          {tab === 'avis' && <AvisAdmin />}
          {tab === 'faqs' && <FaqAdmin />}
          {tab === 'stats' && <StatsAdmin />}
          {tab === 'settings' && <SettingsAdmin />}
        </main>
      </div>
    </AdminShell>
  );
}

const NAV_ITEMS: { key: Tab; label: string; Icon: LucideIcon }[] = [
  { key: 'dashboard', label: 'Tableau de bord', Icon: LayoutDashboard },
  { key: 'articles', label: 'Articles', Icon: FileText },
  { key: 'contacts', label: 'Formulaire de contact', Icon: Inbox },
  { key: 'avis', label: 'Avis clients', Icon: Star },
  { key: 'faqs', label: 'FAQ', Icon: HelpCircle },
  { key: 'stats', label: 'Statistiques', Icon: BarChart2 },
  { key: 'settings', label: 'Parametres', Icon: Settings },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ivory text-anthracite">{children}</div>;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [counts, setCounts] = useState({ articles: 0, contacts: 0, avis: 0, faqs: 0 });
  useEffect(() => {
    if (!supabase) return;
    Promise.all([
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }),
      supabase.from('faqs').select('id', { count: 'exact', head: true }),
    ]).then(([a, l, t, f]) => setCounts({ articles: a.count ?? 0, contacts: l.count ?? 0, avis: t.count ?? 0, faqs: f.count ?? 0 }));
  }, []);
  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">Tableau de bord</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[
          { label: 'Articles', value: counts.articles, Icon: FileText },
          { label: 'Demandes de contact', value: counts.contacts, Icon: Inbox },
          { label: 'Avis clients', value: counts.avis, Icon: Star },
          { label: 'FAQ', value: counts.faqs, Icon: HelpCircle },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-anthracite/50"><Icon size={16} /><p className="text-sm">{label}</p></div>
            <p className="mt-3 text-4xl font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Blog admin ───────────────────────────────────────────────────────────────
const EMPTY_POST: Partial<BlogPost> = {
  title: '', slug: '', excerpt: '', content: '', cover_image_url: '',
  category: 'Conseil RH', tags: [], seo_title: '', seo_description: '',
  status: 'draft', featured: false, published_at: null,
};
const CATEGORIES = ['Conseil RH', 'Management', 'Accompagnement du changement', 'Coaching professionnel', 'Bilan de competences', 'Formations & ateliers'];

function BlogAdmin() {
  const [rows, setRows] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<Partial<BlogPost>>(EMPTY_POST);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [preview, setPreview] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const load = useCallback(async () => {
    if (!supabase) { setRows(posts); return; }
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setRows((data && data.length > 0 ? data : posts) as BlogPost[]);
  }, []);

  async function seedPosts() {
    if (!supabase) return;
    for (const post of posts) {
      await supabase.from('blog_posts').upsert(post, { onConflict: 'id' });
    }
    await load();
    showToast('Articles importés dans Supabase');
  }

  useEffect(() => { load(); }, [load]);

  function startEdit(post: BlogPost) { setForm({ ...post }); setTagsInput((post.tags ?? []).join(', ')); setEditing(true); }
  function cancel() { setEditing(false); setPreview(false); setForm(EMPTY_POST); setTagsInput(''); }

  async function save() {
    if (!form.title?.trim()) return;
    setSaving(true);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const now = new Date().toISOString();
    const payload: BlogPost = {
      id: form.id ?? crypto.randomUUID(), title: form.title!, slug: form.slug || slugify(form.title!),
      excerpt: form.excerpt ?? '', content: form.content ?? '', cover_image_url: form.cover_image_url ?? null,
      category: form.category ?? 'Conseil RH', tags, seo_title: form.seo_title ?? null,
      seo_description: form.seo_description ?? null, status: form.status ?? 'draft',
      featured: form.featured ?? false,
      published_at: form.status === 'published' ? (form.published_at ?? now) : (form.published_at ?? null),
    };
    if (supabase) {
      const { error } = await supabase.from('blog_posts').upsert(payload, { onConflict: 'id' });
      if (error) { showToast('Erreur : ' + error.message); setSaving(false); return; }
      await load();
    } else { setRows((prev) => [payload, ...prev.filter((r) => r.id !== payload.id)]); }
    showToast('Article enregistre'); setSaving(false); cancel();
  }

  async function toggleStatus(post: BlogPost) {
    const next = post.status === 'published' ? 'draft' : 'published';
    const update = { status: next, published_at: next === 'published' ? (post.published_at ?? new Date().toISOString()) : post.published_at };
    if (supabase) { await supabase.from('blog_posts').update(update).eq('id', post.id); await load(); }
    else setRows((prev) => prev.map((r) => r.id === post.id ? { ...r, ...update } as BlogPost : r));
  }

  async function remove(id: string) {
    if (!window.confirm('Supprimer cet article ?')) return;
    if (supabase) { await supabase.from('blog_posts').delete().eq('id', id); await load(); }
    else setRows((prev) => prev.filter((r) => r.id !== id));
  }

  if (editing) {
    return (
      <div>
        {toast ? <Toast message={toast} /> : null}
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="font-serif text-3xl text-ink">{form.id ? "Modifier l'article" : 'Nouvel article'}</h1>
          <div className="flex gap-2">
            <button onClick={() => setPreview((v) => !v)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${preview ? 'border-sage-dark bg-sage-dark text-white' : 'border-ink/15 hover:bg-white'}`}>
              {preview ? <><Edit2 size={15} />Revenir à l'édition</> : <><Eye size={15} />Aperçu</>}
            </button>
            <button onClick={cancel} className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-white">Annuler</button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-sage-dark disabled:opacity-60">
              <Save size={15} />{saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
        {preview ? (
          <div className="overflow-hidden rounded-2xl border border-sand shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
            <p className="bg-ink px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-white">Aperçu — tel que l'article apparaîtra sur le site (rien n'est encore enregistré)</p>
            <div onClickCapture={(e) => { if ((e.target as HTMLElement).closest('a')) e.preventDefault(); }}>
              <ArticleView post={{ ...EMPTY_POST, ...form, tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean) } as BlogPost} />
            </div>
          </div>
        ) : null}
        <div className={`grid gap-5 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)] md:p-8 ${preview ? 'hidden' : ''}`}>
          <CoverImageUploader title={form.title ?? ''} category={form.category ?? 'blog'} value={form.cover_image_url} onChange={(url) => setForm((f) => ({ ...f, cover_image_url: url }))} />
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Titre *"><input className="field" value={form.title ?? ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))} /></Field>
            <Field label="Slug (URL)"><input className="field font-mono text-sm" value={form.slug ?? ''} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} /></Field>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Categorie">
              <select className="field" value={form.category ?? 'Conseil RH'} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
            </Field>
            <Field label="Tags (virgule)"><input className="field" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="management, RH, changement" /></Field>
          </div>
          <Field label="Extrait"><textarea className="field min-h-[80px] resize-y" value={form.excerpt ?? ''} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} /></Field>
          <div className="grid gap-1.5 text-sm font-semibold text-ink">
            Contenu
            <RichTextEditor value={form.content ?? ''} onChange={(html) => setForm((f) => ({ ...f, content: html }))} />
            <p className="text-xs font-normal text-anthracite/60">Vous pouvez coller directement un texte depuis Word : titres, gras, italique, souligné, listes et liens sont conservés, les polices et couleurs de Word sont remplacées par celles du site.</p>
          </div>
          <div className="border-t border-sand pt-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-sage-dark">SEO</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Titre SEO"><input className="field" value={form.seo_title ?? ''} onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))} /></Field>
              <Field label="Description SEO"><input className="field" value={form.seo_description ?? ''} onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))} /></Field>
            </div>
          </div>
          <div className="border-t border-sand pt-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-sage-dark">Publication</p>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={form.status === 'published'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked ? 'published' : 'draft' }))} className="accent-sage-dark" />Publie
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={form.featured ?? false} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} className="accent-sage-dark" />Article a la une
              </label>
              <Field label="Date de publication"><input type="date" className="field" value={form.published_at?.slice(0, 10) ?? ''} onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value || null }))} /></Field>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast ? <Toast message={toast} /> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-4xl text-ink">Articles</h1>
        <div className="flex gap-2">
          {supabase ? (
            <button onClick={seedPosts} className="rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-anthracite/70 hover:border-sage-dark/40 hover:text-ink">
              Importer les articles du site
            </button>
          ) : null}
          <button onClick={() => { setForm(EMPTY_POST); setTagsInput(''); setEditing(true); }} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-sage-dark">
            <Plus size={16} />Nouvel article
          </button>
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-sand bg-white p-10 text-center text-anthracite/60">Aucun article. Cliquez sur "Importer les articles du site" ou "Nouvel article".</div>
      ) : (
        <div className="mt-6 grid gap-3">
          {rows.map((post) => (
            <div key={post.id} className="flex items-start gap-4 rounded-2xl border border-sand bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              {post.cover_image_url ? (
                <img src={post.cover_image_url} alt="" className="h-16 w-24 flex-shrink-0 rounded-xl object-cover" />
              ) : (
                <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-sand"><Image size={20} className="text-anthracite/40" /></div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-sand text-anthracite/60'}`}>
                    {post.status === 'published' ? 'Publie' : 'Brouillon'}
                  </span>
                  {post.featured ? <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">A la une</span> : null}
                  <span className="text-xs text-anthracite/50">{post.category}</span>
                </div>
                <p className="mt-1 truncate font-semibold text-ink">{post.title}</p>
                <p className="mt-0.5 text-xs text-anthracite/50">/blog/{post.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <IconBtn title={post.status === 'published' ? 'Depublier' : 'Publier'} onClick={() => toggleStatus(post)}>
                  {post.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                </IconBtn>
                <IconBtn title="Modifier" onClick={() => startEdit(post)}><Edit2 size={15} /></IconBtn>
                <IconBtn title="Supprimer" onClick={() => remove(post.id)} danger><Trash2 size={15} /></IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Contacts (leads) ─────────────────────────────────────────────────────────
function ContactsAdmin() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('leads').select('*').order('created_at', { ascending: false }).then(({ data }) => setRows(data ?? []));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">Formulaire de contact</h1>
      <p className="mt-2 text-sm text-anthracite/60">Toutes les demandes recues via le formulaire de contact du site.</p>
      {!supabase ? (
        <p className="mt-6 rounded-2xl bg-white p-5 text-sm text-anthracite/70">Les demandes apparaitront ici des que Supabase est connecte.</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-white p-5 text-sm text-anthracite/70">Aucune demande pour le moment.</p>
      ) : (
        <div className="mt-6 grid gap-3">
          {rows.map((r, i) => {
            const id = String(r.id ?? i);
            const isOpen = expanded === id;
            return (
              <div key={id} className="rounded-2xl border border-sand bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <button
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  onClick={() => setExpanded(isOpen ? null : id)}
                >
                  <MessageSquare size={18} className="shrink-0 text-sage-dark" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink">{String(r.first_name ?? '')} {String(r.last_name ?? '')}</p>
                    <p className="text-xs text-anthracite/60">{String(r.email ?? '')} — {String(r.need_type ?? '')}</p>
                  </div>
                  <span className="shrink-0 text-xs text-anthracite/40">{r.created_at ? new Date(String(r.created_at)).toLocaleDateString('fr-FR') : ''}</span>
                  {isOpen ? <ChevronDown size={16} className="shrink-0 text-anthracite/40 rotate-180" /> : <ChevronRight size={16} className="shrink-0 text-anthracite/40" />}
                </button>
                {isOpen ? (
                  <div className="border-t border-sand px-5 pb-5 pt-4">
                    <div className="grid gap-3 sm:grid-cols-3 text-sm">
                      {[
                        ['Profil', String(r.profile_type ?? '-')],
                        ['Besoin', String(r.need_type ?? '-')],
                        ['Contact préféré', String(r.preferred_contact ?? '-')],
                        ['Téléphone', String(r.phone ?? '-')],
                        ['Source', String(r.source ?? '-')],
                      ].map(([label, val]) => (
                        <div key={label}><p className="text-xs font-bold text-anthracite/50">{label}</p><p className="font-semibold text-ink">{val}</p></div>
                      ))}
                    </div>
                    {r.message ? (
                      <div className="mt-4 rounded-xl bg-ivory p-4 text-sm leading-6 text-anthracite/80">
                        <p className="mb-1 text-xs font-bold text-anthracite/50">Message</p>
                        {String(r.message)}
                      </div>
                    ) : null}
                    {/* Boutons d'action */}
                    <div className="mt-5 flex flex-wrap gap-3">
                      <a
                        href={`mailto:${String(r.email ?? '')}?subject=Suite%20%C3%A0%20votre%20demande%20ACT%26RH&body=Bonjour%20${encodeURIComponent(String(r.first_name ?? ''))}%2C%0A%0A`}
                        className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-dark transition"
                      >
                        <Mail size={15} />
                        Répondre par email
                      </a>
                      {r.phone && String(r.phone).trim() && String(r.phone) !== '-' ? (
                        <a
                          href={`tel:${String(r.phone)}`}
                          className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ivory transition"
                        >
                          <Phone size={15} />
                          Appeler
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Avis clients ─────────────────────────────────────────────────────────────
function AvisAdmin() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<Partial<Testimonial>>({ client_name: '', client_role: '', client_type: 'Google', content: '', rating: 5, status: 'draft', is_placeholder: false, display_order: 1 });
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = useCallback(async () => {
    if (!supabase) { setRows(testimonials); return; }
    const { data } = await supabase.from('testimonials').select('*').order('display_order');
    setRows((data ?? testimonials) as Testimonial[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!form.client_name?.trim()) return;
    const payload = { ...form, id: form.id ?? crypto.randomUUID() } as Testimonial;
    if (supabase) { await supabase.from('testimonials').upsert(payload, { onConflict: 'id' }); await load(); }
    else setRows((prev) => [payload, ...prev.filter((r) => r.id !== payload.id)]);
    showToast('Avis enregistre');
    setForm({ client_name: '', client_role: '', client_type: 'Google', content: '', rating: 5, status: 'draft', is_placeholder: false, display_order: 1 });
  }

  async function toggleStatus(item: Testimonial) {
    const next = item.status === 'published' ? 'draft' : 'published';
    if (supabase) { await supabase.from('testimonials').update({ status: next }).eq('id', item.id); await load(); }
    else setRows((prev) => prev.map((r) => r.id === item.id ? { ...r, status: next } as Testimonial : r));
  }

  async function remove(id: string) {
    if (!window.confirm('Supprimer cet avis ?')) return;
    if (supabase) { await supabase.from('testimonials').delete().eq('id', id); await load(); }
    else setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      {toast ? <Toast message={toast} /> : null}
      <h1 className="font-serif text-4xl text-ink">Avis clients</h1>
      <p className="mt-2 text-sm text-anthracite/60">Ajoutez ici les avis Google ou temoignages clients a afficher sur le site.</p>

      <div className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
        <p className="text-xs font-bold uppercase tracking-widest text-sage-dark">Ajouter un avis</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Nom du client *"><input className="field" value={form.client_name ?? ''} onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))} /></Field>
          <Field label="Fonction / Entreprise"><input className="field" value={form.client_role ?? ''} onChange={(e) => setForm((f) => ({ ...f, client_role: e.target.value }))} /></Field>
          <Field label="Source">
            <select className="field" value={form.client_type ?? 'Google'} onChange={(e) => setForm((f) => ({ ...f, client_type: e.target.value }))}>
              {['Google', 'LinkedIn', 'Direct', 'Autre'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Temoignage *"><textarea className="field min-h-[100px]" value={form.content ?? ''} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} /></Field>
          <div className="grid gap-4">
            <Field label="Note (1-5)">
              <div className="flex gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setForm((f) => ({ ...f, rating: n }))}
                    className={`rounded-full p-1 transition ${(form.rating ?? 5) >= n ? 'text-amber-400' : 'text-sand'}`}>
                    <Star size={24} className={(form.rating ?? 5) >= n ? 'fill-amber-400' : ''} />
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Statut">
              <select className="field" value={form.status ?? 'draft'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'draft' | 'published' }))}>
                <option value="draft">Brouillon</option>
                <option value="published">Publie</option>
              </select>
            </Field>
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={save} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-dark">
            <Plus size={15} />Ajouter l'avis
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {rows.map((item) => (
          <div key={item.id} className="flex items-start gap-4 rounded-2xl border border-sand bg-white p-4">
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${item.client_type === 'Google' ? 'bg-blue-50 text-blue-600' : item.client_type === 'LinkedIn' ? 'bg-sky-50 text-sky-600' : 'bg-sand text-anthracite/60'}`}>
                {item.client_type || 'Direct'}
              </span>
              <div className="flex">
                {[1,2,3,4,5].map((n) => <Star key={n} size={11} className={item.rating >= n ? 'fill-amber-400 text-amber-400' : 'text-sand'} />)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink">{item.client_name} <span className="text-xs text-anthracite/50">— {item.client_role}</span></p>
              <p className="mt-1 text-sm text-anthracite/70 line-clamp-2">{item.content}</p>
              {item.is_placeholder ? <span className="mt-1 inline-block text-xs text-amber-600">Placeholder — a remplacer</span> : null}
            </div>
            <div className="flex gap-1">
              <IconBtn title={item.status === 'published' ? 'Depublier' : 'Publier'} onClick={() => toggleStatus(item)}>
                {item.status === 'published' ? <CheckCircle size={15} className="text-green-600" /> : <XCircle size={15} />}
              </IconBtn>
              <IconBtn title="Supprimer" onClick={() => remove(item.id)} danger><Trash2 size={15} /></IconBtn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FAQ admin ─────────────────────────────────────────────────────────────────
const FAQ_PAGES = [
  { key: '', label: 'FAQ generale (page /faq)', path: '/faq' },
  { key: 'conseil-rh-entreprises', label: 'Conseil RH entreprises', path: '/services/conseil-rh-entreprises' },
  { key: 'accompagnement-changement', label: 'Accompagnement du changement', path: '/services/accompagnement-changement' },
  { key: 'accompagnement-individuel', label: 'Accompagnement individuel', path: '/services/accompagnement-individuel' },
  { key: 'bilan-de-competences', label: 'Bilan de competences', path: '/services/bilan-de-competences' },
  { key: 'formations-ateliers-codeveloppement', label: 'Formations & ateliers', path: '/services/formations-ateliers-codeveloppement' },
];

function FaqAdmin() {
  const [rows, setRows] = useState<FAQ[]>([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<FAQ>>({ question: '', answer: '', category: 'General', related_page: '', status: 'published', display_order: 99 });
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Merge static + Supabase FAQs
  const loadAll = useCallback(async () => {
    if (!supabase) { setRows(staticFaqs); return; }
    const { data } = await supabase.from('faqs').select('*').order('display_order');
    if (data && data.length > 0) setRows(data as FAQ[]);
    else setRows(staticFaqs);
  }, []);
  useEffect(() => { loadAll(); }, [loadAll]);

  // Seed static FAQs to Supabase if table is empty
  async function seedFaqs() {
    if (!supabase) return;
    const allStaticFaqs = [
      ...staticFaqs,
      ...services.flatMap((s) => s.faqs),
    ];
    for (const faq of allStaticFaqs) {
      await supabase.from('faqs').upsert(faq, { onConflict: 'id' });
    }
    await loadAll();
    showToast('FAQ initiales importees dans Supabase');
  }

  async function saveFaq() {
    if (!form.question?.trim() || !form.answer?.trim()) return;
    const payload = { ...form, id: form.id ?? crypto.randomUUID(), related_page: form.related_page ?? '' } as FAQ;
    if (supabase) { await supabase.from('faqs').upsert(payload, { onConflict: 'id' }); await loadAll(); }
    else setRows((prev) => [payload, ...prev.filter((r) => r.id !== payload.id)]);
    showToast('FAQ enregistree');
    setForm({ question: '', answer: '', category: 'General', related_page: selectedPage, status: 'published', display_order: 99 });
    setShowForm(false);
  }

  async function remove(id: string) {
    if (!window.confirm('Supprimer cette FAQ ?')) return;
    if (supabase) { await supabase.from('faqs').delete().eq('id', id); await loadAll(); }
    else setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const pageInfo = FAQ_PAGES.find((p) => p.key === selectedPage) ?? FAQ_PAGES[0];
  const filteredRows = rows.filter((r) => (r.related_page ?? '') === selectedPage);
  const isEditing = Boolean(form.id);

  function startEdit(item: FAQ) {
    setForm({ ...item });
    setShowForm(true);
    setTimeout(() => document.getElementById('faq-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  function cancelForm() {
    setShowForm(false);
    setForm({ question: '', answer: '', category: 'General', related_page: selectedPage, status: 'published', display_order: 99 });
  }

  return (
    <div>
      {toast ? <Toast message={toast} /> : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink">FAQ</h1>
          <p className="mt-1 text-sm text-anthracite/60">Questions frequentes organisees par page du site.</p>
        </div>
        <div className="flex gap-2">
          {supabase && rows.length <= staticFaqs.length ? (
            <button onClick={seedFaqs} className="rounded-full border border-sage-dark/30 px-4 py-2.5 text-sm font-semibold text-sage-dark hover:bg-sage/10">
              Importer les FAQ initiales
            </button>
          ) : null}
          <button onClick={() => { cancelForm(); setShowForm(true); }}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-sage-dark">
            <Plus size={15} />Ajouter une FAQ
          </button>
        </div>
      </div>

      {/* Page selector */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FAQ_PAGES.map(({ key, label }) => {
          const count = rows.filter((r) => (r.related_page ?? '') === key).length;
          return (
            <button key={key} onClick={() => { setSelectedPage(key); cancelForm(); }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedPage === key ? 'bg-ink text-white' : 'border border-ink/15 bg-white text-ink hover:border-sage-dark/40'}`}
            >
              {label} <span className="ml-1 opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Add / Edit form */}
      {showForm ? (
        <div id="faq-form" className="mt-5 rounded-2xl border border-[#D8C3B5]/30 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="mb-4 text-sm font-bold text-ink">
            {isEditing ? 'Modifier la FAQ' : 'Nouvelle FAQ'}{' '}
            <span className="font-normal text-anthracite/50">— {pageInfo.label}</span>
          </p>
          <div className="grid gap-3">
            <Field label="Question *">
              <input className="field" value={form.question ?? ''} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} />
            </Field>
            <Field label="Reponse *">
              <textarea className="field min-h-[140px]" value={form.answer ?? ''} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Categorie">
                <input className="field" value={form.category ?? ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
              </Field>
              <Field label="Statut">
                <select className="field" value={form.status ?? 'published'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'draft' | 'published' }))}>
                  <option value="published">Publie</option>
                  <option value="draft">Brouillon</option>
                </select>
              </Field>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={cancelForm} className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold hover:bg-ivory">Annuler</button>
            <button onClick={saveFaq} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-sage-dark">
              <Save size={14} />{isEditing ? 'Mettre a jour' : 'Enregistrer'}
            </button>
          </div>
        </div>
      ) : null}

      {/* FAQ list */}
      <div className="mt-4 grid gap-3">
        {filteredRows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-sand bg-white p-8 text-center text-sm text-anthracite/60">
            Aucune FAQ pour <strong>{pageInfo.label}</strong>.<br />Cliquez sur "Ajouter une FAQ" ou "Importer les FAQ initiales".
          </div>
        ) : filteredRows.map((item) => (
          <div key={item.id} className={`rounded-2xl border bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition ${form.id === item.id && showForm ? 'border-[#D8C3B5]/40 ring-1 ring-[#D8C3B5]/20' : 'border-sand'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${item.status === 'published' ? 'bg-green-500' : 'bg-sand'}`} />
                  <p className="font-semibold text-ink">{item.question}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-anthracite/70 pl-4">{item.answer}</p>
                <p className="mt-2 text-xs text-anthracite/40 pl-4">Categorie : {item.category}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <IconBtn title="Modifier" onClick={() => startEdit(item)}><Edit2 size={15} /></IconBtn>
                <IconBtn title="Supprimer" onClick={() => remove(item.id)} danger><Trash2 size={15} /></IconBtn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

// Noms de pages lisibles (au lieu des URL) pour l'espace admin
const PAGE_LABELS: Record<string, string> = {
  '/': 'Accueil',
  '/a-propos': 'À propos',
  '/on-parle-de-nous': 'On parle de nous',
  '/services': 'Services',
  '/blog': 'Blog',
  '/faq': 'FAQ',
  '/temoignages': 'Témoignages',
  '/contact': 'Contact',
  '/conseil-rh-toulouse': 'Conseil RH à Toulouse',
  '/coaching-professionnel-toulouse': 'Coaching professionnel à Toulouse',
  '/bilan-de-competences-toulouse': 'Bilan de compétences à Toulouse',
  '/accompagnement-changement-occitanie': 'Accompagnement du changement — Occitanie',
  '/conseil-rh-a-distance': 'Conseil RH à distance',
  '/mentions-legales': 'Mentions légales',
  '/politique-confidentialite': 'Politique de confidentialité',
  '/cookies': 'Cookies',
  '/cgv-cgu': 'CGV / CGU',
  '/admin': 'Espace admin',
};

// Types d'interactions en clair
const EVENT_LABELS: Record<string, string> = {
  page_view: 'Visite de la page',
  phone_click: 'Clic sur le téléphone',
  email_click: 'Clic sur l’email',
  contact_submit: 'Formulaire de contact envoyé',
  cta_click: 'Clic sur un bouton d’action',
  article_read: 'Article lu',
  bilan_request: 'Demande de bilan de compétences',
  company_request: 'Demande entreprise',
  individual_request: 'Demande particulier',
  scroll_depth: 'Lecture en profondeur',
  section_open: 'Ouverture d’une section',
  blog_card_click: 'Clic sur un article du blog',
  service_card_click: 'Clic sur un service',
};

function prettySlug(s: string) {
  return s.replace(/-/g, ' ').replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

function pageLabel(path: string | null | undefined): string {
  if (!path) return 'Page inconnue';
  const clean = path.split('?')[0].replace(/\/+$/, '') || '/';
  if (PAGE_LABELS[clean]) return PAGE_LABELS[clean];
  const seg = clean.split('/').filter(Boolean);
  if (seg[0] === 'services' && seg[1]) return `Service — ${prettySlug(seg[1])}`;
  if (seg[0] === 'blog' && seg[1]) return `Article — ${prettySlug(seg[1])}`;
  if (seg[0] === 'pour-qui' && seg[1]) return `Pour qui — ${prettySlug(seg[1])}`;
  return clean;
}

function eventLabel(name: string): string {
  return EVENT_LABELS[name] ?? name;
}

type PageStat = {
  path: string;
  label: string;
  count: number;
  recent: { name: string; created_at: string }[];
};

function StatsAdmin() {
  const [leads, setLeads] = useState<Record<string, unknown>[]>([]);
  const [articles, setArticles] = useState<{ published: number; draft: number }>({ published: 0, draft: 0 });
  const [avisCount, setAvisCount] = useState(0);
  const [pageStats, setPageStats] = useState<PageStat[]>([]);
  const [expandedPage, setExpandedPage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('leads').select('*').order('created_at', { ascending: false }).then(({ data }) => setLeads(data ?? []));
    supabase.from('blog_posts').select('status').then(({ data }) => {
      const d = data ?? [];
      setArticles({ published: d.filter((r) => r.status === 'published').length, draft: d.filter((r) => r.status === 'draft').length });
    });
    supabase.from('testimonials').select('id', { count: 'exact', head: true }).then(({ count }) => setAvisCount(count ?? 0));
    supabase
      .from('page_events')
      .select('name, path, created_at')
      .order('created_at', { ascending: false })
      .limit(3000)
      .then(({ data }) => {
        const groups: Record<string, PageStat> = {};
        for (const row of data ?? []) {
          const clean = String(row.path || '/').split('?')[0].replace(/\/+$/, '') || '/';
          const g = groups[clean] ?? (groups[clean] = { path: clean, label: pageLabel(clean), count: 0, recent: [] });
          g.count += 1;
          if (g.recent.length < 20) g.recent.push({ name: row.name, created_at: row.created_at });
        }
        setPageStats(Object.values(groups).sort((a, b) => b.count - a.count));
      });
  }, []);

  // Breakdown helpers
  function breakdown(key: string) {
    const counts: Record<string, number> = {};
    for (const lead of leads) {
      const val = String(lead[key] ?? 'Non renseigné');
      counts[val] = (counts[val] ?? 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }

  const needBreakdown = breakdown('need_type');
  const profileBreakdown = breakdown('profile_type');
  const maxLeads = Math.max(...leads.map(() => 1), ...needBreakdown.map(([, v]) => v));

  return (
    <div>
      <h1 className="font-serif text-4xl text-ink">Statistiques</h1>
      <p className="mt-2 text-sm text-anthracite/60">Données du site et connexion aux outils analytiques.</p>

      {/* Supabase metrics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Demandes reçues', value: leads.length, color: 'bg-sage' },
          { label: 'Articles publiés', value: articles.published, color: 'bg-green-100' },
          { label: 'Articles brouillon', value: articles.draft, color: 'bg-amber-50' },
          { label: 'Avis clients', value: avisCount, color: 'bg-[#D8C3B5]/15' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl ${color} p-6`}>
            <p className="text-sm font-semibold text-anthracite/70">{label}</p>
            <p className="mt-2 text-4xl font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Leads breakdown */}
      {leads.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-anthracite/50">Demandes par besoin</p>
            <div className="grid gap-3">
              {needBreakdown.map(([label, count]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink truncate">{label}</span>
                    <span className="ml-2 shrink-0 font-bold text-anthracite/60">{count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ivory">
                    <div className="h-2 rounded-full bg-[#D8C3B5]" style={{ width: `${(count / maxLeads) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-anthracite/50">Demandes par profil</p>
            <div className="grid gap-3">
              {profileBreakdown.map(([label, count]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-ink truncate">{label}</span>
                    <span className="ml-2 shrink-0 font-bold text-anthracite/60">{count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ivory">
                    <div className="h-2 rounded-full bg-ink" style={{ width: `${(count / maxLeads) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dernières demandes */}
      {leads.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-anthracite/50">Dernières demandes de contact</p>
          <div className="grid gap-2">
            {leads.slice(0, 8).map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-4 rounded-xl border border-sand px-4 py-3 text-sm">
                <span className="font-semibold text-ink">{String(r.first_name ?? '')} {String(r.last_name ?? '')}</span>
                <span className="text-anthracite/60 truncate">{String(r.need_type ?? '-')}</span>
                <span className="shrink-0 text-xs text-anthracite/40">{r.created_at ? new Date(String(r.created_at)).toLocaleDateString('fr-FR') : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clics & interactions — total cumulé, par page */}
      {pageStats.length > 0 && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-anthracite/50">Clics & interactions — total cumulé</p>
          <div className="grid gap-3">
            {pageStats.map(({ path, label, count }) => (
              <div key={path}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink truncate">{label}</span>
                  <span className="ml-2 shrink-0 font-bold text-[#D8C3B5]">{count}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ivory">
                  <div className="h-1.5 rounded-full bg-[#D8C3B5]" style={{ width: `${(count / (pageStats[0]?.count ?? 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activité récente — détail par page (repliable) */}
      {pageStats.length > 0 && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <p className="text-sm font-bold uppercase tracking-widest text-anthracite/50">Activité récente — détail par page</p>
          <p className="mb-4 mt-1 text-xs text-anthracite/40">Cliquez sur une page pour voir l’horaire de ses 20 dernières interactions.</p>
          <div className="grid gap-2">
            {pageStats.map(({ path, label, count, recent }) => {
              const open = expandedPage === path;
              return (
                <div key={path} className="overflow-hidden rounded-xl border border-sand">
                  <button
                    type="button"
                    onClick={() => setExpandedPage(open ? null : path)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition hover:bg-ivory"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {open
                        ? <ChevronDown size={15} className="shrink-0 text-anthracite/40" />
                        : <ChevronRight size={15} className="shrink-0 text-anthracite/40" />}
                      <span className="truncate font-semibold text-ink">{label}</span>
                    </span>
                    <span className="shrink-0 font-bold text-anthracite/60">{count} {count > 1 ? 'clics' : 'clic'}</span>
                  </button>
                  {open && (
                    <ul className="grid gap-1.5 border-t border-sand bg-ivory/40 px-4 py-3">
                      {recent.map((ev, i) => (
                        <li key={i} className="flex items-center justify-between gap-4 text-xs">
                          <span className="truncate text-anthracite/60">{eventLabel(ev.name)}</span>
                          <span className="shrink-0 text-anthracite/40">
                            {new Date(ev.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {pageStats.length === 0 && (
        <div className="mt-8 rounded-2xl border border-sand bg-white p-6 text-center">
          <p className="text-sm text-anthracite/50">Les clics et interactions des visiteurs apparaîtront ici dès la première visite.</p>
        </div>
      )}
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SiteImageUploader({ label, settingKey, description, storagePath, variant = 'photo' }: {
  label: string; settingKey: string; description: string; storagePath: string; variant?: 'photo' | 'logo';
}) {
  const [current, setCurrent] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('value').eq('key', settingKey).single()
      .then(({ data }) => { if (data?.value) setCurrent(data.value); });
  }, [settingKey]);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) { setError('Seules les images sont acceptées.'); return; }
    if (!supabase) { setError('Supabase non configuré.'); return; }
    setError(null); setUploading(true);
    try {
      const webpBlob = await convertToWebP(file);
      const filename = storagePath;
      const { error: upErr } = await supabase.storage.from('site-images').upload(filename, webpBlob, { contentType: 'image/webp', upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('site-images').getPublicUrl(filename);
      const url = data.publicUrl + '?t=' + Date.now();
      await supabase.from('site_settings').upsert({ key: settingKey, value: url }, { onConflict: 'key' });
      setCurrent(url);
    } catch (e) { setError(e instanceof Error ? e.message : 'Erreur upload'); }
    finally { setUploading(false); }
  }

  return (
    <div className="rounded-2xl border border-sand bg-white p-5">
      <p className="font-semibold text-ink">{label}</p>
      <p className="mt-1 text-xs text-anthracite/50">{description}</p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={`relative flex w-full max-w-[180px] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${variant === 'logo' ? 'h-32 bg-white p-4' : 'h-56 bg-ivory'} ${dragging ? 'border-sage-dark bg-sage/10' : 'border-sand hover:border-sage-dark/50'}`}
        >
          {current ? (
            <img
              src={current}
              alt=""
              className={variant === 'logo' ? 'max-h-full max-w-full object-contain' : 'h-full w-full object-cover object-center'}
            />
          ) : (
            <div className="grid justify-items-center gap-2 text-anthracite/35">
              {uploading ? <div className="h-8 w-8 animate-spin rounded-full border-4 border-sand border-t-sage-dark" /> : <Upload size={28} />}
              <span className="text-center text-xs font-semibold text-anthracite/50">Glisser-déposer</span>
            </div>
          )}
          {current && uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-sand border-t-sage-dark" />
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink hover:border-sage-dark/40 hover:bg-ivory">
            {uploading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-sand border-t-ink" /> : <Upload size={15} />}
            {uploading ? 'Conversion & upload...' : variant === 'logo' ? 'Changer le logo' : 'Changer la photo'}
          </button>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            className={`rounded-xl border border-dashed px-4 py-3 text-xs transition ${dragging ? 'border-sage-dark bg-sage/10 text-ink' : 'border-sand bg-ivory text-anthracite/50'}`}
          >
            Glissez une image ici, ou cliquez sur le bouton.
          </div>
          <p className="text-xs text-anthracite/50">PNG, JPG ou WebP — converti automatiquement en WebP</p>
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          {current ? <p className="max-w-xs truncate font-mono text-[10px] text-anthracite/40">{current}</p> : null}
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      </div>
    </div>
  );
}

function SettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('key,value').then(({ data }) => {
      if (data) setSettings(Object.fromEntries(data.map((r) => [r.key, r.value])));
    });
  }, []);

  async function saveSetting(key: string, value: string) {
    if (!supabase) return;
    await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
    showToast('Parametre enregistre');
  }

  const SETTING_LABELS: Record<string, string> = {
    phone: 'Telephone', email: 'Email de contact', address: 'Adresse postale', hours: 'Horaires', linkedin: 'URL LinkedIn',
  };

  return (
    <div>
      {toast ? <Toast message={toast} /> : null}
      <h1 className="font-serif text-4xl text-ink">Parametres du site</h1>

      {/* Images du site */}
      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#D8C3B5]">Photos du site</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <SiteImageUploader
            label="Logo du site"
            description="Logo affiché en haut à gauche du site et dans le pied de page."
            settingKey="site_logo_url"
            storagePath="logo/act-rh-logo.webp"
            variant="logo"
          />
          <SiteImageUploader
            label="Photo Hero — Page d'accueil"
            description="Grande photo affichée en haut de la page d'accueil, à côté du titre principal."
            settingKey="hero_image_url"
            storagePath="hero/caroline-maratuech-act-rh-toulouse-1.webp"
          />
          <SiteImageUploader
            label="Photo Portrait — Page Le Cabinet"
            description="Portrait de Caroline affiché sur la page 'Le Cabinet / À propos'."
            settingKey="cabinet_image_url"
            storagePath="cabinet/caroline-tillou-maratuech-actrh.webp"
          />
        </div>
      </div>

      {/* Coordonnées */}
      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#D8C3B5]">Coordonnées & contact</p>
        <div className="mt-4 grid gap-4 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          {Object.entries(SETTING_LABELS).map(([key, label]) => (
            <Field key={key} label={label}>
              <input className="field" value={settings[key] ?? ''}
                onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                onBlur={(e) => saveSetting(key, e.target.value)}
              />
            </Field>
          ))}
          {!supabase ? <p className="text-sm text-anthracite/60">Connectez Supabase pour sauvegarder les modifications.</p> : null}
        </div>
      </div>
    </div>
  );
}

// ─── Shared UI ─────────────────────────────────────────────────────────────────
function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`grid gap-1.5 text-sm font-semibold text-ink ${className ?? ''}`}>{label}{children}</label>;
}

function IconBtn({ title, onClick, danger, children }: { title: string; onClick: () => void; danger?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" title={title} onClick={onClick}
      className={`rounded-lg p-2 transition ${danger ? 'text-anthracite/40 hover:bg-red-50 hover:text-red-500' : 'text-anthracite/40 hover:bg-sage/20 hover:text-ink'}`}>
      {children}
    </button>
  );
}

function Toast({ message }: { message: string }) {
  return <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl">{message}</div>;
}
