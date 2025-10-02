import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

const computedFields = {
  slug: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) =>
      doc._raw.flattenedPath.replace(/^posts\//, ""),
  },
  url: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) =>
      `/posts/${doc._raw.flattenedPath.replace(/^posts\//, "")}`,
  },
  readingTime: {
    type: "string" as const,
    resolve: (doc: { body: { raw: string } }) => readingTime(doc.body.raw).text,
  },
};

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "posts/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    category: {
      type: "enum",
      options: ["tech", "personal", "art"],
      required: true,
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    cover: { type: "string", required: false },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
});
