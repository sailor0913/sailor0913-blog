import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/blog",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const microcircle = defineCollection({
  type: 'data',
  schema: z.array(z.object({
    content: z.string(),
    pubDate: z.string().transform((str) => {
      // 将 "YYYY-MM-DD HH:mm" 转换为标准的 ISO 日期格式
      const [date, time] = str.split(' ');
      const [year, month, day] = date.split('-');
      const [hour, minute] = time ? time.split(':') : ['00', '00'];
      return new Date(
        Number(year),
        Number(month) - 1, // 月份从0开始
        Number(day),
        Number(hour),
        Number(minute)
      );
    }),
  })),
});

export const collections = {
  blog: blog,
  microcircle: microcircle,
};
