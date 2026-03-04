export interface LoansDTO {
  id: string;
  bookId: string;
  userId: string;
  loanDate: Date;
  dueDate: Date;
  returnDate: Date | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  lateDays: number;
  createdAt: Date;
  updatedAt: Date;
}
