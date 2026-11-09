import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['p', 'br', 'h2', 'h3', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'hr', 'a'];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'style'];

/** Les anciens articles sont du texte brut (paragraphes séparés par une ligne vide) ; les nouveaux sont du HTML. */
export function isHtmlContent(content: string) {
  return /<(p|h[1-6]|ul|ol|blockquote|div|br|hr)[\s>/]/i.test(content);
}

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Convertit un contenu (texte brut ou HTML) en HTML propre et sûr à injecter dans la page. */
export function contentToHtml(content: string) {
  const html = isHtmlContent(content)
    ? content
    : content
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) => `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`)
        .join('');
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}

/** Texte brut du contenu, pour le temps de lecture. */
export function contentToText(content: string) {
  if (!isHtmlContent(content)) return content;
  return content.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
}

/**
 * Nettoie le HTML collé depuis Word / Google Docs : supprime le bruit (commentaires, styles, balises Office),
 * reconstruit les vraies listes à puces / numérotées, et ramène les titres aux niveaux utilisés par le site.
 */
export function cleanPastedHtml(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_COMMENT);
  const comments: Node[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((node) => node.parentNode?.removeChild(node));
  doc.querySelectorAll('style, script, meta, link, xml, title').forEach((el) => el.remove());

  convertWordLists(doc);

  doc.querySelectorAll('h1').forEach((el) => renameTag(el, 'h2'));
  doc.querySelectorAll('h4, h5, h6').forEach((el) => renameTag(el, 'h3'));

  doc.querySelectorAll('o\\:p').forEach((el) => {
    if (!el.textContent?.trim()) el.remove();
    else el.replaceWith(...Array.from(el.childNodes));
  });

  doc.querySelectorAll('p').forEach((p) => {
    if (!p.textContent?.replace(/ /g, '').trim() && !p.querySelector('img, br')) p.remove();
  });

  return doc.body.innerHTML;
}

function renameTag(el: Element, tag: string) {
  const next = el.ownerDocument.createElement(tag);
  next.innerHTML = el.innerHTML;
  el.replaceWith(next);
}

/** Word exporte ses listes sous forme de paragraphes `mso-list` : on les regroupe en <ul>/<ol> imbriquées. */
function convertWordLists(doc: Document) {
  const isListItem = (el: Element | null) => !!el && el.tagName === 'P' && /mso-list:/i.test(el.getAttribute('style') ?? '') && !/mso-list:\s*none/i.test(el.getAttribute('style') ?? '');

  Array.from(doc.body.querySelectorAll('p')).forEach((start) => {
    if (!start.isConnected || !isListItem(start)) return;
    const listId = (el: Element) => /mso-list:\s*(l\d+)/i.exec(el.getAttribute('style') ?? '')?.[1];
    const prev = start.previousElementSibling;
    if (prev && isListItem(prev) && listId(prev) === listId(start)) return;

    // Une liste Word = suite de paragraphes consécutifs partageant le même identifiant (l0, l1…).
    const items: Element[] = [];
    for (let el: Element | null = start; el && isListItem(el) && listId(el) === listId(start); el = el.nextElementSibling) items.push(el);

    const root = doc.createElement('div');
    const stack: { level: number; list: HTMLElement }[] = [];

    items.forEach((item) => {
      const style = item.getAttribute('style') ?? '';
      const level = Number(/level(\d+)/i.exec(style)?.[1] ?? 1);
      const marker = (item.querySelector('span[style*="mso-list:Ignore"], span[style*="mso-list: Ignore"]')?.textContent ?? '').trim();
      const ordered = /^[\dA-Za-z]+[.)]$/.test(marker);
      item.querySelectorAll('span[style*="mso-list:Ignore"], span[style*="mso-list: Ignore"]').forEach((el) => el.remove());

      while (stack.length && stack[stack.length - 1].level > level) stack.pop();
      let top = stack[stack.length - 1];
      if (!top || top.level < level) {
        const list = doc.createElement(ordered ? 'ol' : 'ul');
        if (top) (top.list.lastElementChild ?? top.list).appendChild(list);
        else root.appendChild(list);
        top = { level, list };
        stack.push(top);
      }
      const li = doc.createElement('li');
      li.innerHTML = item.innerHTML;
      top.list.appendChild(li);
    });

    start.replaceWith(...Array.from(root.childNodes));
    items.slice(1).forEach((el) => el.remove());
  });
}
