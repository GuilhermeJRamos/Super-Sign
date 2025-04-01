export type Document = {
  id: string;
  name: string;
  fileKey: string;
  status: "PENDING" | "SIGNED";
  signatureUrl?: string;
  signaturePosition?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}; 