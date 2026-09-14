import { SEOHead } from '../components/SEOHead';
import { Container, PageHeader, Section, ButtonLink, Card } from '../components/ui';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  Compass, 
  Shuffle, 
  Lightbulb, 
  GraduationCap, 
  Users,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { services } from '../data/content';
import { breadcrumbSchema } from '../lib/schemaMarkup';

const audienceContent: Record<string, any> = {
  'entreprises-dirigeants': {
    title: 'Entreprises et dirigeants',
    icon: Building2,
    eyebrow: 'Pour les organisations',
    description: 'Sécuriser la croissance, structurer les RH et accompagner les transformations de votre structure.',
    longDescription: "Pour une TPE, une PME ou une grande entreprise, les enjeux humains sont les piliers de la performance durable. J'apporte un regard extérieur expert pour clarifier vos pratiques et soutenir vos équipes de direction.",
    challenges: [
      'Structuration de la fonction RH (recrutement, intégration, fidélisation)',
      'Prévention des risques psychosociaux et des tensions sociales',
      'Accompagnement lors d’une fusion, acquisition ou réorganisation',
      'Développement d’une culture managériale cohérente'
    ],
    examples: [
      "Audit et optimisation des processus RH pour une PME en forte croissance.",
      "Mise en place d'un baromètre d'engagement et plan d'action associé."
    ],
    relatedServices: ['conseil-rh-entreprises', 'accompagnement-changement', 'formations-ateliers-codeveloppement']
  },
  'managers': {
    title: 'Managers',
    icon: Compass,
    eyebrow: 'Pour l’encadrement',
    description: 'Développer votre posture, gérer les complexités relationnelles et affirmer votre leadership.',
    longDescription: 'Le manager est au cœur des tensions et des attentes. Je vous aide à prendre du recul sur votre pratique quotidienne pour gagner en sérénité et en efficacité.',
    challenges: [
      'Prise de fonction ou évolution vers un poste de direction',
      'Gestion de conflits au sein de l’équipe',
      'Communication de décisions difficiles ou impopulaires',
      'Équilibre entre exigences opérationnelles et soutien humain'
    ],
    examples: [
      'Accompagnement individuel pour un manager faisant face à une équipe désengagée.',
      'Atelier sur la délégation et le feedback constructif.',
      'Accompagnement à la gestion du temps et des priorités managériales.'
    ],
    relatedServices: ['accompagnement-individuel', 'formations-ateliers-codeveloppement']
  },
  'salaries-transitions': {
    title: 'Salariés et professionnels en transition',
    icon: Shuffle,
    eyebrow: 'Pour votre carrière',
    description: 'Faire le point sur votre parcours, identifier vos forces et dessiner votre prochain projet.',
    longDescription: 'Que vous soyez en poste, en recherche ou en questionnement, je vous propose un cadre sécurisé pour explorer vos possibles et valider vos choix professionnels.',
    challenges: [
      'Perte de sens dans les missions actuelles',
      'Envie de reconversion ou d’évolution interne',
      'Difficultés relationnelles ou souffrance au travail',
      'Préparation d’une mobilité géographique ou sectorielle'
    ],
    examples: [
      'Bilan de compétences complet pour valider un projet de reconversion.',
      'Accompagnement à la préparation d’entretiens de recrutement stratégiques.',
      'Accompagnement professionnel à la suite d’un épuisement professionnel ou d’un licenciement.'
    ],
    relatedServices: ['bilan-de-competences', 'accompagnement-individuel']
  },
  'entrepreneurs': {
    title: 'Entrepreneurs',
    icon: Lightbulb,
    eyebrow: 'Pour les créateurs',
    description: 'Poser les fondations RH de votre projet et anticiper les premiers recrutements.',
    longDescription: 'L’aventure entrepreneuriale nécessite une vision claire dès les premières étapes. Je vous accompagne pour que l’humain soit un moteur de votre réussite dès le premier jour.',
    challenges: [
      'Rédaction des premières fiches de poste et stratégie de recrutement',
      'Définition des valeurs et de la marque employeur',
      'Structuration de la politique de rémunération et d’avantages',
      'Postures de l’entrepreneur-manager'
    ],
    examples: [
      'Cadrage des premiers recrutements pour une start-up en phase de scale-up.',
      'Définition d’un règlement intérieur et d’une charte de télétravail adaptée.',
      'Accompagnement à la structuration du dialogue social initial.'
    ],
    relatedServices: ['conseil-rh-entreprises', 'accompagnement-individuel']
  },
  'etudiants': {
    title: 'Étudiants',
    icon: GraduationCap,
    eyebrow: 'Pour votre avenir',
    description: 'Clarifier votre orientation et préparer votre entrée sur le marché du travail.',
    longDescription: 'Le passage du monde académique au monde professionnel est une transition majeure. Je vous aide à valoriser vos atouts et à cibler les environnements qui vous correspondent.',
    challenges: [
      'Choix de spécialisation ou de master',
      'Identification des compétences transférables',
      'Construction d’un réseau professionnel pertinent',
      'Confiance en soi et posture en entretien'
    ],
    examples: [
      'Bilan d’orientation pour un étudiant en fin de cycle licence.',
      'Simulation d’entretiens pour des stages de fin d’études en cabinet de conseil.',
      'Aide à la construction d’un profil LinkedIn attractif et authentique.'
    ],
    relatedServices: ['bilan-de-competences', 'accompagnement-individuel']
  },
  'collectifs-equipes': {
    title: 'Collectifs et équipes',
    icon: Users,
    eyebrow: 'Pour la cohésion',
    description: 'Renforcer les liens, clarifier les rôles et booster l’intelligence collective.',
    longDescription: 'Une équipe performante est une équipe qui sait communiquer, réguler ses tensions et partager un objectif commun. Nous intervenons pour fluidifier ces dynamiques.',
    challenges: [
      'Tensions ou non-dits freinant la productivité',
      'Besoin de co-construire de nouvelles méthodes de travail',
      'Arrivée d’un nouveau responsable ou fusion de deux services',
      'Manque de transversalité entre les métiers'
    ],
    examples: [
      'Séminaire de "team building" axé sur la résolution de problèmes collectifs.',
      'Mise en place de cercles de co-développement managérial.',
      'Atelier de clarification des rôles et responsabilités (RACI).'
    ],
    relatedServices: ['formations-ateliers-codeveloppement', 'accompagnement-changement']
  }
};

