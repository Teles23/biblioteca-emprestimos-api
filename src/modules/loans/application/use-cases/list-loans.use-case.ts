import type { LoansDTO } from '../dtos/loans.dto';
import type { ILoansRepository } from '../../domain/repositories/ILoansRepository';

export class ListLoansUseCase {
  constructor(private readonly loansRepository: ILoansRepository) {}

  async execute(): Promise<LoansDTO[]> {
    return this.loansRepository.listHistory({});
  }
}
