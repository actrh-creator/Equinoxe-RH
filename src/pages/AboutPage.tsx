import { useEffect, useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { ButtonLink, Container, PageHeader, Section, Card } from '../components/ui';
import { breadcrumbSchema, personSchema } from '../lib/schemaMarkup';
import { Award, GraduationCap, Users, Heart, Lightbulb, ShieldCheck, Target, BookOpen, Building2, HeartHandshake, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export function AboutPage() {
  const [cabinetImg, setCabinetImg] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('site_settings').select('value').eq('key', 'cabinet_image_url').single()
      .then(({ data }) => { if (data?.value) setCabinetImg(data.value); });
  }, []);

  const photoSrc = cabinetImg
    ?? '/images/Professeur TILLOU Caroline - TBS Education.webp';

  return (
    <>
      <SEOHead
        title="Ma démarche | Caroline Tillou Maratuech — Docteure en GRH, conseil RH & accompagnement individuel | ACT&RH"
        description="Recherche en gestion des ressources humaines, enseignement, conseil RH et accompagnement individuel : la démarche de Caroline Tillou Maratuech, fondatrice d'ACT&RH, à Toulouse, en Occitanie, en France et à distance."
        schema={[personSchema, breadcrumbSchema([{ name: 'Accueil', url: '/' }, { name: 'Ma démarche', url: '/a-propos' }])]}
      />
      <PageHeader
        eyebrow="Ma démarche"
        title="Ce qui nourrit ma pratique"
        text="Recherche, enseignement, conseil RH et accompagnement individuel : quatre dimensions complémentaires, réunies dans une même manière de travailler."
      />

      {/* Valeurs & identité */}
      <Section className="bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="space-y-10">

              {/* Bloc valeurs */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne-dark">Ce qui nourrit ma pratique</p>
                <p className="mt-5 text-lg leading-8 text-anthracite/80">
                  Ce qui m'intéresse depuis longtemps, ce sont les situations dans toute leur richesse : ce que vivent les personnes, ce qui se joue dans les organisations, les relations qui se nouent et les choix auxquels chacun peut être confronté.
                </p>
                <p className="mt-4 text-base leading-7 text-anthracite/75">
                  Mon parcours m'a conduite à croiser recherche, enseignement, conseil et accompagnement, avec une même envie : prendre du recul, mettre les situations en perspective et chercher ce qui peut réellement faire évoluer les choses.
                </p>
              </div>

              {/* Valeurs cartes */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { Icon: Target, titre: 'Clarté', texte: 'Nommer les choses avec précision pour ne pas tourner autour du problème.' },
                  { Icon: ShieldCheck, titre: 'Confidentialité', texte: 'Un cadre de travail sécurisé, sans jugement, avec une déontologie rigoureuse.' },
                  { Icon: Lightbulb, titre: 'Utilité réelle', texte: 'Des accompagnements concrets, ajustés à ce que vous vivez — pas à un modèle.' },
                ].map(({ Icon, titre, texte }) => (
                  <div key={titre} className="rounded-2xl border border-sand bg-ivory p-5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-champagne-dark shadow-sm">
                      <Icon size={20} />
                    </span>
                    <p className="mt-4 font-serif text-lg font-semibold text-ink">{titre}</p>
                    <p className="mt-2 text-sm leading-6 text-anthracite/70">{texte}</p>
                  </div>
                ))}
              </div>

              {/* Les quatre dimensions */}
              <div className="border-t border-sand pt-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne-dark">Un parcours à la croisée de la recherche, du terrain et de l'accompagnement</p>
                <p className="mt-5 text-base leading-7 text-anthracite/75">
                  Depuis plus de 20 ans, je travaille sur les questions de ressources humaines, de management et de relations au travail. Ces différentes activités se sont développées en parallèle et se nourrissent les unes des autres.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    {
                      icon: BookOpen,
                      title: 'La recherche',
                      text: "Titulaire d'un doctorat en gestion des ressources humaines, je mène depuis plus de 20 ans des recherches en sciences de gestion sur des sujets tels que l'engagement au travail, le sens au travail, les relations professionnelles, la gestion du changement ou encore les transformations des organisations. Cette recherche est avant tout une recherche appliquée : elle part de questions rencontrées dans les entreprises et les organisations, parfois dans des contextes ou des secteurs d'activité spécifiques. À titre d'exemple, ma thèse fut menée en collaboration avec le SYNTEC Conseil en Management et réalisée auprès d'une vingtaine d'acteurs du secteur en France. Cette attention portée aux réalités professionnelles reste au cœur de ma façon de travailler."
                    },
                    {
                      icon: GraduationCap,
                      title: "L'enseignement",
                      text: "L'enseignement, à TBS Education, prolonge cette réflexion. Transmettre des connaissances suppose de les questionner, de les mettre en perspective et de les confronter aux expériences et aux interrogations de celles et ceux qui se forment aux métiers des ressources humaines et du management."
                    },
                    {
                      icon: Building2,
                      title: 'Le conseil RH',
                      text: "Le conseil RH m'amène à travailler au plus près des organisations et de leurs enjeux concrets. Il permet de confronter les concepts et les modèles aux réalités du quotidien, aux contraintes, aux relations et aux choix auxquels les acteurs doivent faire face."
                    },
                    {
                      icon: HeartHandshake,
                      title: "L'accompagnement individuel",
                      text: "J'ai développé une activité de conseil et d'accompagnement individuel avec l'envie de rester encore davantage au contact des entreprises et de celles et ceux qui y travaillent. Évolution professionnelle, prise de responsabilité, questionnement, transition ou difficulté ponctuelle : certaines périodes nécessitent de pouvoir prendre du recul, poser les choses et retrouver des marges de manœuvre."
                    }
                  ].map(({ icon: Icon, title, text }) => (
                    <details key={title} className="group rounded-2xl border border-sand bg-ivory p-0 shadow-sm transition-all duration-300 open:border-sage-dark/25 open:bg-white open:shadow-soft">
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
                </div>
              </div>

              {/* Pourquoi réunir ces différentes dimensions */}
              <div className="border-t border-sand pt-8">
                <h2 className="font-serif text-3xl font-semibold text-ink">Pourquoi réunir ces différentes dimensions ?</h2>
                <p className="mt-5 text-base leading-7 text-anthracite/75">
                  Parce qu'elles ne s'opposent pas : elles se complètent. La recherche apporte des clés de lecture. Le terrain confronte ces clés à la réalité. L'enseignement permet de prendre du recul et de transmettre. L'accompagnement permet de mobiliser tout cela au service d'une situation singulière.
                </p>
                <p className="mt-4 text-base leading-7 text-anthracite/75">
                  C'est cette boucle qui donne aujourd'hui son sens à mon activité : continuer à apprendre, confronter les connaissances au réel, transmettre ce que j'en retire et mettre cette compréhension au service de personnes et d'organisations qui cherchent à avancer.
                </p>
                <div className="relative mt-6 grid gap-4 sm:grid-cols-4">
                  {[
                    { label: 'Recherche', icon: BookOpen },
                    { label: 'Terrain', icon: Building2 },
                    { label: 'Transmission', icon: GraduationCap },
                    { label: 'Accompagnement', icon: HeartHandshake }
                  ].map(({ label, icon: Icon }, index) => (
                    <div key={label} className="relative flex items-center gap-3 rounded-2xl border border-sand bg-ivory px-3 py-4 shadow-[0_10px_24px_rgba(14,27,41,0.035)] sm:flex-col sm:items-center sm:gap-0 sm:text-center">
                      <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink bg-ink text-champagne sm:mx-auto">
                        <Icon size={18} />
                      </span>
                      <p className="min-w-0 flex-1 font-serif text-sm font-semibold leading-tight text-ink sm:mt-3 sm:w-full sm:flex-none sm:text-base">{label}</p>
                      <span className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-ink sm:mx-auto sm:mt-3">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Positionnement personnel */}
              <div className="border-t border-sand pt-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne-dark">Positionnement personnel</p>
                <p className="mt-5 text-base leading-7 text-anthracite/75">
                  Je ne crois pas aux réponses toutes faites. Une même question peut appeler des réponses très différentes selon la personne, l'organisation, son histoire, ses ressources et le contexte dans lequel elle se trouve.
                </p>
                <p className="mt-4 text-base leading-7 text-anthracite/75">
                  Mon rôle n'est pas de décider à la place de la personne ou de l'organisation, ni de lui apporter une solution préfabriquée. Il est de poser un regard extérieur, structurer la réflexion et aider à identifier ce qui peut réellement être fait.
                </p>
              </div>

              {/* Présentation ACT&RH */}
              <div className="border-t border-sand pt-8">
                <h2 className="font-serif text-3xl font-semibold text-ink">ACT&RH</h2>
                <p className="mt-5 text-lg leading-8 text-anthracite/80">
                  J'ai créé ACT&RH pour réunir ces différentes dimensions dans une même activité : le conseil en ressources humaines pour les organisations et l'accompagnement individuel pour les personnes.
                </p>
                <p className="mt-4 text-base leading-7 text-anthracite/75">
                  Deux formes d'intervention, mais une même manière de travailler : partir du réel, prendre le temps de regarder ce qui se joue, s'appuyer sur des connaissances solides et construire une réponse adaptée à chaque situation. Parce que faire évoluer une situation demande parfois de la hauteur, de la méthode et un espace pour penser autrement.
                </p>
                <div className="mt-6 rounded-2xl border border-sand bg-ivory p-6">
                  <p className="font-serif text-lg font-semibold text-ink">Caroline Tillou Maratuech</p>
                  <p className="mt-1 text-sm font-semibold text-sage-dark">Docteure en Gestion des Ressources Humaines · Enseignante-chercheuse · Consultante RH · Professionnelle de l'accompagnement individuel</p>
                  <p className="mt-3 text-sm leading-6 text-anthracite/70">Plus de 20 ans de recherche et de pratique autour des ressources humaines, du management et des relations au travail.</p>
                </div>
                <div className="mt-8">
                  <ButtonLink to="/contact">Échanger avec Caroline</ButtonLink>
                </div>
              </div>
            </div>

            {/* Colonne droite : photo + points forts */}
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white p-3 shadow-[0_24px_60px_rgba(31,51,71,0.1)]">
                <img
                  src={photoSrc}
                  alt="Caroline Tillou Maratuech — ACT&RH"
                  onError={(e) => { e.currentTarget.src = '/images/caroline_portrait.webp'; }}
                  className="aspect-[4/5] w-full rounded-[1.25rem] object-cover object-center"
                />
              </div>

              <Card className="bg-rosé border border-sand">
                <h3 className="font-serif text-xl font-semibold text-ink mb-4">Parcours & certifications</h3>
                <div className="grid gap-3.5">
                  {([
                    ['Doctorat en Gestion des Ressources Humaines', GraduationCap, true],
                    ['Coach Consultante certifiée RNCP Niveau 7', Users, false],
                    ['Plus de 20 ans de recherche et de pratique', Award, true],
                    ['Une approche fondée sur la recherche et la réalité du terrain', Heart, false],
                  ] as const).map(([title, Icon, isGold]) => (
                    <div key={String(title)} className="flex items-center gap-3.5">
                      <span className={`rounded-full p-2 ${isGold ? 'bg-champagne/15 text-champagne-dark' : 'bg-sage/20 text-sage-dark'}`}>
                        <Icon size={16} />
                      </span>
                      <span className="text-sm font-semibold text-ink">{String(title)}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="border border-sand bg-white">
                <h3 className="font-serif text-xl font-semibold text-ink mb-3">Toulouse · Occitanie · France · À distance</h3>
                <p className="text-sm leading-6 text-anthracite/70">
                  Les accompagnements se déroulent en présentiel à Toulouse, en Occitanie, partout en France ou en visioconférence selon votre contexte et vos besoins.
                </p>
                <div className="mt-4">
                  <ButtonLink to="/services" variant="secondary" className="w-full justify-center">
                    Voir les accompagnements
                  </ButtonLink>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
