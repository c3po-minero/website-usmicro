import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDir = path.join(process.cwd(), 'content');

export interface ContentPage {
  slug: string;
  frontmatter: Record<string, unknown>;
  content: string;
  htmlContent: string;
}

export async function getContentPage(filePath: string): Promise<ContentPage> {
  const fullPath = path.join(contentDir, filePath);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(raw);
  const result = await remark().use(html).process(content);
  return {
    slug: path.basename(filePath, '.md'),
    frontmatter: data,
    content,
    htmlContent: result.toString(),
  };
}

export function getContentFiles(dir: string): string[] {
  const fullDir = path.join(contentDir, dir);
  if (!fs.existsSync(fullDir)) return [];
  return fs.readdirSync(fullDir).filter((f) => f.endsWith('.md'));
}

export async function getAllContentPages(dir: string): Promise<ContentPage[]> {
  const files = getContentFiles(dir);
  return Promise.all(files.map((f) => getContentPage(path.join(dir, f))));
}
