function cleanPath(path: string): string {
  return path.trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "").replace(/\/{2,}/g, "/");
}

export function templatePathCandidates(input: string, templateFolder = ""): string[] {
  const path = cleanPath(input); const folder = cleanPath(templateFolder);
  if (!path) return [];
  const withExtension = path.toLowerCase().endsWith(".md") ? path : `${path}.md`;
  const candidates = [withExtension];
  if (folder && withExtension !== folder && !withExtension.startsWith(`${folder}/`)) candidates.push(`${folder}/${withExtension}`);
  return [...new Set(candidates)];
}
