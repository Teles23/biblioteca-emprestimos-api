export class LoanEntity {
  constructor(
    public readonly id: string,
    public readonly bookId: string,
    public readonly userId: string,
    public readonly loanDate: Date,
    public readonly dueDate: Date,
    public readonly returnDate: Date | null,
    public readonly status: 'ACTIVE' | 'RETURNED' | 'OVERDUE',
    public readonly lateDays: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
