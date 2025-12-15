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

const getArtCollegeSlug = (doc: { _raw: { flattenedPath: string } }) => {
  const flattenedPath = doc._raw.flattenedPath.replace(/^art-college\/?/, "");
  const withoutIndex = flattenedPath.replace(/\/index$/, "");
  return withoutIndex === "index" ? "" : withoutIndex;
};

const artCollegeComputedFields = {
  slug: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) =>
      getArtCollegeSlug(doc),
  },
  url: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) => {
      const slug = getArtCollegeSlug(doc);
      return slug ? `/art-college/${slug}` : "/art-college";
    },
  },
};

const shopOverviewComputedFields = {
  slug: {
    type: "string" as const,
    resolve: () => "",
  },
  url: {
    type: "string" as const,
    resolve: () => "/shop",
  },
};

const shopItemComputedFields = {
  slug: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) =>
      doc._raw.flattenedPath.replace(/^shop\//, ""),
  },
  url: {
    type: "string" as const,
    resolve: (doc: { _raw: { flattenedPath: string } }) =>
      `/shop/posts/${doc._raw.flattenedPath.replace(/^shop\//, "")}`,
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

export const ArtCollegeOverview = defineDocumentType(() => ({
  name: "ArtCollegeOverview",
  filePathPattern: "art-college/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    updated: { type: "date", required: false },
  },
  computedFields: artCollegeComputedFields,
}));

export const ArtCollegeSection = defineDocumentType(() => ({
  name: "ArtCollegeSection",
  filePathPattern: "art-college/*/**/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    order: { type: "number", required: false },
  },
  computedFields: artCollegeComputedFields,
}));

export const ArtCollegeLesson = defineDocumentType(() => ({
  name: "ArtCollegeLesson",
  filePathPattern: "art-college/**/!(*index).mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    date: { type: "date", required: false },
    updated: { type: "date", required: false },
  },
  computedFields: artCollegeComputedFields,
}));

export const ShopOverview = defineDocumentType(() => ({
  name: "ShopOverview",
  filePathPattern: "shop/index.mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    updated: { type: "date", required: false },
  },
  computedFields: shopOverviewComputedFields,
}));

export const ShopItem = defineDocumentType(() => ({
  name: "ShopItem",
  filePathPattern: "shop/**/!(*index).mdx",
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    intro: { type: "string", required: false },
    description: { type: "string", required: false },
    updated: { type: "date", required: false },
  },
  computedFields: shopItemComputedFields,
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [
    Post,
    PostsOverview,
    Event,
    EventsOverview,
    ArtCollegeOverview,
    ArtCollegeSection,
    ArtCollegeLesson,
    ShopOverview,
    ShopItem,
  ],
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
  },
});
