export interface BooksDTO {
  id: string;
  title: string;
  publicationYear: number;
  categoryId: string;
  status: 'AVAILABLE' | 'BORROWED';
  authors: Array<{
    id: string;
    name: string;
    biography: string | null;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