export function AudiencePage() {
  const { slug } = useParams();
  const audience = audienceContent[slug || ''] || audienceContent['entreprises-dirigeants'];
  const Icon = audience.icon;

  return (
    <>
      <SEOHead
        title={`${audience.title} | Conseil RH & accompagnement individuel | ACT&RH`}
        description={audience.description}
        schema={breadcrumbSchema([{ name: 'Accueil', url: '/' }, { name: audience.title, url: `/pour-qui/${slug}` }])}
      />
      <PageHeader eyebrow={audience.eyebrow} title={audience.title} text={audience.description} />
      
      <Section className="bg-white">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="prose-actrh max-w-none">
            <h2 className="font-serif text-3xl text-ink">L'enjeu de cette situation</h2>
            <p className="text-lg leading-8 text-anthracite/80">{audience.longDescription}</p>
            
            <h2 className="font-serif text-3xl text-ink mt-10">Problématiques fréquentes</h2>
            <ul className="space-y-4 mt-6 list-none pl-0">
              {audience.challenges.map((item: string) => (
                <li key={item} className="flex gap-4 items-start text-anthracite/85">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-champagne" />
                  <span className="leading-7">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 rounded-3xl bg-sage/10 border border-sand p-8">
              <h2 className="font-serif text-2xl text-ink !mt-0 mb-6">Exemples concrets d'intervention</h2>
              <div className="grid gap-6">
                {audience.examples.map((example: string, idx: number) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <CheckCircle2 size={20} className="text-sage-dark shrink-0 mt-1" />
                    <p className="text-anthracite/80 italic text-base leading-relaxed">{example}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24">
            <Card className="border border-sand bg-white p-8">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sage text-white">
                <Icon size={32} />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-ink">Comprendre avant d'agir</h3>
              <p className="mt-4 text-anthracite/75 leading-7">
                Chaque situation a son contexte : l'accompagnement commence toujours par prendre le temps de le comprendre, avant de construire une réponse adaptée.
              </p>
              <div className="mt-8">
                <ButtonLink to="/contact" className="w-full justify-center">Parler de votre besoin</ButtonLink>
              </div>
            </Card>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-sage-dark px-2">Accompagnements conseillés</h4>
              <div className="grid gap-3">
                {audience.relatedServices.map((serviceSlug: string) => {
                  const service = services.find(s => s.slug === serviceSlug);
                  if (!service) return null;
                  return (
                    <Link 
                      key={serviceSlug}
                      to={`/services/${serviceSlug}`}
                      className="group flex items-center justify-between rounded-2xl border border-sand bg-white p-5 transition-all hover:border-champagne/30 hover:shadow-soft"
                    >
                      <span className="font-semibold text-ink group-hover:text-sage-dark transition-colors">{service.title}</span>
                      <ArrowRight size={18} className="text-sage-dark/40 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </Container>
      </Section>

      <Section className="bg-rosé border-y border-sand">
        <Container className="text-center">
          <h2 className="font-serif text-4xl font-semibold text-ink">Prêt à clarifier votre situation ?</h2>
          <p className="mt-4 text-lg text-anthracite/70 max-w-2xl mx-auto">
            Un premier échange téléphonique de 15 minutes permet de poser les bases de notre collaboration, sans engagement.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <ButtonLink to="/contact">Prendre contact</ButtonLink>
            <ButtonLink to="/services" variant="secondary">Voir tous les services</ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
