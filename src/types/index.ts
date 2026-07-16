export type MemoryDTO = {
  id: string;
  authorName: string;
  message: string | null;
  mediaUrl: string | null;
  mediaType: "PHOTO" | "VIDEO" | null;
  createdAt: string;
  updatedAt: string;
};
