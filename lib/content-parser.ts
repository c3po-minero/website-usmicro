/**
 * Parses markdown HTML content into structured sections for designed layouts.
 * Splits on h2 boundaries and extracts FAQ sections.
 */

export interface ContentSection {
  id: string;
  title: string;
  level: number; // 2 or 3
  html: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ParsedContent {
  intro: string; // content before first h2
  sections: ContentSection[];
  faqs: FAQ[];
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Parse HTML content into structured sections split by h2 headings.
 */
export function parseContentSections(html: string): ParsedContent {
  // Split by h2 tags
  const h2Regex = /<h2>(.*?)<\/h2>/gi;
  const parts: string[] = [];
  const titles: string[] = [];
  let lastIndex = 0;
  let match;

  while ((match = h2Regex.exec(html)) !== null) {
    parts.push(html.slice(lastIndex, match.index));
    titles.push(match[1].replace(/<[^>]*>/g, '').trim());
    lastIndex = match.index + match[0].length;
  }
  parts.push(html.slice(lastIndex));

  const intro = parts[0] || '';
  const sections: ContentSection[] = [];
  const faqs: FAQ[] = [];

  for (let i = 1; i < parts.length; i++) {
    const title = titles[i - 1];
    const sectionHtml = parts[i];

    // Check if this is a FAQ section
    if (title.toLowerCase().includes('frequently asked') || title.toLowerCase().includes('faq')) {
      // Extract FAQ items from h3 + content pairs
      const h3Regex = /<h3>(.*?)<\/h3>/gi;
      const faqParts: string[] = [];
      const faqQuestions: string[] = [];
      let faqLastIndex = 0;
      let faqMatch;

      while ((faqMatch = h3Regex.exec(sectionHtml)) !== null) {
        faqParts.push(sectionHtml.slice(faqLastIndex, faqMatch.index));
        faqQuestions.push(faqMatch[1].replace(/<[^>]*>/g, '').trim());
        faqLastIndex = faqMatch.index + faqMatch[0].length;
      }
      faqParts.push(sectionHtml.slice(faqLastIndex));

      for (let j = 0; j < faqQuestions.length; j++) {
        const answer = (faqParts[j + 1] || '').replace(/<hr\s*\/?>/g, '').trim();
        if (answer) {
          faqs.push({ question: faqQuestions[j], answer });
        }
      }
      continue;
    }

    sections.push({
      id: slugify(title),
      title,
      level: 2,
      html: sectionHtml.replace(/<hr\s*\/?>/g, '').trim(),
    });
  }

  return { intro: intro.replace(/<hr\s*\/?>/g, '').trim(), sections, faqs };
}

/**
 * Extract h3 sub-sections from a section's HTML
 */
export interface SubSection {
  title: string;
  html: string;
  icon?: string;
}

export function extractSubSections(sectionHtml: string): { preamble: string; subSections: SubSection[] } {
  const h3Regex = /<h3>(.*?)<\/h3>/gi;
  const parts: string[] = [];
  const titles: string[] = [];
  let lastIndex = 0;
  let match;

  while ((match = h3Regex.exec(sectionHtml)) !== null) {
    parts.push(sectionHtml.slice(lastIndex, match.index));
    titles.push(match[1].replace(/<[^>]*>/g, '').trim());
    lastIndex = match.index + match[0].length;
  }
  parts.push(sectionHtml.slice(lastIndex));

  const preamble = parts[0] || '';
  const subSections: SubSection[] = [];

  for (let i = 0; i < titles.length; i++) {
    subSections.push({
      title: titles[i],
      html: (parts[i + 1] || '').trim(),
    });
  }

  return { preamble, subSections };
}

/**
 * Extract TOC items from HTML content (h2 and h3 headings)
 */
export interface TOCItem {
  id: string;
  label: string;
  level: number;
}

export function extractTOC(html: string): TOCItem[] {
  const headingRegex = /<h([23])>(.*?)<\/h[23]>/gi;
  const items: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const label = match[2].replace(/<[^>]*>/g, '').trim();
    if (!label.toLowerCase().includes('frequently asked') && !label.toLowerCase().includes('faq')) {
      items.push({
        id: slugify(label),
        label,
        level: parseInt(match[1]),
      });
    }
  }

  return items;
}
