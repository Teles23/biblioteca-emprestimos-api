import type { LoanEntity } from '../entities/loans.entity';

export interface ILoansRepository {
  create(data: {
    bookId: string;
    userId: string;
    loanDate: Date;
    dueDate: Date;
  }): Promise<LoanEntity>;
  findActiveByBookId(bookId: string): Promise<LoanEntity | null>;
  findById(id: string): Promise<LoanEntity | null>;
  listActive(userId?: string): Promise<LoanEntity[]>;
  listOverdue(now: Date): Promise<LoanEntity[]>;
  listHistory(filters: { userId?: string; bookId?: string }): Promise<LoanEntity[]>;
  listByUser(userId: string): Promise<LoanEntity[]>;
  returnLoan(data: {
    id: string;
    returnDate: Date;
    lateDays: number;
    status: 'RETURNED' | 'OVERDUE';
  }): Promise<LoanEntity>;
}
