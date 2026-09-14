import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { trackEvent } from '../lib/analytics';
import type { LeadInput } from '../types';

const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-lead-email`;

async function sendLeadEmails(lead: LeadInput) {
  const res = await fetch(EDGE_FN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error('Edge function error:', err);
  }
}

const initial: LeadInput = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  profile_type: 'entreprise',
  need_type: 'conseil RH',
  preferred_contact: 'email',
  message: '',
  consent: false,
  source: 'site web',
};

export function ContactForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [firstName, setFirstName] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.consent) return setStatus('error');
    setStatus('loading');
    try {
      if (supabase) {
        const { error } = await supabase.from('leads').insert(form);
        if (error) throw error;
      }
      await sendLeadEmails(form);
      trackEvent('contact_submit', { need_type: form.need_type, profile_type: form.profile_type });
      if (form.need_type.includes('bilan')) trackEvent('bilan_request');
      if (['entreprise', 'dirigeant', 'manager'].includes(form.profile_type)) trackEvent('company_request');
      setFirstName(form.first_name);
      setStatus('success');
      setForm(initial);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="success-card rounded-2xl border border-ink/10 bg-white shadow-[0_18px_44px_rgba(31,51,71,0.06)] px-8 py-14 flex flex-col items-center text-center">
        <div className="success-icon-circle mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-sage shadow-[0_12px_40px_rgba(111,143,130,0.22)]">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="success-check stroke-champagne"
              d="M8 21L16 29L32 13"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="success-text space-y-4 max-w-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne-dark">Demande envoyée</p>
          <h2 className="font-serif text-3xl font-semibold text-ink leading-snug">
            Merci{firstName ? `, ${firstName}` : ''} !
          </h2>
          <p className="text-base leading-7 text-anthracite/70">
            Votre message a bien été reçu. Caroline Tillou Maratuech reviendra vers vous dans les plus brefs délais afin d&apos;échanger sur votre situation et vos besoins.
          </p>
          <p className="text-sm text-anthracite/50">
            Un email de confirmation vous a été envoyé.
          </p>
        </div>

        <div className="success-text my-8 h-px w-16 bg-sand" />

        <button
          onClick={() => setStatus('idle')}
          className="success-text text-sm font-semibold text-anthracite/50 underline underline-offset-4 hover:text-ink transition"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  const input = 'focus-ring w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm transition focus:border-sage-dark';
  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_18px_44px_rgba(31,51,71,0.06)]">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom"><input required className={input} value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></Field>
        <Field label="Nom"><input required className={input} value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></Field>
        <Field label="Email"><input required type="email" className={input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Téléphone"><input className={input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Profil"><Select value={form.profile_type} onChange={(v) => setForm({ ...form, profile_type: v })} options={['entreprise', 'dirigeant', 'manager', 'salarié', 'entrepreneur', 'étudiant', 'particulier', 'autre']} /></Field>
        <Field label="Besoin"><Select value={form.need_type} onChange={(v) => setForm({ ...form, need_type: v })} options={['conseil RH', 'accompagnement du changement', 'accompagnement individuel', 'bilan de compétences', 'formation / atelier', 'autre']} /></Field>
        <Field label="Préférence"><Select value={form.preferred_contact} onChange={(v) => setForm({ ...form, preferred_contact: v })} options={['téléphone', 'email', 'visioconférence']} /></Field>
      </div>
      <Field label="Message"><textarea required className={`${input} min-h-36`} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></Field>
      <label className="flex gap-3 text-sm leading-6 text-anthracite/75">
        <input required type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
        J&apos;accepte que les informations transmises soient utilisées pour répondre à ma demande.
      </label>
      <button disabled={status === 'loading'} className="focus-ring rounded-lg bg-sage px-6 py-3 font-semibold text-white shadow-[0_12px_28px_rgba(111,143,130,0.22)] transition hover:bg-sage-dark disabled:opacity-60">
        {status === 'loading' ? 'Envoi en cours...' : 'Envoyer ma demande'}
      </button>
      {status === 'error' ? <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">Le message n&apos;a pas pu être transmis. Vous pouvez aussi écrire directement à contact.actrh@gmail.com.</p> : null}
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-ink">{label}{children}</label>;
}

function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return <select className="focus-ring w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm transition focus:border-sage-dark" value={value} onChange={(e) => onChange(e.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select>;
}
