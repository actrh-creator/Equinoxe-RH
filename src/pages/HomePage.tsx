import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  MapPin,
  GraduationCap,
  Users,
  Building2,
  ChevronDown,
  Compass,
  ClipboardCheck,
  HeartHandshake,
  LineChart,
  MonitorCheck,
  Phone,
  Route,
  Shuffle,
  Lightbulb,
  ShieldCheck,
  Target,
  CheckCircle2
} from 'lucide-react';
import { BlogCard, TestimonialCard } from '../components/Cards';
import { CookieConsent } from '../components/CookieConsent';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';
import { ScrollReveal } from '../components/ScrollReveal';
import { ButtonLink, Card, Container, Section } from '../components/ui';
import { contactInfo, faqs, posts, testimonials, trustedLogos } from '../data/content';
import { organizationSchema, personSchema, faqSchema, websiteSchema } from '../lib/schemaMarkup';
import { useSupabaseRows } from '../hooks/useSupabaseRows';
import { supabase } from '../lib/supabaseClient';
import type { BlogPost, FAQ, Testimonial } from '../types';

export function HomePage() {
  const livePosts = useSupabaseRows<BlogPost>('blog_posts', posts, 'published_at');
  const liveFaqs = useSupabaseRows<FAQ>('faqs', faqs, 'display_order');
  const liveTestimonials = useSupabaseRows<Testimonial>('testimonials', testimonials, 'display_order').filter((t) => !t.is_placeholder);
  const [referencesOpen, setReferencesOpen] = useState(false);
  const [approcheOpen, setApprocheOpen] = useState(false);
  const [heroImg, setHeroImg] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('value').eq('key', 'hero_image_url').single()
      .then(({ data }) => { if (data?.value) setHeroImg(data.value); });
  }, []);

  return (
    <>
      <SEOHead title="ACT&RH | Conseil RH & accompagnement individuel — Caroline Tillou Maratuech" description="Comprendre ce qui se joue, clarifier les choix, construire la suite. Conseil RH et accompagnement individuel à Toulouse, en Occitanie, en France et à distance." schema={[organizationSchema, personSchema, faqSchema(liveFaqs.slice(0, 5)), websiteSchema]} />
      <CookieConsent />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-sand bg-rosé py-10 sm:py-16">
        {/* Decorative background elements - enhanced visibility and explicit styling */}
        <div className="absolute -right-20 -top-20 z-0 h-[500px] w-[500px] rounded-full border-[60px] border-white opacity-40" />
        <div className="absolute -left-10 -bottom-10 z-0 h-80 w-80 rounded-full border-[40px] border-white opacity-25" />
        <div className="absolute right-[10%] bottom-[15%] z-0 h-48 w-48 rounded-full border-[20px] border-white opacity-20" />
        
        <Container className="relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="animate-fade-in text-sm font-semibold uppercase tracking-[0.14em] text-anthracite/55">
                ACT&RH — Accompagnement, Conseil en Transition & RH
              </p>
              <p className="animate-fade-in inline-flex rounded-full border border-sage-dark/20 bg-sage px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
                Toulouse · Occitanie · France · À distance
              </p>
              <h1 className="animate-fade-in-up max-w-4xl text-balance font-serif text-4xl font-semibold leading-[1.06] text-ink sm:text-6xl xl:text-7xl">
                Comprendre ce qui se joue. Clarifier les choix. Construire la suite.
              </h1>
              <p className="animate-fade-in-up delay-100 max-w-2xl text-lg leading-8 text-anthracite/80">
                Conseil RH & accompagnement professionnel et personnel — pour les organisations confrontées à des enjeux humains et pour les personnes en évolution, transition ou questionnement.
              </p>
              <div className="animate-fade-in-up delay-150 flex flex-wrap gap-3 pt-2">
                <ButtonLink to="/contact" className="btn-shimmer btn-pulse">Parler de ma situation</ButtonLink>
                <ButtonLink to="/services" variant="secondary">Découvrir les accompagnements</ButtonLink>
              </div>
              <div className="animate-fade-in-up delay-200 flex flex-wrap gap-x-6 gap-y-3 pt-4 text-sm font-bold text-ink/75">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-champagne" /> Conseil RH
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sage-dark" /> Accompagnement individuel
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rosé" /> Accompagnement du changement
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-champagne-dark" /> Bilan de compétences
                </span>
              </div>
            </div>
            
            <div className="animate-fade-in delay-100 relative flex justify-center lg:justify-end">
              <div className="animate-float relative w-full max-w-[480px] overflow-hidden rounded-[2rem] border border-sand bg-white p-3.5 shadow-[0_28px_80px_rgba(14,27,41,0.08)] lg:max-w-full">
                <img
                  src={heroImg ?? "https://xuuvxhvmndkqkcmgptot.supabase.co/storage/v1/object/public/site-images/hero/caroline-maratuech-act-rh-toulouse-1.webp"}
                  alt="Caroline Tillou Maratuech — Consultante RH et accompagnement individuel, ACT&RH"
                  onError={(event) => { event.currentTarget.src = '/images/Professeur TILLOU Caroline - TBS Education.webp'; }}
                  className="aspect-[4/5] h-full w-full rounded-[1.5rem] object-cover object-center sm:aspect-square"
                />
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[0_18px_40px_rgba(14,27,41,0.06)] backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Indépendance & proximité</p>
                  <p className="mt-1.5 font-serif text-lg font-semibold leading-snug text-ink">Une relation de confiance pour conseiller, accompagner et transmettre.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="animate-fade-in-up delay-300 mt-16 rounded-2xl border border-sand bg-white p-4 shadow-soft md:p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Docteure en GRH', GraduationCap, 'Gestion des ressources humaines'],
                ['+ 20 ans', Award, 'De recherche et de pratique'],
                ['Enseignante-chercheuse', Users, 'TBS Education'],
                ['Consultante RH', MapPin, 'Professionnelle de l’accompagnement individuel']
              ].map(([label, Icon, desc]) => (
                <div key={String(label)} className="flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-sage/20">
                  <span className="rounded-full bg-sage px-2.5 py-2.5 text-white"><Icon size={18} /></span>
                  <div>
                    <p className="text-sm font-bold leading-tight text-ink sm:text-base">{String(label)}</p>
                    <p className="text-xs text-anthracite/60 mt-1">{String(desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Double regard */}
      <section className="border-b border-sand bg-white py-10">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 rounded-2xl border border-sand bg-ivory p-6 sm:flex-row sm:items-center sm:p-8">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage/40 text-sage-dark">
              <Compass size={22} />
            </span>
            <p className="text-lg leading-8 text-ink">
              Mon approche repose sur un double regard : celui de la recherche en gestion des ressources humaines et celui de la pratique des organisations.
            </p>
          </div>
        </Container>
      </section>

      {/* Logos Section */}
      <section className="border-b border-sand bg-white py-10">
        <Container>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">Références et collaborations</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-anthracite/70">Organisations, établissements et partenaires avec lesquels j’ai travaillé</p>
            </div>
            <button
              onClick={() => setReferencesOpen((o) => !o)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-sage-dark/40 hover:text-sage-dark"
              aria-expanded={referencesOpen}
            >
              {referencesOpen ? 'Réduire' : 'En savoir plus'}
              <ChevronDown size={16} className={`transition-transform duration-300 ${referencesOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <div className={`relative overflow-hidden rounded-2xl border border-sand bg-ivory transition-all duration-500 ${referencesOpen ? 'mt-6 max-h-44 py-5 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}>
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ivory to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ivory to-transparent" />
            <div className="logo-marquee flex w-max items-center gap-6">
              {[...trustedLogos, ...trustedLogos].map((logo, index) => (
                <div key={`${logo.name}-${index}`} className="flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-ink/5 bg-white px-5 shadow-[0_10px_30px_rgba(14,27,41,0.04)]">
                  <img src={logo.src} alt={logo.name} onError={(event) => { event.currentTarget.src = '/images/equinoxe-RH-logo.webp'; }} className="max-h-12 max-w-full object-contain" loading="lazy" width="176" height="80" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Votre situation Section */}
      <Section className="bg-white">
        <Container>
          <ScrollReveal>
            <GridTitle title="Votre situation" text="Avant de parler de prestations, il s'agit de reconnaître la situation que vous traversez." />
          </ScrollReveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { text: 'Je ne sais plus quelle direction donner à ma carrière.', icon: Compass, href: '/services/bilan-de-competences' },
              { text: 'Je prends un poste de manager et je veux réussir cette transition.', icon: Users, href: '/pour-qui/managers' },
              { text: 'Mon organisation change et je dois accompagner mes équipes.', icon: Shuffle, href: '/services/accompagnement-changement' },
              { text: 'Je suis dirigeant et je dois professionnaliser mes pratiques RH.', icon: Building2, href: '/services/conseil-rh-entreprises' },
              { text: 'J’ai beaucoup d’expérience, mais je ne sais plus comment la valoriser.', icon: Lightbulb, href: '/pour-qui/salaries-transitions' },
              { text: 'Je quitte une carrière militaire ou sportive et je dois construire la suite.', icon: ArrowRight, href: '/services/bilan-de-competences' }
            ].map(({ text, icon: Icon, href }, index) => (
              <ScrollReveal key={text} delay={index * 75}>
                <Link to={href} className="block h-full">
                  <Card className="group hover:-translate-y-2 hover:border-champagne/30 hover:shadow-[0_24px_50px_rgba(14,27,41,0.06)] transition-all duration-500 flex h-full flex-col justify-between border border-sand">
                    <div>
                      <div className="mb-4 text-sage-dark group-hover:text-champagne-dark transition-colors duration-500">
                        <Icon size={26} />
                      </div>
                      <p className="font-serif text-xl font-semibold leading-snug text-ink">« {text} »</p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sage-dark transition-transform duration-300 group-hover:translate-x-1">
                      Voir comment j'interviens <ArrowRight size={15} />
                    </span>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Deux portes d'entrée */}
      <Section className="border-y border-sand bg-sage/20">
        <Container className="space-y-14">
          <ScrollReveal>
            <div className="rounded-[2rem] border border-sand bg-white p-6 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-white">
                    <Building2 size={24} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Pour les organisations</p>
                  <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">Des situations RH qui nécessitent un regard extérieur</h2>
                  <p className="mt-4 text-base leading-7 text-anthracite/75">
                    J'interviens auprès des dirigeants, managers et professionnels RH, dans les TPE, PME comme dans des organisations plus importantes, lorsque les enjeux humains, managériaux ou organisationnels nécessitent de prendre du recul et de structurer une réponse.
                  </p>
                  <div className="mt-6">
                    <ButtonLink to="/services#organisations">Découvrir les accompagnements pour les organisations</ButtonLink>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { title: 'Conseil RH', text: 'Structuration RH, pratiques managériales, situations individuelles ou collectives, accompagnement des transformations.', href: '/services/conseil-rh-entreprises' },
                    { title: 'Accompagnement du changement', text: 'Préparer, accompagner et ancrer les évolutions individuelles, collectives et organisationnelles.', href: '/services/accompagnement-changement' },
                    { title: 'Managers et collectifs', text: 'Posture, communication, coopération, régulation des tensions, ateliers et co-développement.', href: '/services/formations-ateliers-codeveloppement' }
                  ].map((item) => (
                    <Link key={item.title} to={item.href} className="group rounded-2xl border border-sand bg-ivory p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sage-dark/25 hover:bg-white">
                      <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-sage-dark transition-colors">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-anthracite/70">{item.text}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="rounded-[2rem] border border-sand bg-white p-6 sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-white">
                    <HeartHandshake size={24} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Pour vous</p>
                  <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">Prendre du recul. Décider. Avancer.</h2>
                  <p className="mt-4 text-base leading-7 text-anthracite/75">
                    Il y a des moments où l'on a besoin de faire le point, de prendre du recul ou simplement de pouvoir réfléchir autrement à une situation. Une question professionnelle, une prise de responsabilité, une transition de carrière, mais aussi une difficulté à décider, un manque de confiance ou l'envie de retrouver un nouvel élan : les sujets peuvent être très différents. J'accompagne les personnes qui souhaitent mieux comprendre ce qu'elles vivent, identifier leurs ressources, faire des choix et avancer avec davantage de clarté.
                  </p>
                  <div className="mt-6">
                    <ButtonLink to="/services#vous">Découvrir l'accompagnement individuel</ButtonLink>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { title: 'Bilan de compétences', text: 'Analyser son parcours, identifier ses ressources et construire un projet cohérent.', href: '/services/bilan-de-competences' },
                    { title: 'Accompagnement individuel', text: 'Prendre du recul, renforcer la confiance en soi, préparer une décision ou traverser une période de changement.', href: '/services/accompagnement-individuel' },
                    { title: 'Transitions et évolutions', text: 'Reconversion, mobilité, évolution professionnelle, seconde partie de carrière ou changement de trajectoire.', href: '/pour-qui/salaries-transitions' }
                  ].map((item) => (
                    <Link key={item.title} to={item.href} className="group rounded-2xl border border-sand bg-ivory p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sage-dark/25 hover:bg-white">
                      <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-sage-dark transition-colors">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-anthracite/70">{item.text}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Approche Section */}
      <Section className="bg-white">
        <Container>
          <ScrollReveal>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="max-w-3xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">Comprendre → Clarifier → Faire progresser</h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-anthracite/70">Le fil rouge de chaque accompagnement, pour les organisations comme pour les personnes.</p>
              </div>
              <button
                onClick={() => setApprocheOpen((o) => !o)}
                className="flex shrink-0 items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:border-sage-dark/40 hover:text-sage-dark"
                aria-expanded={approcheOpen}
              >
                {approcheOpen ? 'Réduire' : 'En savoir plus'}
                <ChevronDown size={16} className={`transition-transform duration-300 ${approcheOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </ScrollReveal>

          <div className={`overflow-hidden transition-all duration-500 ${approcheOpen ? 'mt-10 max-h-[3200px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <p className="max-w-4xl text-lg leading-8 text-anthracite/75">
              À Toulouse, en Occitanie, en France ou à distance, je travaille avec les organisations et les personnes confrontées à des situations de changement, de transition ou de questionnement, avec une même manière de faire : comprendre avant d'agir, clarifier les choix possibles, puis construire la suite.
            </p>

          <div className="mx-auto mt-8 grid max-w-5xl gap-3 md:grid-cols-3">
            {[
              {
                icon: Lightbulb,
                title: 'Comprendre',
                text: 'Comprendre la situation avant de chercher une solution : observer, questionner, considérer le contexte, identifier les faits, les perceptions, les contraintes et les marges de manœuvre.'
              },
              {
                icon: Target,
                title: 'Clarifier',
                text: 'Créer un cadre structuré et confidentiel pour regarder les situations difficiles sans jugement ni précipitation, et identifier les pistes qui répondent aux besoins définis.'
              },
              {
                icon: LineChart,
                title: 'Faire progresser',
                text: 'Transformer cette compréhension en décisions, en nouvelles pratiques ou en trajectoires concrètes — professionnelles, personnelles, individuelles ou organisationnelles.'
              }
            ].map(({ icon: Icon, title, text }, index) => (
              <ScrollReveal key={title} delay={index * 100}>
                <div className="flex h-full gap-4 rounded-2xl border border-sand bg-ivory p-5">
                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sage-dark shadow-sm">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-ink">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-anthracite/75">{text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mx-auto mt-8 max-w-5xl space-y-4">
              {[
                {
                  icon: Lightbulb,
                  title: 'Concrètement, qu’est-ce qu’une approche scientifique change ?',
                  text: "Une approche scientifique ne consiste pas à appliquer des théories à des personnes ou à des organisations comme on appliquerait une recette. Elle consiste à s'appuyer sur des connaissances éprouvées pour mieux comprendre les phénomènes observés, questionner ses propres intuitions et éviter les explications trop rapides. Dans l'accompagnement professionnel comme dans le conseil RH, cette exigence de rigueur permet notamment de distinguer ce qui relève des faits, des perceptions, des comportements, du contexte organisationnel ou des représentations. Cette approche est ensuite confrontée à la réalité du terrain : chaque organisation, chaque parcours et chaque situation possède ses propres contraintes. L'objectif n'est donc pas d'appliquer une méthode. C'est de mieux comprendre pour mieux agir."
                },
                {
                  icon: Building2,
                  title: 'Conseil RH pour TPE, PME et organisations',
                  text: "Le conseil RH permet de structurer les pratiques, clarifier les rôles, accompagner une réorganisation ou traiter une situation humaine devenue complexe. J'interviens auprès des dirigeants, responsables RH et managers pour analyser le fonctionnement réel, repérer les points de fragilité et construire des réponses adaptées : diagnostic RH, accompagnement de transformation, ateliers collectifs, régulation des tensions, fidélisation des talents, qualité de vie au travail et soutien au management."
                },
                {
                  icon: HeartHandshake,
                  title: 'Accompagnement individuel et posture managériale',
                  text: 'Un accompagnement professionnel — pouvant prendre la forme d’un coaching lorsque ce format est adapté à la situation — aide les dirigeants, managers, salariés et professionnels en transition à prendre du recul sur leurs décisions, leur communication et leur posture. Il peut soutenir une prise de poste, une évolution de carrière, une difficulté relationnelle, une surcharge, une perte de confiance ou un besoin de repositionnement. L’accompagnement reste concret : clarifier la situation, identifier les ressources, travailler les marges de manoeuvre et retrouver une manière d’agir plus alignée.'
                },
                {
                  icon: Shuffle,
                  title: 'Accompagnement du changement et cohésion d’équipe',
                  text: 'Une transformation RH, une croissance rapide, une fusion, une évolution de métier ou une nouvelle organisation se vit d’abord dans le quotidien des équipes. L’accompagnement du changement aide à rendre les transitions plus lisibles : clarification des objectifs, analyse des impacts humains, communication, ateliers d’équipe, soutien des managers et suivi dans la durée. L’enjeu est de préserver l’engagement, la coopération et la santé du collectif.'
                },
                {
                  icon: ClipboardCheck,
                  title: 'Bilan de compétences et transitions professionnelles',
                  text: 'Le bilan de compétences s’adresse aux personnes qui souhaitent faire le point sur leur parcours, leurs motivations, leurs compétences et leurs pistes d’évolution. Il ne concerne pas uniquement la reconversion : il peut aider à préparer une mobilité, retrouver du sens, sécuriser une décision ou construire un projet professionnel réaliste. L’approche articule réflexion personnelle, réalité du marché, conditions de faisabilité et équilibre de vie.'
                }
              ].map(({ icon: Icon, title, text }) => (
                <details key={title} className="group rounded-2xl border border-sand bg-white p-0 shadow-sm transition-all duration-300 open:border-sage-dark/25 open:shadow-soft">
                  <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 [&::-webkit-details-marker]:hidden">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rosé text-sage-dark">
                      <Icon size={20} />
                    </span>
                    <h3 className="flex-1 font-serif text-xl font-semibold leading-snug text-ink sm:text-2xl">{title}</h3>
                    <ChevronDown size={20} className="shrink-0 text-sage-dark transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-6 pl-[4.25rem] text-sm leading-7 text-anthracite/75 sm:text-base">
                    <p>{text}</p>
                  </div>
                </details>
              ))}
          </ScrollReveal>

          <ScrollReveal className="mx-auto mt-6 max-w-5xl">
            <details className="group rounded-2xl border border-sand bg-ivory p-0 shadow-sm transition-all duration-300 open:border-sage-dark/25 open:bg-white open:shadow-soft">
              <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 [&::-webkit-details-marker]:hidden">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sage-dark">
                  <CheckCircle2 size={20} />
                </span>
                <h3 className="flex-1 font-serif text-xl font-semibold leading-snug text-ink sm:text-2xl">Une méthode sobre et ajustée</h3>
                <ChevronDown size={20} className="shrink-0 text-sage-dark transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-6 pl-[4.25rem]">
                <div className="relative grid gap-4 lg:grid-cols-7">
                  {[
                    { label: 'Écouter', icon: HeartHandshake },
                    { label: 'Comprendre', icon: Lightbulb },
                    { label: 'Clarifier', icon: Target },
                    { label: 'Accompagner', icon: Users },
                    { label: 'Ajuster', icon: Shuffle },
                    { label: 'Transmettre', icon: ClipboardCheck },
                    { label: 'Sécuriser', icon: ShieldCheck }
                  ].map(({ label, icon: Icon }, index) => (
                    <div key={label} className="relative flex min-w-0 items-center gap-3 rounded-2xl border border-sand bg-white px-3 py-4 shadow-[0_10px_24px_rgba(14,27,41,0.035)] lg:flex lg:flex-col lg:items-center lg:gap-0 lg:px-2 lg:text-center xl:px-3">
                      <span className="relative z-10 mx-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink bg-ink text-champagne lg:mx-auto">
                        <Icon size={18} />
                      </span>
                      <p className="min-w-0 flex-1 whitespace-nowrap font-serif text-sm font-semibold leading-tight text-ink sm:text-base lg:order-3 lg:mt-3 lg:w-full lg:flex-none lg:text-center lg:text-[0.72rem] xl:text-[0.86rem]">{label}</p>
                      <span className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ivory text-xs font-bold text-ink lg:order-2 lg:mx-auto lg:mt-4 lg:self-center">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </ScrollReveal>
          </div>
        </Container>
      </Section>

      {/* Recherche + terrain */}
      <Section className="bg-white">
        <Container>
          <ScrollReveal>
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne-dark">Recherche → Terrain → Transmission → Accompagnement</p>
                <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">Une approche fondée sur la recherche et l'expérience</h2>
              </div>
              <div className="space-y-5 text-base leading-7 text-anthracite/80">
                <p>
                  La recherche en gestion des ressources humaines aide à comprendre les mécanismes qui traversent la vie professionnelle : les comportements au travail, la motivation, l'engagement, les relations professionnelles, les dynamiques organisationnelles, le changement et les transitions professionnelles, ou encore la relation entre managers et collaborateurs.
                </p>
                <p>
                  Mais les organisations et les personnes ne se résument jamais à des modèles théoriques. Ces connaissances doivent être confrontées au contexte, à l'histoire, aux contraintes, aux acteurs et aux situations particulières de chaque accompagnement.
                </p>
                <p>
                  Cette combinaison — des clés de lecture issues de la recherche, mises à l'épreuve du terrain — est la signature d'ACT&RH.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Zone géographique Section */}
      <Section className="border-y border-sand bg-ivory">
        <Container>
          <ScrollReveal>
            <div className="grid overflow-hidden rounded-[2rem] border border-sand bg-white shadow-[0_22px_60px_rgba(14,27,41,0.07)] lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[260px] lg:min-h-full">
                <img
                  src="/images/toulouse-garonne.webp"
                  alt="Vue de Toulouse et des bords de Garonne"
                  onError={(event) => { event.currentTarget.src = '/images/meeting_collaboration.webp'; }}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-ink/35 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-full border border-white/50 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-ink backdrop-blur">
                  Comprendre / Clarifier / Faire progresser
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Toulouse · Occitanie · France · À distance</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                  Une présence locale, avec des formats souples selon la mission
                </h2>
                <p className="mt-4 text-sm leading-7 text-anthracite/75 sm:text-base">
                  Caroline Tillou Maratuech travaille depuis Toulouse avec des entreprises, dirigeants, managers et professionnels en transition. Les accompagnements peuvent se dérouler en visio, en présentiel à Toulouse ou sur site lorsque la mission le justifie, notamment pour les diagnostics RH, ateliers collectifs, accompagnements du changement et interventions auprès des équipes.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: MapPin, label: 'Toulouse', text: 'Ancrage local' },
                    { icon: MonitorCheck, label: 'Visio', text: 'Suivi à distance' },
                    { icon: Route, label: 'Déplacement', text: 'Selon la mission' }
                  ].map(({ icon: Icon, label, text }) => (
                    <div key={label} className="rounded-2xl border border-sand bg-ivory p-4">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rosé text-sage-dark">
                        <Icon size={18} />
                      </span>
                      <p className="mt-3 text-sm font-bold text-ink">{label}</p>
                      <p className="mt-1 text-xs leading-5 text-anthracite/65">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section className="bg-white">
        <Container>
          <ScrollReveal>
            <Card className="overflow-hidden border border-sand bg-white p-0 shadow-sm">
              <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-[260px] overflow-hidden bg-sage/5">
                  <iframe
                    title="Carte Google Maps - ACT&RH"
                    src="https://www.google.com/maps?q=10bis%20rue%20de%20Garin%2C%2031500%20Toulouse&output=embed"
                    className="absolute inset-0 h-full w-full grayscale-[15%]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink/5" />
                </div>

                <div className="p-6 sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Contact</p>
                  <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-ink">Prenons contact</h2>
                  <p className="mt-3 text-sm leading-7 text-anthracite/75">
                    Les rendez-vous peuvent être organisés en visioconférence, à Toulouse ou en déplacement après cadrage de l’accompagnement, notamment pour les missions en entreprise.
                  </p>

                  <div className="mt-5 grid gap-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start gap-3 rounded-2xl border border-sand bg-ivory px-4 py-3 text-sm font-semibold text-ink transition-all hover:border-sage-dark/25 hover:bg-white"
                    >
                      <MapPin size={18} className="mt-0.5 shrink-0 text-sage-dark" />
                      <span>{contactInfo.address}</span>
                    </a>
                    <a
                      href={`tel:${contactInfo.phoneHref}`}
                      className="group flex items-center gap-3 rounded-2xl border border-sand bg-ivory px-4 py-3 text-sm font-semibold text-ink transition-all hover:border-sage-dark/25 hover:bg-white"
                    >
                      <Phone size={18} className="shrink-0 text-sage-dark" />
                      <span>{contactInfo.phone}</span>
                    </a>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="group rounded-2xl border border-sand bg-ivory px-4 py-3 text-sm font-semibold text-ink transition-all hover:border-sage-dark/25 hover:bg-white"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>

          <ScrollReveal className="mt-6">
            <Card className="border border-sand bg-ivory">
              <h2 className="font-serif text-3xl font-semibold text-ink">Zones d’intervention</h2>
              <p className="mt-3 text-sm leading-7 text-anthracite/75">
                Toulouse, Haute-Garonne, Occitanie et accompagnements à distance partout en France.
              </p>
              <div className="mt-5">
                <ButtonLink to="/contact">Prendre contact</ButtonLink>
              </div>
            </Card>
          </ScrollReveal>
        </Container>
      </Section>

      {/* CTA Banner Section */}
      <Section className="bg-white">
        <Container>
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-14 shadow-soft sm:px-12 sm:py-20 border border-ink/20">
              {/* Decorative circles — golden transparent */}
              <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full border-[56px] border-champagne opacity-25" />
              <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full border-[36px] border-champagne opacity-20" />
              <div className="absolute right-[30%] top-[20%] h-32 w-32 rounded-full border-[16px] border-champagne opacity-15" />

              <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="max-w-3xl">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-champagne">Échange gratuit & confidentiel</p>
                  <h3 className="mt-3 font-serif text-3xl font-semibold leading-tight text-white sm:text-5xl">Une situation à clarifier ?</h3>
                  <p className="mt-4 text-lg leading-relaxed text-white">
                    Vous n'avez pas nécessairement besoin d'avoir déjà identifié la solution. Un premier échange permet de poser le contexte, clarifier votre besoin et déterminer si ACT&RH est le bon interlocuteur. Premier échange gratuit et confidentiel.
                  </p>
                </div>
                <Link className="btn-shimmer btn-pulse focus-ring shrink-0 rounded-lg bg-sage px-8 py-4 font-bold text-white shadow-[0_12px_28px_rgba(111,143,130,0.24)] transition-all duration-300 hover:scale-105 hover:bg-sage-dark" to="/contact">
                  Parler de ma situation
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Témoignages / Avis Section */}
      {liveTestimonials.length > 0 ? (
        <Section className="border-y border-sand bg-rosé">
          <Container>
            <ScrollReveal>
              <GridTitle title="Avis clients" text="Retours d'expérience sur les accompagnements proposés par ACT&RH." />
            </ScrollReveal>
            <TestimonialsCarousel testimonials={liveTestimonials} />
          </Container>
        </Section>
      ) : null}

      {/* FAQ Section */}
      <Section className="border-y border-sand bg-sage/20">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal>
            <GridTitle title="Questions fréquentes" text="Des réponses courtes pour comprendre le cadre d’intervention." />
          </ScrollReveal>
          <ScrollReveal>
            <FAQAccordion items={liveFaqs.slice(2, 8)} />
          </ScrollReveal>
        </Container>
      </Section>

      {/* Ressources RH Section */}
      <Section className="bg-white">
        <Container>
          <ScrollReveal className="flex flex-wrap items-end justify-between gap-5">
            <GridTitle title="Ressources RH" text="Recherches, analyses et observations de terrain sur les transitions humaines, managériales et professionnelles." />
            <Link className="inline-flex items-center gap-2 font-bold text-sage-dark hover:text-ink transition-colors group" to="/blog">
              Voir le blog <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </ScrollReveal>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {livePosts.slice(0, 3).map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 100}>
                <BlogCard post={post} />
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}


function GridTitle({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-anthracite/70">{text}</p>
    </div>
  );
}

function TestimonialsCarousel({ testimonials: items }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const perPage = typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1;
  const total = items.length;
  const maxIndex = Math.max(0, total - perPage);

  const go = useCallback((idx: number) => {
    setCurrent(Math.min(Math.max(idx, 0), maxIndex));
  }, [maxIndex]);

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
    }, 5000);
  }, [maxIndex]);

  useEffect(() => {
    restart();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [restart]);

  useEffect(() => {
    if (!trackRef.current) return;
    const w = trackRef.current.parentElement?.clientWidth ?? 0;
    trackRef.current.style.transform = `translateX(-${current * (w / perPage)}px)`;
  }, [current, perPage]);

  if (items.length === 0) return null;

  return (
    <div className="mt-10 select-none">
      <div className="relative overflow-hidden rounded-2xl">
        <div ref={trackRef} className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]">
          {items.map((t) => (
            <div key={t.id} className={`shrink-0 px-2 ${perPage === 2 ? 'w-1/2' : 'w-full'}`}>
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => { go(current - 1); restart(); }}
          disabled={current === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition hover:border-sage-dark/40 disabled:opacity-30"
          aria-label="Précédent"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { go(i); restart(); }}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-champagne' : 'w-2 bg-ink/20 hover:bg-ink/40'}`}
              aria-label={`Aller à l'avis ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => { go(current + 1); restart(); }}
          disabled={current >= maxIndex}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink shadow-sm transition hover:border-sage-dark/40 disabled:opacity-30"
          aria-label="Suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
