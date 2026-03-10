export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string | null,
    public readonly roles: string[],
    public readonly status: 'ACTIVE' | 'INACTIVE',
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly loanCount?: number,
  ) {}
}
