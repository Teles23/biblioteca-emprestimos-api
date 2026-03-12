import { AuthorsRepository } from '../src/modules/authors/infra/repositories/authors.repository';
import { ListAuthorsUseCase } from '../src/modules/authors/application/use-cases/list-authors.use-case';

async function main() {
  const repo = new AuthorsRepository();
  const data = await new ListAuthorsUseCase(repo).execute();
  console.log('authors', data.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
