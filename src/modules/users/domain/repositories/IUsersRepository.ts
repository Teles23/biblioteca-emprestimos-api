export interface IUsersRepository {
  findById(id: string): Promise<UserEntity | null>;
}
