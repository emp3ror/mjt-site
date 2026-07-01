import path from "node:path";

import { createContentTree, type ContentEntry, type ContentListing, type ContentSection } from "./content-tree";

export type ArtCollegeEntry = ContentEntry;
export type ArtCollegeSection = ContentSection;
export type ArtCollegeListing = ContentListing;

const tree = createContentTree(
  path.join(process.cwd(), "content", "art-college"),
  "/art-college",
  "Art College",
);

export const getArtCollegeListing = tree.getListing;
export const getArtCollegeSection = tree.getSection;
export const getArtCollegeEntry = tree.getEntry;
export const getAllArtCollegeSlugs = tree.getAllSlugs;
