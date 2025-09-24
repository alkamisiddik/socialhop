export const getFileTypeFromUrl = (url: unknown): string => {
  if (typeof url !== "string" || !url) return "unknown";

  try {
    const extension = url.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "image";
      case "mp4":
      case "avi":
      case "mov":
        return "video";
      default:
        return "unknown";
    }
  } catch {
    return "unknown";
  }
};
