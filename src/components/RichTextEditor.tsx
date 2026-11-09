import { useEffect, useState } from 'react';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Check, Eraser, Italic, Link2, List, ListOrdered,
  Minus, Quote, Redo2, Strikethrough, Underline, Undo2, Unlink, X
} from 'lucide-react';
import { cleanPastedHtml, contentToHtml } from '../lib/richText';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer' } }
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Écrivez ou collez votre article ici (Word, Google Docs…)' })
    ],
    content: contentToHtml(value),
    editorProps: {
      attributes: { class: 'prose-actrh min-h-[360px] max-w-none px-6 py-5 outline-none' },
      transformPastedHTML: cleanPastedHtml
    },
    onUpdate: ({ editor: ed }) => onChange(ed.isEmpty ? '' : ed.getHTML())
  });

  // Recharge le contenu quand on ouvre un autre article.
  useEffect(() => {
    if (!editor) return;
    const next = contentToHtml(value);
    if (!editor.isFocused && next !== editor.getHTML()) editor.commands.setContent(next, { emitUpdate: false });
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-ink/15 bg-white focus-within:border-sage-dark focus-within:ring-2 focus-within:ring-sage-dark/20">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      block: ed.isActive('heading', { level: 2 }) ? 'h2' : ed.isActive('heading', { level: 3 }) ? 'h3' : 'p',
      bold: ed.isActive('bold'),
      italic: ed.isActive('italic'),
      underline: ed.isActive('underline'),
      strike: ed.isActive('strike'),
      bullet: ed.isActive('bulletList'),
      ordered: ed.isActive('orderedList'),
      quote: ed.isActive('blockquote'),
      link: ed.isActive('link'),
      left: ed.isActive({ textAlign: 'left' }),
      center: ed.isActive({ textAlign: 'center' }),
      right: ed.isActive({ textAlign: 'right' }),
      canUndo: ed.can().undo(),
      canRedo: ed.can().redo()
    })
  });
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState('');

  function openLink() {
    setUrl((editor.getAttributes('link').href as string | undefined) ?? '');
    setLinkOpen(true);
  }

  function applyLink() {
    const href = url.trim();
    if (!href) editor.chain().focus().extendMarkRange('link').unsetLink().run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href: /^(https?:|mailto:|tel:|\/)/i.test(href) ? href : `https://${href}` }).run();
    setLinkOpen(false);
  }

  function setBlock(value: string) {
    const chain = editor.chain().focus();
    if (value === 'p') chain.setParagraph().run();
    else chain.setHeading({ level: Number(value[1]) as 2 | 3 }).run();
  }

  return (
    <div className="border-b border-sand bg-ivory">
      <div className="flex flex-wrap items-center gap-1 px-2 py-2">
        <select
          value={s.block}
          onChange={(e) => setBlock(e.target.value)}
          className="rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-sm font-semibold text-ink outline-none focus:border-sage-dark"
          title="Style du paragraphe"
        >
          <option value="p">Paragraphe</option>
          <option value="h2">Titre de section</option>
          <option value="h3">Sous-titre</option>
        </select>
        <Sep />
        <Btn title="Gras (Ctrl+B)" active={s.bold} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></Btn>
        <Btn title="Italique (Ctrl+I)" active={s.italic} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></Btn>
        <Btn title="Souligné (Ctrl+U)" active={s.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline size={16} /></Btn>
        <Btn title="Barré" active={s.strike} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={16} /></Btn>
        <Sep />
        <Btn title="Liste à puces" active={s.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></Btn>
        <Btn title="Liste numérotée" active={s.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></Btn>
        <Btn title="Citation" active={s.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></Btn>
        <Btn title="Séparateur" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={16} /></Btn>
        <Sep />
        <Btn title="Aligner à gauche" active={s.left} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft size={16} /></Btn>
        <Btn title="Centrer" active={s.center} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter size={16} /></Btn>
        <Btn title="Aligner à droite" active={s.right} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight size={16} /></Btn>
        <Sep />
        <Btn title="Insérer un lien" active={s.link} onClick={openLink}><Link2 size={16} /></Btn>
        {s.link ? <Btn title="Retirer le lien" onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}><Unlink size={16} /></Btn> : null}
        <Btn title="Effacer la mise en forme" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><Eraser size={16} /></Btn>
        <Sep />
        <Btn title="Annuler (Ctrl+Z)" disabled={!s.canUndo} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={16} /></Btn>
        <Btn title="Rétablir (Ctrl+Maj+Z)" disabled={!s.canRedo} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={16} /></Btn>
      </div>
      {linkOpen ? (
        <div className="flex items-center gap-2 border-t border-sand px-3 py-2">
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyLink(); } if (e.key === 'Escape') setLinkOpen(false); }}
            placeholder="https://… ou /contact"
            className="field !py-1.5"
          />
          <button type="button" onClick={applyLink} title="Valider" className="rounded-lg bg-sage-dark p-2 text-white hover:bg-ink"><Check size={15} /></button>
          <button type="button" onClick={() => setLinkOpen(false)} title="Fermer" className="rounded-lg p-2 text-anthracite/60 hover:bg-sand"><X size={15} /></button>
        </div>
      ) : null}
    </div>
  );
}

function Btn({ title, active, disabled, onClick, children }: { title: string; active?: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rounded-lg p-2 transition disabled:opacity-30 ${active ? 'bg-sage-dark text-white' : 'text-ink/70 hover:bg-sand hover:text-ink'}`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-1 h-5 w-px bg-ink/10" aria-hidden />;
}
