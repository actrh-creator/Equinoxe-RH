import { Link, useParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  FileText,
  HeartHandshake,
  Lightbulb,
  MapPin,
  MessageCircle,
  MonitorCheck,
  Route,
  ShieldCheck,
  Target,
  Users
} from 'lucide-react';
import { ServiceCard } from '../components/Cards';
import { FAQAccordion } from '../components/FAQAccordion';
import { SEOHead } from '../components/SEOHead';
import { ButtonLink, Card, Container, PageHeader, Section } from '../components/ui';
import { services } from '../data/content';
import { breadcrumbSchema, faqSchema, serviceSchema } from '../lib/schemaMarkup';

const ORGANISATIONS_SLUGS = ['conseil-rh-entreprises', 'accompagnement-changement', 'formations-ateliers-codeveloppement'];
const VOUS_SLUGS = ['accompagnement-individuel', 'bilan-de-competences'];

const serviceImages: Record<string, string> = {
  'conseil-rh-entreprises': '/images/service_conseil_rh.webp',
  'accompagnement-changement': '/images/transition_professionnelle.webp',
  'accompagnement-individuel': '/images/coaching_collaboration.webp',
  'bilan-de-competences': '/images/service_conseil_rh.webp',
  'formations-ateliers-codeveloppement': '/images/meeting_collaboration.webp',
};

const iconMap = {
  target: Target,
  shield: ShieldCheck,
  users: Users,
  compass: Compass,
  heart: HeartHandshake,
  clipboard: ClipboardCheck,
  lightbulb: Lightbulb,
  map: MapPin,
  message: MessageCircle,
  monitor: MonitorCheck,
  file: FileText,
  route: Route,
  check: CheckCircle2
};

type DetailIcon = keyof typeof iconMap;

