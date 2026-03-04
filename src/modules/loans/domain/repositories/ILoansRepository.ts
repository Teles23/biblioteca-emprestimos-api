import type { LoanEntity } from '../entities/loans.entity';

export interface ILoansRepository {
  findById(id: string): Promise<LoanEntity | null>;
}
