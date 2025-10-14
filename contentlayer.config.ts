import { defineDocumentType, makeSource } from "contentlayer/source-files";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

const postComputedFields = {
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

const eventComputedFields = {
  slug: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) =>
      doc._raw.flattenedPath.replace(/^events\//, ""),
  },
  url: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) =>
      `/events/${doc._raw.flattenedPath.replace(/^events\//, "")}`,
  },
};

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "posts/**/!(*index).mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    category: {
      type: "enum",
      options: ["tech", "art", "politics", "art-study", "personal", "hike"],
      required: true,
    },
    tags: { type: "list", of: { type: "string" }, required: true },
    cover: { type: "string", required: false },
    featured: { type: "boolean", required: false },
    template: { type: "string", required: false },
    gpx: { type: "string", required: false },
    checkpoints: { type: "json", required: false },
  },
  computedFields: postComputedFields,
}));

export const PostsOverview = defineDocumentType(() => ({
  name: "PostsOverview",
  filePathPattern: "posts/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    updated: { type: "date", required: false },
  },
}));

export const Event = defineDocumentType(() => ({
  name: "Event",
  filePathPattern: "events/**/!(*index).mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    endDate: { type: "date", required: false },
    startTime: { type: "string", required: false },
    endTime: { type: "string", required: false },
    category: { type: "string", required: false },
    location: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    cover: { type: "string", required: false },
    registrationUrl: { type: "string", required: false },
  },
  computedFields: eventComputedFields,
}));

export const EventsOverview = defineDocumentType(() => ({
  name: "EventsOverview",
  filePathPattern: "events/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    updated: { type: "date", required: false },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post, PostsOverview, Event, EventsOverview],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
});
