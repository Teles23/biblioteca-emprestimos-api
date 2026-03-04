import type { AuthDTO } from '../dtos/auth.dto';

export class ListAuthUseCase {
  async execute(): Promise<AuthDTO[]> {
    return [];
  }
}
