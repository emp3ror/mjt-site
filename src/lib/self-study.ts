import path from "node:path";

import { createContentTree, type ContentEntry, type ContentListing, type ContentSection } from "./content-tree";

export type SelfStudyEntry = ContentEntry;
export type SelfStudySection = ContentSection;
export type SelfStudyListing = ContentListing;

const tree = createContentTree(
  path.join(process.cwd(), "content", "self-study"),
  "/self-study",
  "Self Study",
);

export const getSelfStudyListing = tree.getListing;
export const getSelfStudySection = tree.getSection;
export const getSelfStudyEntry = tree.getEntry;
export const getAllSelfStudySlugs = tree.getAllSlugs;
