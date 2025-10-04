import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

const ART_COLLEGE_DIR = path.join(process.cwd(), "content", "art-college");

type FrontMatter = {
  title?: string;
  description?: string;
  intro?: string;
  date?: string;
  updated?: string;
  order?: number;
};

export type ArtCollegeEntry = {
  slug: string[];
  href: string;
  title: string;
  description?: string;
  date?: string;
  updated?: string;
  order?: number;
};

export type ArtCollegeSection = {
  slug: string;
  title: string;
  description?: string;
  intro?: string;
  entries: ArtCollegeEntry[];
  order?: number;
};

export type ArtCollegeListing = {
  page: {
    title: string;
    intro?: string;
    description?: string;
    updated?: string;
  };
  rootEntries: ArtCollegeEntry[];
  sections: ArtCollegeSection[];
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

const buildHref = (segments: string[]) => `/art-college/${segments.join("/")}`;

const createEntry = (slugSegments: string[], frontMatter: FrontMatter = {}): ArtCollegeEntry => ({
  slug: slugSegments,
  href: buildHref(slugSegments),
  title: frontMatter.title ?? toTitleCase(slugSegments.at(-1) ?? "Untitled"),
  description: frontMatter.description ?? frontMatter.intro,
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
): Promise<ArtCollegeEntry> => {
  const relativePath =
    options.relativeFilePath ?? `${path.join(...slugSegments)}.mdx`;
  const filePath = path.join(ART_COLLEGE_DIR, relativePath);
  const { frontMatter } = await parseMdx(filePath);

  return createEntry(slugSegments, frontMatter);
};

const sortEntries = (entries: ArtCollegeEntry[]) =>
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

const sortSections = (sections: ArtCollegeSection[]) =>
  sections.sort((a, b) => {
    if (a.order !== undefined || b.order !== undefined) {
      return (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER);
    }

    return a.title.localeCompare(b.title);
  });

const readSection = async (sectionSlug: string): Promise<ArtCollegeSection> => {
  const directoryPath = path.join(ART_COLLEGE_DIR, sectionSlug);
  const dirents = await safeReadDir(directoryPath);

  let meta: FrontMatter | undefined;
  const entries: ArtCollegeEntry[] = [];

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      const subDirectorySlug = dirent.name;
      const relativeIndexPath = path.join(sectionSlug, subDirectorySlug, "index.mdx");
      const absoluteIndexPath = path.join(ART_COLLEGE_DIR, relativeIndexPath);

      if (await pathExists(absoluteIndexPath)) {
        entries.push(
          await buildEntry([sectionSlug, subDirectorySlug], {
            relativeFilePath: relativeIndexPath,
          }),
        );
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
    entries.push(await buildEntry([sectionSlug, fileSlug]));
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

export const getArtCollegeListing = async (): Promise<ArtCollegeListing> => {
  const dirents = await safeReadDir(ART_COLLEGE_DIR);

  const sections: ArtCollegeSection[] = [];
  const rootEntries: ArtCollegeEntry[] = [];
  let pageMeta: ArtCollegeListing["page"] = {
    title: "Art College",
  };

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      sections.push(await readSection(dirent.name));
      continue;
    }

    if (!dirent.isFile() || !mdxExtension.test(dirent.name)) {
      continue;
    }

    if (dirent.name === "index.mdx") {
      const { frontMatter } = await parseMdx(path.join(ART_COLLEGE_DIR, dirent.name));
      pageMeta = {
        title: frontMatter.title ?? "Art College",
        intro: frontMatter.intro ?? frontMatter.description,
        description: frontMatter.description,
        updated: frontMatter.updated,
      };
      continue;
    }

    const fileSlug = dirent.name.replace(mdxExtension, "");
    rootEntries.push(await buildEntry([fileSlug]));
  }

  sortEntries(rootEntries);
  sortSections(sections);

  return {
    page: pageMeta,
    rootEntries,
    sections,
  };
};

export const getArtCollegeEntry = async (slugSegments: string[]) => {
  const candidatePaths = [
    `${path.join(...slugSegments)}.mdx`,
    path.join(...slugSegments, "index.mdx"),
  ];

  for (const relativePath of candidatePaths) {
    const targetPath = path.join(ART_COLLEGE_DIR, relativePath);

    if (!(await pathExists(targetPath))) {
      continue;
    }

    try {
      const { frontMatter, content } = await parseMdx(targetPath);
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

export const getAllArtCollegeSlugs = async (): Promise<string[][]> => {
  const slugs: string[][] = [];

  const walk = async (currentDir: string, prefix: string[]) => {
    const dirents = await safeReadDir(currentDir);
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
        continue;
      }

      const slug = dirent.name.replace(mdxExtension, "");
      slugs.push([...prefix, slug]);
    }

    if (hasIndex && prefix.length > 0) {
      slugs.push([...prefix]);
    }
  };

  await walk(ART_COLLEGE_DIR, []);

  return slugs;
};
