import { defineCollection, getCollection, z, type CollectionEntry } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/blog/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = { posts };
export type BlogPost = CollectionEntry<'posts'>;
export async function getBlogPosts(
  filter: (x: BlogPost) => boolean = (_) => true
): Promise<BlogPost[]> {
  return (await getCollection('posts'))
    .filter((x) => x && filter(x))
    .toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
