export function getFileName(id: string, tipe: string): string {
  const extMap: Record<string, string> = {
    "application/pdf": ".pdf",
    "image/png": ".png",
    "image/jpeg": ".jpg",
  };
  const ext = extMap[tipe] || "";
  return `file-${id.slice(-6)}${ext}`;
  // e.g. "file-594c4a.pdf"
}