const serviceEditorialContent: Record<string, {
  introTitle: string;
  introParagraphs: string[];
  sideNote: { eyebrow: string; title: string; text: string };
  keyCards: { icon: DetailIcon; title: string; text: string }[];
  sections: { icon: DetailIcon; title: string; text: string }[];
  formats: { icon: DetailIcon; title: string; text: string }[];
}> = {
  'conseil-rh-entreprises': {
    introTitle: 'Un appui RH externe pour décider avec plus de recul',
    introParagraphs: [
      "Les décisions RH engagent durablement l'entreprise. Lorsqu'une situation devient complexe, un regard extérieur permet souvent de clarifier les enjeux et d'identifier les meilleures options.",
      "Mon intervention apporte une vision objective, des outils éprouvés et des recommandations concrètes pour sécuriser les décisions, faciliter l'action et concilier performance de l'entreprise et qualité des relations de travail."
    ],
    sideNote: {
      eyebrow: 'Enjeu entreprise',
      title: 'Un regard externe pour clarifier les décisions RH',
      text: 'L’accompagnement aide les dirigeants, managers et équipes RH à prendre du recul sur les situations sensibles, structurer les priorités et construire des réponses concrètes adaptées à leur organisation.'
    },
    keyCards: [
      { icon: 'target', title: 'Cadrer les priorités RH', text: 'Identifier les urgences, distinguer les symptômes des causes et poser une feuille de route claire.' },
      { icon: 'users', title: 'Soutenir les managers', text: 'Aider les responsables à clarifier leur posture, leurs messages et leurs marges de manœuvre.' },
      { icon: 'shield', title: 'Sécuriser les décisions', text: 'Apporter un regard externe avant une réorganisation, une évolution de rôle ou une situation sensible.' }
    ],
    sections: [
      { icon: 'clipboard', title: 'Diagnostic RH et compréhension du contexte', text: 'L’accompagnement commence par une analyse de la situation : organisation du travail, pratiques RH existantes, attentes des dirigeants, vécu des équipes, points de tension, enjeux de fidélisation ou de communication. Cette étape permet de formuler un diagnostic clair et de prioriser les actions utiles.' },
      { icon: 'message', title: 'Management, communication et relations de travail', text: 'Les difficultés RH naissent souvent dans les zones grises : rôles mal définis, messages contradictoires, absence de cadre, tensions non traitées, perte de confiance. Le travail consiste à restaurer de la lisibilité et à soutenir les managers dans une communication plus juste et plus structurée.' },
      { icon: 'check', title: 'Mise en œuvre et suivi opérationnel', text: 'Le conseil RH ne reste pas au niveau de l’intention. Il peut se traduire par des ateliers, des temps de régulation, des supports de décision, des repères managériaux ou un accompagnement progressif de la transformation. Les actions sont ajustées au rythme, à la taille et à la maturité RH de l’organisation.' }
    ],
    formats: [
      { icon: 'compass', title: 'Diagnostic court', text: 'Pour clarifier rapidement une situation RH ou managériale.' },
      { icon: 'users', title: 'Ateliers dirigeants ou managers', text: 'Pour aligner les pratiques et partager un cadre commun.' },
      { icon: 'route', title: 'Mission dans la durée', text: 'Pour accompagner une transformation qui se joue sur plusieurs mois.' }
    ]
  },
  'accompagnement-changement': {
    introTitle: 'Préparer les transitions sans perdre le sens ni l’engagement',
    introParagraphs: [
      "J'aide les dirigeants, managers et équipes à comprendre les enjeux de la transformation, à exprimer leurs préoccupations et à participer activement à la mise en œuvre des évolutions attendues. Grâce à une approche fondée sur l'écoute, le dialogue et la mobilisation collective, je facilite l'appropriation du changement, limite les résistances et favorise une transition durable, cohérente avec les objectifs de l'organisation et les réalités du terrain."
    ],
    sideNote: {
      eyebrow: "MON OFFRE",
      title: 'Préparer le changement avec les personnes concernées',
      text: 'L’enjeu est de rendre la transformation compréhensible, d’anticiper ses impacts humains et de soutenir les managers comme les équipes dans les moments de transition.'
    },
    keyCards: [
      { icon: 'compass', title: 'Donner du sens', text: 'Clarifier le pourquoi du changement et le rendre compréhensible pour les équipes.' },
      { icon: 'shield', title: 'Réduire l’incertitude', text: 'Identifier les impacts humains, les zones de risque et les besoins d’accompagnement.' },
      { icon: 'users', title: 'Mobiliser le collectif', text: 'Créer les conditions d’une coopération durable autour de la transformation.' }
    ],
    sections: [
      { icon: 'target', title: 'Analyser les impacts humains', text: 'Avant d’agir, il est nécessaire de comprendre ce que le changement modifie concrètement : responsabilités, repères, charge de travail, relations, compétences attendues, autonomie ou sentiment de reconnaissance. Cette analyse permet de traiter les résistances comme des informations utiles plutôt que comme de simples freins.' },
      { icon: 'message', title: 'Préparer la communication du changement', text: 'Les équipes ont besoin d’un récit clair, cohérent et incarné. L’accompagnement aide les dirigeants et managers à choisir les bons messages, à assumer les zones d’incertitude et à organiser des temps d’échange qui ne soient pas uniquement descendants.' },
      { icon: 'heart', title: 'Soutenir les managers et les équipes', text: 'Les managers portent souvent le changement au quotidien, parfois sans disposer de repères suffisants. Le travail peut porter sur leur posture, la régulation des tensions, la conduite d’ateliers, l’écoute des signaux faibles et le maintien de la qualité du travail pendant la transition.' }
    ],
    formats: [
      { icon: 'clipboard', title: 'Cartographie des impacts', text: 'Pour repérer ce que la transformation change réellement.' },
      { icon: 'message', title: 'Ateliers d’appropriation', text: 'Pour ouvrir le dialogue et construire des repères communs.' },
      { icon: 'check', title: 'Suivi post-déploiement', text: 'Pour ajuster après les premières mises en pratique.' }
    ]
  },
  'accompagnement-individuel': {
    introTitle: 'Un espace confidentiel pour clarifier sa posture et ses décisions',
    introParagraphs: [
      "Certaines situations professionnelles méritent un temps de réflexion pour prendre du recul, retrouver de la sérénité et faire des choix éclairés.",
      "J'accompagne les managers, dirigeants et salariés confrontés à des questionnements, des difficultés relationnelles, des périodes de changement ou des décisions importantes dans leur parcours professionnel. Dans un cadre confidentiel et professionnel, nous explorons ensemble la situation, clarifions les enjeux et identifions des pistes d'action concrètes. Mon objectif est de vous aider à renforcer votre confiance, ajuster votre posture et avancer avec davantage de clarté et de cohérence."
    ],
    sideNote: {
      eyebrow: "MON OFFRE",
      title: 'Un espace pour retrouver de la clarté',
      text: 'Le travail permet de poser les faits, comprendre ce qui se joue, clarifier sa posture et avancer avec des décisions plus justes dans un cadre confidentiel.'
    },
    keyCards: [
      { icon: 'compass', title: 'Prendre du recul', text: 'Sortir de l’urgence pour comprendre les enjeux professionnels et relationnels.' },
      { icon: 'heart', title: 'Renforcer sa posture', text: 'Travailler la confiance, la communication, le cadre et la prise de décision.' },
      { icon: 'target', title: 'Avancer concrètement', text: 'Définir des actions réalistes entre les séances et mesurer les avancées.' }
    ],
    sections: [
      { icon: 'message', title: 'Clarifier une situation professionnelle sensible', text: 'Une difficulté relationnelle, une prise de poste ou un conflit latent peut brouiller la lecture de la situation. L’accompagnement aide à distinguer les faits, les émotions, les enjeux de rôle et les choix possibles pour retrouver de la clarté.' },
      { icon: 'shield', title: 'Travailler dans un cadre confidentiel', text: 'La confidentialité permet de déposer les sujets sans jugement : doutes, fatigue, perte de sens, hésitation, peur de se tromper ou besoin de poser des limites. Ce cadre est essentiel pour élaborer des décisions plus solides.' },
      { icon: 'lightbulb', title: 'Transformer la réflexion en action', text: 'Chaque accompagnement vise des effets concrets : mieux préparer un échange, clarifier ses priorités, ajuster sa communication, reprendre sa place, sécuriser une décision ou construire une prochaine étape professionnelle.' }
    ],
    formats: [
      { icon: 'monitor', title: 'Séances en visio', text: 'Pour un accompagnement souple, régulier et confidentiel.' },
      { icon: 'map', title: 'Présentiel à Toulouse', text: 'Lorsque le cadre local est préférable.' },
      { icon: 'route', title: 'Parcours ajusté', text: 'Rythme et durée définis selon l’objectif travaillé.' }
    ]
  },
  'bilan-de-competences': {
    introTitle: 'Faire le point pour construire une trajectoire professionnelle cohérente',
    introParagraphs: [
      "Un parcours professionnel n'est pas qu'une succession de postes. Heureusement. C'est une histoire faite d'expériences, de réussites, de questionnements et d'apprentissages.",
      "Le bilan de compétences vous permet de relire cette histoire avec un regard nouveau afin d'identifier ce qui vous anime, ce que vous maîtrisez et les perspectives qui s'offrent à vous. Docteure en gestion des ressources humaines et forte de plus de 20 ans de pratique en accompagnement des carrières, je vous aide à transformer votre expérience en un projet professionnel cohérent, réaliste et aligné avec vos aspirations. Ensemble, nous construisons une trajectoire qui s'appuie sur vos ressources, pour laisser derrière vous vos incertitudes."
    ],
    sideNote: {
      eyebrow: "MON OFFRE",
      title: 'Faire le point sans repartir de zéro',
      text: 'Le bilan aide à relire son parcours, identifier ses ressources, explorer des pistes réalistes et construire une trajectoire professionnelle cohérente.'
    },
    keyCards: [
      { icon: 'file', title: 'Analyser son parcours', text: 'Relire les expériences, compétences, réussites, choix et moments de rupture.' },
      { icon: 'compass', title: 'Explorer les pistes', text: 'Identifier des options cohérentes avec ses motivations et le marché.' },
      { icon: 'check', title: 'Décider avec méthode', text: 'Construire un plan d’action réaliste, progressif et sécurisant.' }
    ],
    sections: [
      { icon: 'target', title: 'Comprendre ses moteurs professionnels', text: 'Le bilan explore ce qui donne de l’énergie, ce qui épuise, ce qui motive, ce qui bloque et ce qui devient nécessaire pour la suite. Cette étape permet de dépasser les réponses trop rapides et d’identifier des critères de choix solides.' },
      { icon: 'clipboard', title: 'Mettre en valeur ses compétences', text: 'Les compétences ne se résument pas à une fiche de poste. Le travail porte sur les savoir-faire, savoir-être, expériences transférables, appétences, modes de fonctionnement et ressources développées dans différents contextes.' },
      { icon: 'route', title: 'Construire un projet réalisable', text: 'La phase de projection confronte les pistes aux contraintes réelles : marché, formation, rythme, ressources financières, environnement personnel et étapes nécessaires. Le résultat attendu est une trajectoire plus claire, pas une promesse artificielle.' }
    ],
    formats: [
      { icon: 'shield', title: 'Cadre confidentiel', text: 'Un espace pour poser les questions de fond sans pression.' },
      { icon: 'monitor', title: 'À distance ou Toulouse', text: 'Des rendez-vous organisés selon les contraintes de chacun.' },
      { icon: 'file', title: 'Synthèse structurée', text: 'Un document de fin de parcours pour garder des repères.' }
    ]
  },
  'formations-ateliers-codeveloppement': {
    introTitle: 'Des formats collectifs pour apprendre, coopérer et transformer les pratiques',
    introParagraphs: [
      "Prendre du recul sur ses pratiques est souvent plus facile lorsqu'on peut s'appuyer sur l'expérience et le regard des autres.",
      "J'anime des ateliers et des groupes de co-développement qui permettent aux participants d'échanger autour de situations réelles, de partager leurs expériences et de construire ensemble des réponses concrètes aux défis rencontrés. Grâce à une méthode structurée et participative, chacun développe ses compétences, enrichit ses pratiques et bénéficie de la richesse du collectif pour progresser dans son activité professionnelle."
    ],
    sideNote: {
      eyebrow: "MON OFFRE",
      title: 'Apprendre à partir des situations réelles',
      text: 'Les ateliers et le co-développement créent un cadre vivant pour partager les pratiques, analyser les situations de terrain et installer des repères communs.'
    },
    keyCards: [
      { icon: 'users', title: 'Faire collectif', text: 'Créer un espace de dialogue où les participants peuvent apprendre les uns des autres.' },
      { icon: 'lightbulb', title: 'Outiller les pratiques', text: 'Transformer les échanges en repères concrets pour le quotidien professionnel.' },
      { icon: 'message', title: 'Installer le dialogue', text: 'Favoriser la parole utile, la régulation et l’intelligence collective.' }
    ],
    sections: [
      { icon: 'clipboard', title: 'Concevoir un format adapté au besoin', text: 'Chaque intervention commence par un cadrage : public concerné, objectifs, niveau de maturité, contraintes de temps, sujets sensibles et livrables attendus. Le format est construit pour rester utile, vivant et directement relié au terrain.' },
      { icon: 'users', title: 'Animer des ateliers participatifs', text: 'Les ateliers alternent apports, échanges, mises en situation, analyse de cas et temps de formalisation. L’enjeu est d’éviter une formation descendante et de permettre aux participants de repartir avec des repères actionnables.' },
      { icon: 'heart', title: 'Développer la coopération et le co-développement', text: 'Le co-développement aide les professionnels à analyser collectivement des situations réelles, à bénéficier du regard des pairs et à renforcer leurs capacités de décision. C’est un format particulièrement pertinent pour les managers et équipes RH.' }
    ],
    formats: [
      { icon: 'users', title: 'Ateliers collectifs', text: 'Pour travailler un enjeu managérial ou RH précis.' },
      { icon: 'message', title: 'Co-développement', text: 'Pour analyser des situations réelles entre pairs.' },
      { icon: 'monitor', title: 'Webinaires', text: 'Pour sensibiliser un public plus large à distance.' }
    ]
  }
};

