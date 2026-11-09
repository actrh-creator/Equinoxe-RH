import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, ChevronRight, Clock, Search, Tag } from 'lucide-react';
import { BlogCard } from '../components/Cards';
import { SEOHead } from '../components/SEOHead';
import { Container, Section } from '../components/ui';
import { posts } from '../data/content';
import { articleSchema, breadcrumbSchema } from '../lib/schemaMarkup';
import { contentToHtml, contentToText } from '../lib/richText';
import { useSupabaseRows } from '../hooks/useSupabaseRows';
import type { BlogPost } from '../types';

const ARTICLES_PER_PAGE = 6;

export function BlogPage() {
  const livePosts = useSupabaseRows<BlogPost>('blog_posts', posts, 'published_at');
  const publishedPosts = useMemo(() => sortPosts(livePosts.filter((post) => post.status === 'published')), [livePosts]);
  const categories = useMemo(() => ['Tous', ...Array.from(new Set(publishedPosts.map((post) => post.category)))], [publishedPosts]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tous');
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const search = normalize(query);
    return publishedPosts.filter((post) => {
      const inCategory = category === 'Tous' || post.category === category;
      const searchable = normalize(`${post.title} ${post.excerpt} ${post.category} ${post.tags.join(' ')}`);
      return inCategory && (!search || searchable.includes(search));
    });
  }, [category, publishedPosts, query]);

  const featured = publishedPosts.find((post) => post.featured) ?? publishedPosts[0];
  const gridPosts = featured ? filteredPosts.filter((post) => post.id !== featured.id) : filteredPosts;
  const postsPerPage = featured ? ARTICLES_PER_PAGE - 1 : ARTICLES_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(gridPosts.length / postsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedPosts = gridPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  useEffect(() => {
    setPage(1);
  }, [category, query]);

  return (
    <>
      <SEOHead
        title="Ressources RH : blog conseil RH, management et transitions | ACT&RH"
        description="Articles, conseils et repères sur le conseil RH, le management, l’accompagnement du changement, le coaching professionnel et le bilan de compétences."
        schema={blogCollectionSchema(publishedPosts)}
      />
      <section className="relative overflow-hidden border-b border-sand bg-rosé">
        <div className="absolute -right-20 -top-20 z-0 h-[450px] w-[450px] rounded-full border-[55px] border-white opacity-40" />
        <div className="absolute -left-10 -bottom-10 z-0 h-72 w-72 rounded-full border-[35px] border-white opacity-25" />
        <div className="absolute right-[20%] top-1/3 z-0 h-40 w-40 rounded-full border-[15px] border-white opacity-20" />
        <Container className="relative z-10 py-16">
          <div className="max-w-4xl">
            <p className="inline-flex rounded-full border border-sage-dark/20 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">
              Ressources RH
            </p>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-ink md:text-6xl">
              Blog RH, management et transitions professionnelles
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-anthracite/75">
              Des articles structurés pour aider dirigeants, managers et professionnels à clarifier les enjeux humains, organisationnels et managériaux.
            </p>
          </div>
        </Container>
      </section>

      <Section className="bg-ivory">
        <Container>
          {featured ? (
            <Link
              to={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-2xl border border-sand bg-white shadow-[0_22px_60px_rgba(14,27,41,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(14,27,41,0.1)] lg:grid-cols-2"
            >
              <div className="aspect-[16/7] overflow-hidden bg-sand lg:aspect-auto">
                <img src={coverImage(featured)} alt="" onError={(event) => { event.currentTarget.src = '/images/meeting_collaboration.webp'; }} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-center p-6 md:p-8">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-sage-dark">Article à la une</p>
                <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-ink md:text-3xl">{featured.title}</h2>
                <p className="mt-4 text-sm leading-7 text-anthracite/75 md:text-base">{featured.excerpt}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-anthracite/65">
                  <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> {formatDate(featured.published_at)}</span>
                  <span className="inline-flex items-center gap-2"><Clock size={16} /> {readingTime(featured.content)} min</span>
                  <span className="inline-flex items-center gap-2"><Tag size={16} /> {featured.category}</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-sage-dark">
                  Lire l’article <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-sand bg-white p-8 text-center text-anthracite/70">
              Aucun article ne correspond à cette recherche.
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-sand bg-white p-5 shadow-[0_18px_50px_rgba(14,27,41,0.05)]">
            <label htmlFor="blog-search" className="text-sm font-bold text-ink">
              Rechercher un article
            </label>
            <div className="mt-3 flex items-center gap-3 rounded-full border border-ink/10 bg-ivory px-5 py-3">
              <Search size={18} className="text-sage-dark" />
              <input
                id="blog-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ex. changement, management, bilan..."
                className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-anthracite/45"
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    category === item
                      ? 'border-sage-dark bg-sage-dark text-white'
                      : 'border-ink/10 bg-white text-ink/75 hover:border-sage-dark/40 hover:text-sage-dark'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {paginatedPosts.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              {paginatedPosts.map((post) => <BlogCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-sand bg-white p-8 text-center text-anthracite/70">
              Aucun article ne correspond à cette recherche.
            </div>
          )}

          {totalPages > 1 ? (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination des articles">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/75 transition hover:border-sage-dark/40 hover:text-sage-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Précédent
              </button>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-10 w-10 rounded-full border text-sm font-bold transition ${
                      currentPage === pageNumber
                        ? 'border-sage-dark bg-sage-dark text-white'
                        : 'border-ink/10 bg-white text-ink/75 hover:border-sage-dark/40 hover:text-sage-dark'
                    }`}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                disabled={currentPage === totalPages}
                className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/75 transition hover:border-sage-dark/40 hover:text-sage-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Suivant
              </button>
            </nav>
          ) : null}
        </Container>
      </Section>
    </>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const livePosts = useSupabaseRows<BlogPost>('blog_posts', posts, 'published_at');
  const publishedPosts = useMemo(() => sortPosts(livePosts.filter((item) => item.status === 'published')), [livePosts]);
  const post = publishedPosts.find((item) => item.slug === slug) ?? posts.find((item) => item.slug === slug) ?? posts[0];
  const relatedPosts = publishedPosts
    .filter((item) => item.slug !== post.slug && (item.category === post.category || item.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3);
  const [progress, setProgress] = useState(0);
  const image = coverImage(post);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0);
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [post.slug]);

  return (
    <>
      <SEOHead
        title={post.seo_title ?? post.title}
        description={post.seo_description ?? post.excerpt}
        image={image}
        type="article"
        schema={[articleSchema({ ...post, cover_image_url: image }), breadcrumbSchema([{ name: 'Accueil', url: '/' }, { name: 'Ressources RH', url: '/blog' }, { name: post.title, url: `/blog/${post.slug}` }])]}
      />
      <div className="fixed left-0 right-0 top-20 z-30 h-1 bg-white/70 backdrop-blur">
        <div className="h-full bg-sage-dark transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <article className="bg-white">
        <Container className="py-12 md:py-16">
          <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-anthracite/60" aria-label="Fil d’Ariane">
            <Link to="/" className="hover:text-sage-dark">Accueil</Link>
            <ChevronRight size={15} />
            <Link to="/blog" className="hover:text-sage-dark">Ressources RH</Link>
            <ChevronRight size={15} />
            <span className="text-ink">{post.category}</span>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
            <header>
              <p className="inline-flex rounded-full border border-sage-dark/20 bg-rosé px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">
                {post.category}
              </p>
              <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-ink md:text-6xl">{post.title}</h1>
              <p className="mt-6 max-w-3xl text-xl leading-9 text-anthracite/75">{post.excerpt}</p>
              <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold text-anthracite/65">
                <span className="inline-flex items-center gap-2"><CalendarDays size={17} /> {formatDate(post.published_at)}</span>
                <span className="inline-flex items-center gap-2"><Clock size={17} /> {readingTime(post.content)} min de lecture</span>
                <span className="inline-flex items-center gap-2"><BookOpen size={17} /> Progression {Math.round(progress)}%</span>
              </div>
            </header>
            <div className="overflow-hidden rounded-2xl border border-sand bg-sand shadow-[0_24px_70px_rgba(14,27,41,0.08)]">
              <img src={image} alt="" onError={(event) => { event.currentTarget.src = '/images/meeting_collaboration.webp'; }} className="aspect-[4/3] h-full w-full object-cover" />
            </div>
          </div>
        </Container>

        <Section className="bg-ivory">
          <Container className="grid gap-10 lg:grid-cols-3 lg:items-start">
            <div className="rounded-2xl border border-sand bg-white p-7 shadow-[0_22px_70px_rgba(14,27,41,0.06)] md:p-10 lg:col-span-2">
              <ArticleBody content={post.content} />
              <div className="mt-10 flex flex-wrap gap-2 border-t border-sand pt-6">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-rosé px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-sage-dark">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <aside className="sticky top-28 rounded-2xl border border-sand bg-white p-6 shadow-[0_18px_50px_rgba(14,27,41,0.05)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Dans cet article</p>
              <div className="mt-4 h-2 rounded-full bg-rosé">
                <div className="h-full rounded-full bg-sage-dark transition-[width] duration-150" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-4 text-sm leading-6 text-anthracite/70">
                Temps estimé : {readingTime(post.content)} minutes. La barre suit votre avancée dans la lecture.
              </p>
              <Link to="/contact" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sage px-5 py-3 text-sm font-bold text-white transition hover:bg-sage-dark">
                Échanger sur ce sujet <ArrowRight size={15} />
              </Link>
            </aside>
          </Container>
        </Section>
      </article>

      {relatedPosts.length > 0 ? (
        <Section className="bg-white">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">À lire aussi</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">Articles liés</h2>
              </div>
              <Link to="/blog" className="hidden text-sm font-bold text-sage-dark hover:text-ink md:inline-flex">
                Toutes les ressources
              </Link>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {relatedPosts.map((item) => <BlogCard key={item.id} post={item} />)}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}

function ArticleBody({ content }: { content: string }) {
  const html = useMemo(() => contentToHtml(content), [content]);
  return <div className="prose-actrh max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Rendu fidèle de la page article (sans barre de progression), utilisé par l'aperçu de l'admin. */
export function ArticlePreview({ post }: { post: BlogPost }) {
  const image = coverImage(post);
  return (
    <article className="bg-white">
      <Container className="py-10 md:py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <header>
            <p className="inline-flex rounded-full border border-sage-dark/20 bg-rosé px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">{post.category}</p>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-ink md:text-5xl">{post.title || 'Titre de l’article'}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-anthracite/75">{post.excerpt}</p>
            <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold text-anthracite/65">
              <span className="inline-flex items-center gap-2"><CalendarDays size={17} /> {formatDate(post.published_at)}</span>
              <span className="inline-flex items-center gap-2"><Clock size={17} /> {readingTime(post.content)} min de lecture</span>
            </div>
          </header>
          <div className="overflow-hidden rounded-2xl border border-sand bg-sand shadow-[0_24px_70px_rgba(14,27,41,0.08)]">
            <img src={image} alt="" onError={(event) => { event.currentTarget.src = '/images/meeting_collaboration.webp'; }} className="aspect-[4/3] h-full w-full object-cover" />
          </div>
        </div>
      </Container>
      <div className="bg-ivory py-10 md:py-12">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-sand bg-white p-7 shadow-[0_22px_70px_rgba(14,27,41,0.06)] md:p-10">
            <ArticleBody content={post.content} />
            <div className="mt-10 flex flex-wrap gap-2 border-t border-sand pt-6">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-rosé px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-sage-dark">{tag}</span>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </article>
  );
}

function sortPosts(items: BlogPost[]) {
  return [...items].sort((a, b) => new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime());
}

function normalize(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function readingTime(content: string) {
  const words = contentToText(content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.ceil(words / 210));
}

function formatDate(value?: string | null) {
  if (!value) return 'Date à venir';
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

function coverImage(post: BlogPost) {
  if (post.cover_image_url) return post.cover_image_url;
  if (post.category.includes('changement')) return '/images/transition_professionnelle.webp';
  if (post.category.includes('Coaching')) return '/images/coaching_collaboration.webp';
  if (post.category.includes('Bilan')) return '/images/service_conseil_rh.webp';
  if (post.category.includes('Management')) return '/images/meeting_collaboration.webp';
  return '/images/meeting_collaboration.webp';
}

function blogCollectionSchema(items: BlogPost[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Ressources RH - ACT&RH',
    description: 'Articles sur le conseil RH, le management, le coaching professionnel et les transitions professionnelles.',
    blogPost: items.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://www.act-rh.com/blog/${post.slug}`,
      datePublished: post.published_at,
      keywords: post.tags.join(', ')
    }))
  };
}

