import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string().or(z.date()),
    updatedDate: z.string().or(z.date()).optional(),
    author: z.string().default('ทีมช่างเทคนิค จินา เซอร์วิส'),
    authorRole: z.string().default('ผู้เชี่ยวชาญงานระบบบำบัดและสุขาภิบาล ประสบการณ์ 30 ปี'),
    category: z.string().default('ชักโครกตัน & ท่อตัน'),
    coverImage: z.string().default('/media/jina-standard-1.webp'),
    coverAlt: z.string().default('วิธีแก้ปัญหาชักโครกตัน จินา เซอร์วิส ภูเก็ต'),
    published: z.boolean().default(false),
    keywords: z.string().optional(),
  }),
});

export const collections = { blog };