export function ServicesIndexPage() {
  const organisationsServices = services.filter((s) => ORGANISATIONS_SLUGS.includes(s.slug));
  const vousServices = services.filter((s) => VOUS_SLUGS.includes(s.slug));

  return (
    <>
      <SEOHead
        title="Conseil RH pour les organisations & accompagnement individuel | ACT&RH"
        description="Conseil RH, accompagnement du changement, formations et co-développement pour les organisations. Bilan de compétences et accompagnement individuel pour les personnes."
        schema={breadcrumbSchema([{ name: 'Accueil', url: '/' }, { name: 'Pour les organisations & pour vous', url: '/services' }])}
      />

      {/* Section 1: Hero (With background) */}
      <div className="relative overflow-hidden border-b border-sand bg-rosé pt-14">
        {/* Decorative background elements - enhanced visibility and explicit styling */}
        <div className="absolute -right-20 -top-20 z-0 h-[450px] w-[450px] rounded-full border-[55px] border-white opacity-40" />
        <div className="absolute -left-10 -bottom-10 z-0 h-72 w-72 rounded-full border-[35px] border-white opacity-25" />
        <div className="absolute right-[20%] top-1/3 z-0 h-40 w-40 rounded-full border-[15px] border-white opacity-20" />

        <Container className="relative z-10 pb-12 pt-10 sm:pb-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-sage-dark/20 bg-sage px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">Accompagnements</p>
            <h1 className="font-serif text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl animate-fade-in-up">Pour les organisations, et pour vous</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-anthracite/80 animate-fade-in-up delay-100">Deux formes d'accompagnement, une même manière de travailler : comprendre la situation, clarifier les choix, construire la suite.</p>
          </div>
          <div className="mx-auto aspect-[4/3] w-full max-w-[480px] overflow-hidden rounded-[2rem] border border-sand bg-white p-3.5 shadow-soft lg:max-w-none animate-float">
            <img
              src="/images/coaching_collaboration.png"
              alt="Conseil RH et accompagnement individuel"
              onError={(event) => { event.currentTarget.src = '/images/meeting_collaboration.webp'; }}
              className="h-full w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </Container>
      </div>

      {/* Section 2: Pour les organisations */}
      <Section id="organisations" className="scroll-mt-24 bg-white">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Pour les organisations</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">Des situations RH qui nécessitent un regard extérieur</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-anthracite/75">
            J'interviens auprès des dirigeants, managers et professionnels RH, dans les TPE, PME comme dans des organisations plus importantes, lorsque les enjeux humains, managériaux ou organisationnels nécessitent de prendre du recul et de structurer une réponse.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organisationsServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 3: Pour vous */}
      <Section id="vous" className="scroll-mt-24 border-t border-sand bg-ivory">
        <Container>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Pour vous</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">Prendre du recul. Décider. Avancer.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-anthracite/75">
            J'accompagne les personnes qui souhaitent mieux comprendre ce qu'elles vivent, identifier leurs ressources, faire des choix et avancer avec davantage de clarté — qu'il s'agisse d'une question professionnelle, d'une prise de responsabilité, d'une transition de carrière ou d'un besoin de prendre du recul.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {vousServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

export function ServiceDetailPage() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug) ?? services[0];
  const editorial = serviceEditorialContent[service.slug] ?? serviceEditorialContent['conseil-rh-entreprises'];
  
  return (
    <>
      <SEOHead title={service.seoTitle} description={service.seoDescription} schema={[serviceSchema(service), faqSchema(service.faqs), breadcrumbSchema([{ name: 'Accueil', url: '/' }, { name: 'Accompagnements', url: '/services' }, { name: service.title, url: `/services/${service.slug}` }])]} />
      
      {/* Section 1: PageHeader (With background, handled by default PageHeader styling) */}
      <PageHeader eyebrow="Accompagnement" title={service.title} text={service.shortDescription} />
      
      {/* Section 2: Content columns (Without background) */}
      <Section className="bg-white">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_0.62fr] lg:items-start">
            <div>
              <div className="prose-actrh max-w-none">
                <p className="text-lg leading-8"><HighlightedText text={service.longDescription} /></p>
                <h2 className="mt-8 font-serif text-3xl text-ink">{editorial.introTitle}</h2>
                {editorial.introParagraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-5"><HighlightedText text={paragraph} /></p>
                ))}
              </div>

              <div className="mt-7 rounded-[2rem] border border-sand bg-ivory p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Repères pratiques</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {[
                    {
                      icon: MapPin,
                      label: 'Toulouse',
                      text: 'Présentiel possible selon le cadre.'
                    },
                    {
                      icon: MonitorCheck,
                      label: 'Visio',
                      text: 'Accompagnement à distance structuré.'
                    },
                    {
                      icon: ShieldCheck,
                      label: 'Cadre clair',
                      text: 'Confidentialité, méthode et objectifs.'
                    }
                  ].map(({ icon: Icon, label, text }) => (
                    <div key={label} className="rounded-2xl border border-sand bg-white p-4">
                      <Icon size={19} className="text-sage-dark" />
                      <p className="mt-3 text-sm font-bold text-ink">{label}</p>
                      <p className="mt-2 text-xs leading-5 text-anthracite/65"><HighlightedText text={text} /></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="overflow-hidden rounded-[2rem] border border-sand bg-white p-3.5 shadow-soft">
                <img 
                  src={serviceImages[service.slug] || '/images/meeting_collaboration.webp'} 
                  alt={service.title} 
                  onError={(event) => { event.currentTarget.src = '/images/meeting_collaboration.webp'; }}
                  className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
                />
              </div>
              
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <Card className="border border-sand bg-rosé">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage-dark">{editorial.sideNote.eyebrow}</p>
                  <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight text-ink">{editorial.sideNote.title}</h2>
                  <p className="mt-5 leading-7 text-anthracite/80">
                    <HighlightedText text={editorial.sideNote.text} />
                  </p>
                </Card>
                
                <Card className="bg-white border border-sand">
                  <h2 className="font-serif text-2xl text-ink">Échanger sur ce besoin</h2>
                  <p className="mt-5 leading-7 text-anthracite/75">
                    Un premier échange permet de qualifier la situation et le cadre adapté, en visio, à Toulouse ou sur site selon la mission.
                  </p>
                  <div className="mt-5">
                    <ButtonLink to="/contact">Contacter Caroline</ButtonLink>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {editorial.keyCards.map(({ icon, title, text }) => {
              const Icon = iconMap[icon];
              return (
                <Card key={title} className="h-full border border-sand bg-ivory transition-all duration-500 hover:-translate-y-1 hover:border-sage-dark/25 hover:bg-white hover:shadow-soft">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-sage-dark shadow-sm">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-semibold leading-tight text-ink">{title}</h3>
                  <p className="mt-5 text-sm leading-7 text-anthracite/75"><HighlightedText text={text} /></p>
                </Card>
              );
            })}
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {editorial.sections.map(({ icon, title, text }) => {
              const Icon = iconMap[icon];
              return (
                <article key={title} className="h-full rounded-2xl border border-sand bg-white p-6 shadow-sm transition-all duration-500 hover:border-sage-dark/20 hover:shadow-soft">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rosé text-sage-dark">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight text-ink">{title}</h3>
                  <p className="mt-5 text-sm leading-7 text-anthracite/75 sm:text-base"><HighlightedText text={text} /></p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 rounded-[2rem] border border-sand bg-rosé p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Formats possibles</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">Un cadre ajusté à la situation</h2>
              </div>
              <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-sage-dark transition hover:text-ink">
                Demander un échange <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {editorial.formats.map(({ icon, title, text }) => {
                const Icon = iconMap[icon];
                return (
                  <div key={title} className="rounded-2xl border border-sand bg-white p-5">
                    <Icon size={22} className="text-sage-dark" />
                    <h3 className="mt-4 font-serif text-xl font-semibold text-ink">{title}</h3>
                    <p className="mt-4 text-sm leading-6 text-anthracite/70"><HighlightedText text={text} /></p>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 3: Practical details */}
      <Section className="border-y border-sand bg-sage/20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border border-sand bg-white">
              <h2 className="font-serif text-2xl text-ink">Publics concernés</h2>
              <List items={service.targetAudience} compact highlight />
            </Card>
            <Card className="border border-sand bg-white">
              <h2 className="font-serif text-2xl text-ink">Problématiques traitées</h2>
              <List items={service.issues} compact highlight />
            </Card>
            <Card className="border border-sand bg-white">
              <h2 className="font-serif text-2xl text-ink">Bénéfices attendus</h2>
              <List items={service.benefits} compact highlight />
            </Card>
            <Card className="border border-sand bg-white">
              <h2 className="font-serif text-2xl text-ink">Exemples de situations</h2>
              <List items={service.examples} compact highlight />
            </Card>
          </div>

          <div className="mt-8 rounded-[2rem] border border-sand bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage-dark">Déroulé</p>
                <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">Méthode d’accompagnement</h2>
                <p className="mt-5 text-sm leading-7 text-anthracite/75">
                  Chaque étape est ajustée au contexte : besoin individuel, équipe, dirigeant, entreprise ou collectif en transformation.
                </p>
              </div>
              <List items={service.method} ordered highlight />
            </div>
          </div>
        </Container>
      </Section>
      
      {/* Section 4: FAQ */}
      <Section className="bg-white">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-serif text-4xl text-ink">FAQ spécifique</h2>
            <p className="mt-4 text-anthracite/75">Questions fréquentes sur cet accompagnement.</p>
          </div>
          <FAQAccordion items={service.faqs} />
        </Container>
      </Section>
      
      {/* Section 5: Other services (Without background) */}
      <Section className="bg-white">
        <Container>
          <h2 className="font-serif text-4xl text-ink">Autres accompagnements</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {services.filter((s) => s.slug !== service.slug).map((s) => (
              <Link 
                key={s.slug} 
                to={`/services/${s.slug}`} 
                className="rounded-full border border-sand px-4 py-2 text-sm font-bold text-ink hover:text-sage-dark hover:border-sage-dark transition-all duration-300 bg-white"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

const highlightedKeywords = [
  'professionnels en transition',
  'transition professionnelle',
  'bilan de compétences',
  'accompagnement du changement',
  'Conseil RH',
  'ACT&RH',
  'Toulouse',
  'Occitanie',
  'distance',
  'visioconférence',
  'visio',
  'sur site',
  'entreprises',
  'entreprise',
  'dirigeants',
  'managers',
  'salariés',
  'entrepreneurs',
  'étudiants',
  'etudiants',
  'DRH',
  'RRH',
  'TPE',
  'PME',
  'RH',
  'accompagnement',
  'transition',
  'transformation',
  'management',
  'posture',
  'communication',
  'compétences',
  'co-développement',
  'équipes',
  'collectif',
  'confidentiel'
];

const sortedHighlightedKeywords = [...highlightedKeywords].sort((a, b) => b.length - a.length);
const highlightedPattern = new RegExp(`(${sortedHighlightedKeywords.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

function HighlightedText({ text }: { text: string }) {
  return <>{text}</>;
}

function List({ items, ordered = false, compact = false, highlight = false }: { items: string[]; ordered?: boolean; compact?: boolean; highlight?: boolean }) {
  if (ordered) {
    return (
      <ol className={`${compact ? 'space-y-2' : 'space-y-3'} mt-4 list-none pl-0`}>
        {items.map((item, idx) => (
          <li key={item} className={`flex items-start text-anthracite/85 ${compact ? 'gap-3 text-sm' : 'gap-4'}`}>
            <span className={`${compact ? 'h-5 w-5 text-xs' : 'h-6 w-6 text-sm'} flex shrink-0 items-center justify-center rounded-full bg-sage font-serif font-bold text-white`}>
              {idx + 1}
            </span>
            <span className="leading-7">{highlight ? <HighlightedText text={item} /> : item}</span>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <ul className={`${compact ? 'space-y-2' : 'space-y-3'} mt-4 list-none pl-0`}>
      {items.map((item) => (
        <li key={item} className={`flex items-start text-anthracite/85 ${compact ? 'gap-3 text-sm' : 'gap-4'}`}>
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />
          <span className="leading-7">{highlight ? <HighlightedText text={item} /> : item}</span>
        </li>
      ))}
    </ul>
  );
}
