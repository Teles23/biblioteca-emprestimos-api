export interface ILoansRepository {
  findById(id: string): Promise<LoanEntity | null>;
}
