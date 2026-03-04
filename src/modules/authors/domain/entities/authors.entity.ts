export class AuthorEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly biography: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
