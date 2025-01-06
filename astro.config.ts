// @ts-check
import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import type { Element } from "hast";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), vue(), mdx()],
  legacy: {
    collections: true,
  },
  markdown: {
    shikiConfig: {
      // 启用 wrap 以便我们可以为代码块添加复制按钮
      wrap: true,
      // 添加自定义的 transformer
      transformers: [
        {
          pre(node: Element) {
            // 为 pre 标签添加相对定位
            node.properties.style = "position: relative;";

            // 创建复制按钮
            const button: Element = {
              type: "element",
              tagName: "button",
              properties: {
                className: ["copy-button"],
                style: "position: absolute; right: 8px; top: 8px;",
              },
              children: [
                {
                  type: "text",
                  value: "复制",
                },
              ],
            };

            // 将按钮添加到代码块中
            node.children = [...node.children, button];
            return node;
          },
        },
      ],
    },
  },
  server: {
    headers: {
      "Content-Security-Policy": `
        script-src 'self' 'unsafe-inline' 'unsafe-eval' giscus.app;
        frame-src 'self' giscus.app;
      `,
    },
  },
});
