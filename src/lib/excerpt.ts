/**
 * Strip MDX/Markdown syntax from a raw post body and return a plain-text
 * excerpt suitable for index/list cards. Truncates with an ellipsis when
 * the result is longer than `maxLength`.
 */
export const excerptFromMarkdown = (raw: string, maxLength = 180): string => {
  const plain = raw
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) {
    return plain;
  }

  return `${plain.slice(0, maxLength).trimEnd()}…`;
};
