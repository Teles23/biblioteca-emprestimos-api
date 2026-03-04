import type { ILoansRepository } from '../../domain/repositories/ILoansRepository';
import { LoanEntity } from '../../domain/entities/loans.entity';

export class LoansRepository implements ILoansRepository {
  async findById(id: string): Promise<LoanEntity | null> {
    return new LoanEntity(id);
  }
}
