import { CreateUserUseCase } from '../../../../src/features/register/use-cases/create_user.use-case';
import type { RegisterRepository } from '../../../../src/features/register/repositories/register.repository';
import type { CreateUserInput } from '../../../../src/features/register/models/create-user.input';

describe('CreateUserUseCase', () => {
  it('persiste o usuário montado pelo cadastro', async () => {
    const calls: CreateUserInput[] = [];
    const repository = {
      createUser: async (data: CreateUserInput) => {
        calls.push(data);
        return { userId: 11, email: data.email };
      },
    } as unknown as RegisterRepository;
    const input: CreateUserInput = {
      email: 'novo@example.com',
      password: 'senha1234',
      firstname: 'Novo',
      userStatus: 1,
    };

    await expect(new CreateUserUseCase(repository).call(input)).resolves.toEqual({
      userId: 11,
      email: 'novo@example.com',
    });
    expect(calls).toEqual([input]);
  });
});
