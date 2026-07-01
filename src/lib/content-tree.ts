/**
 * Generic reader for the "folder of MDX files, optionally one level of
 * subfolders, each folder can have an index.mdx for its own metadata"
 * content shape shared by /art-college and /self-study.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { isVisible } from "./content-visibility";

type FrontMatter = {
  title?: string;
  description?: string;
  intro?: string;
  date?: string;
  updated?: string;
  order?: number;
  draft?: boolean;
};

export type ContentEntry = {
  slug: string[];
  href: string;
  title: string;
  description?: string;
  date?: string;
  updated?: string;
  order?: number;
};

export type ContentSection = {
  slug: string;
  title: string;
  description?: string;
  intro?: string;
  entries: ContentEntry[];
  order?: number;
};

export type ContentListing = {
  page: {
    title: string;
    intro?: string;
    description?: string;
    updated?: string;
  };
  rootEntries: ContentEntry[];
  sections: ContentSection[];
};

const mdxExtension = /.mdx$/;

const toTitleCase = (value: string) =>
  value
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

const safeReadDir = async (targetPath: string) => {
  try {
    return await fs.readdir(targetPath, { withFileTypes: true });
  } catch (error) {
    throw new Error(`Unable to read directory at ${targetPath}: ${(error as Error).message}`);
  }
};

const parseMdx = async (filePath: string) => {
  const fileContents = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(fileContents);
  return {
    frontMatter: data as FrontMatter,
    content,
  };
};

const pathExists = async (targetPath: string) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _error
  ) {
    return false;
  }
};

export const createContentTree = (baseDir: string, hrefPrefix: string, defaultTitle: string) => {
  const buildHref = (segments: string[]) => `${hrefPrefix}/${segments.join("/")}`;

  const createEntry = (slugSegments: string[], frontMatter: FrontMatter = {}): ContentEntry => ({
    slug: slugSegments,
    href: buildHref(slugSegments),
    title: frontMatter.title ?? toTitleCase(slugSegments.at(-1) ?? "Untitled"),
    description: frontMatter.description,
    date: frontMatter.date,
    updated: frontMatter.updated ?? frontMatter.date,
    order: frontMatter.order,
  });

  type BuildEntryOptions = {
    relativeFilePath?: string;
  };

  const buildEntry = async (
    slugSegments: string[],
    options: BuildEntryOptions = {},
  ): Promise<ContentEntry | null> => {
    const relativePath = options.relativeFilePath ?? `${path.join(...slugSegments)}.mdx`;
    const filePath = path.join(baseDir, relativePath);
    const { frontMatter } = await parseMdx(filePath);

    if (!isVisible(frontMatter)) {
      return null;
    }

    return createEntry(slugSegments, frontMatter);
  };

  const pushEntryIfVisible = async (
    collection: ContentEntry[],
    slugSegments: string[],
    options: BuildEntryOptions = {},
  ) => {
    const entry = await buildEntry(slugSegments, options);
    if (entry) collection.push(entry);
  };

  const sortEntries = (entries: ContentEntry[]) =>
    entries.sort((a, b) => {
      if (a.order !== undefined || b.order !== undefined) {
        return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
      }

      const dateA = a.updated ?? a.date;
      const dateB = b.updated ?? b.date;

      if (dateA && dateB) {
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }

      return a.title.localeCompare(b.title);
    });

  const sortSections = (sections: ContentSection[]) =>
    sections.sort((a, b) => {
      if (a.order !== undefined || b.order !== undefined) {
        return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
      }

      return a.title.localeCompare(b.title);
    });

  const readSection = async (sectionSlug: string): Promise<ContentSection | null> => {
    const directoryPath = path.join(baseDir, sectionSlug);
    const dirents = await safeReadDir(directoryPath);

    let meta: FrontMatter | undefined;
    const entries: ContentEntry[] = [];

    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        const subDirectorySlug = dirent.name;
        const relativeIndexPath = path.join(sectionSlug, subDirectorySlug, "index.mdx");
        const absoluteIndexPath = path.join(baseDir, relativeIndexPath);

        if (await pathExists(absoluteIndexPath)) {
          await pushEntryIfVisible(entries, [sectionSlug, subDirectorySlug], {
            relativeFilePath: relativeIndexPath,
          });
        } else {
          entries.push(createEntry([sectionSlug, subDirectorySlug]));
        }

        continue;
      }

      if (!dirent.isFile() || !mdxExtension.test(dirent.name)) {
        continue;
      }

      if (dirent.name === "index.mdx") {
        const { frontMatter } = await parseMdx(path.join(directoryPath, dirent.name));
        meta = frontMatter;
        continue;
      }

      const fileSlug = dirent.name.replace(mdxExtension, "");
      await pushEntryIfVisible(entries, [sectionSlug, fileSlug]);
    }

    if (meta && !isVisible(meta)) {
      return null;
    }

    sortEntries(entries);

    return {
      slug: sectionSlug,
      title: meta?.title ?? toTitleCase(sectionSlug),
      description: meta?.description,
      intro: meta?.intro,
      entries,
      order: meta?.order,
    };
  };

  const getListing = async (): Promise<ContentListing> => {
    const dirents = await safeReadDir(baseDir);

    const sections: ContentSection[] = [];
    const rootEntries: ContentEntry[] = [];
    let pageMeta: ContentListing["page"] = {
      title: defaultTitle,
    };

    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        const section = await readSection(dirent.name);
        if (section) sections.push(section);
        continue;
      }

      if (!dirent.isFile() || !mdxExtension.test(dirent.name)) {
        continue;
      }

      if (dirent.name === "index.mdx") {
        const { frontMatter } = await parseMdx(path.join(baseDir, dirent.name));
        pageMeta = {
          title: frontMatter.title ?? defaultTitle,
          intro: frontMatter.intro,
          description: frontMatter.description,
          updated: frontMatter.updated,
        };
        continue;
      }

      const fileSlug = dirent.name.replace(mdxExtension, "");
      await pushEntryIfVisible(rootEntries, [fileSlug]);
    }

    sortEntries(rootEntries);
    sortSections(sections);

    return {
      page: pageMeta,
      rootEntries,
      sections,
    };
  };

  const getSection = async (slugSegments: string[]): Promise<ContentSection | null> => {
    if (slugSegments.length === 0) return null;
    const directoryPath = path.join(baseDir, ...slugSegments);
    if (!(await pathExists(directoryPath))) return null;

    try {
      const stat = await fs.stat(directoryPath);
      if (!stat.isDirectory()) return null;
    } catch {
      return null;
    }

    const dirents = await safeReadDir(directoryPath);
    let meta: FrontMatter | undefined;
    const entries: ContentEntry[] = [];

    for (const dirent of dirents) {
      if (dirent.isDirectory()) {
        const childSlug = dirent.name;
        const relativeIndexPath = path.join(...slugSegments, childSlug, "index.mdx");
        const absoluteIndexPath = path.join(baseDir, relativeIndexPath);

        if (await pathExists(absoluteIndexPath)) {
          await pushEntryIfVisible(entries, [...slugSegments, childSlug], {
            relativeFilePath: relativeIndexPath,
          });
        } else {
          entries.push(createEntry([...slugSegments, childSlug]));
        }

        continue;
      }

      if (!dirent.isFile() || !mdxExtension.test(dirent.name)) {
        continue;
      }

      if (dirent.name === "index.mdx") {
        const { frontMatter } = await parseMdx(path.join(directoryPath, dirent.name));
        meta = frontMatter;
        continue;
      }

      const fileSlug = dirent.name.replace(mdxExtension, "");
      await pushEntryIfVisible(entries, [...slugSegments, fileSlug]);
    }

    if (meta && !isVisible(meta)) {
      return null;
    }

    sortEntries(entries);

    return {
      slug: slugSegments.join("/"),
      title: meta?.title ?? toTitleCase(slugSegments.at(-1) ?? "Section"),
      description: meta?.description,
      intro: meta?.intro,
      entries,
      order: meta?.order,
    };
  };

  const getEntry = async (slugSegments: string[]) => {
    const candidatePaths = [
      `${path.join(...slugSegments)}.mdx`,
      path.join(...slugSegments, "index.mdx"),
    ];

    for (const relativePath of candidatePaths) {
      const targetPath = path.join(baseDir, relativePath);

      if (!(await pathExists(targetPath))) {
        continue;
      }

      try {
        const { frontMatter, content } = await parseMdx(targetPath);
        if (!isVisible(frontMatter)) {
          return null;
        }
        return {
          frontMatter,
          content,
        };
      } catch (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _error
      ) {
        // Try the next candidate path.
      }
    }

    return null;
  };

  const getAllSlugs = async (): Promise<string[][]> => {
    const slugs: string[][] = [];

    const walk = async (currentDir: string, prefix: string[]) => {
      const dirents = await safeReadDir(currentDir);
      let indexIsVisible = false;
      let hasIndex = false;

      for (const dirent of dirents) {
        const nextPath = path.join(currentDir, dirent.name);

        if (dirent.isDirectory()) {
          await walk(nextPath, [...prefix, dirent.name]);
          continue;
        }

        if (!dirent.isFile() || !mdxExtension.test(dirent.name)) {
          continue;
        }

        if (dirent.name === "index.mdx") {
          hasIndex = true;
          const { frontMatter } = await parseMdx(nextPath);
          indexIsVisible = isVisible(frontMatter);
          continue;
        }

        const { frontMatter } = await parseMdx(nextPath);
        if (!isVisible(frontMatter)) {
          continue;
        }

        const slug = dirent.name.replace(mdxExtension, "");
        slugs.push([...prefix, slug]);
      }

      if (hasIndex && indexIsVisible && prefix.length > 0) {
        slugs.push([...prefix]);
      }
    };

    await walk(baseDir, []);

    return slugs;
  };

  return { getListing, getSection, getEntry, getAllSlugs };
};
