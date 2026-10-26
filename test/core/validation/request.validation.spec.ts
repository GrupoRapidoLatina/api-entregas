import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ChangePasswordDto } from '../../../src/features/change_password/dto/change_password.dto';
import { LoginDto } from '../../../src/features/login/dto/login.dto';
import { NearbyDeliveriesDto } from '../../../src/features/nearby_deliveries/dto/nearby_deliveries.dto';
import { LocParceiroDto } from '../../../src/features/partners/dto/loc_parceiro.dto';
import { RegisterDto } from '../../../src/features/register/dto/register.dto';
import { ReviewDto } from '../../../src/features/review/dto/review.dto';
import { VerifyEmailDto } from '../../../src/features/verify_email/dto/verify_email.dto';

async function errorsOf<T extends object>(cls: new () => T, plain: object) {
  return validate(plainToInstance(cls, plain));
}

describe('validação dos pedidos HTTP', () => {
  it('aceita login, cadastro, CNPJ e avaliação dentro da regra', async () => {
    expect(
      await errorsOf(LoginDto, {
        email: 'ana@example.com',
        password: 'senha1234',
        device_type: 'android',
      }),
    ).toHaveLength(0);

    expect(
      await errorsOf(RegisterDto, {
        email: 'ana@example.com',
        password: 'senha1234',
        phone: '+5511999999999',
      }),
    ).toHaveLength(0);

    expect(
      await errorsOf(LocParceiroDto, { cnpj: '12.345.678/0001-90' }),
    ).toHaveLength(0);

    expect(
      await errorsOf(ReviewDto, { order_id: 4, driverRatting: 5 }),
    ).toHaveLength(0);

    expect(
      await errorsOf(NearbyDeliveriesDto, {
        latitude: '-23.5',
        longitude: '-46.6',
      }),
    ).toHaveLength(0);
  });

  it('recusa e-mail, senha curta, telefone, código, CNPJ, nota e coordenada inválidos', async () => {
    expect(
      (await errorsOf(LoginDto, { email: 'ruim', password: '' })).length,
    ).toBeGreaterThan(0);
    expect(
      (
        await errorsOf(ChangePasswordDto, {
          old_password: 'antiga123',
          new_password: 'curta',
        })
      ).length,
    ).toBeGreaterThan(0);
    expect(
      (
        await errorsOf(RegisterDto, {
          email: 'ana@example.com',
          password: 'senha1234',
          phone: '123',
        })
      ).length,
    ).toBeGreaterThan(0);
    expect(
      (await errorsOf(VerifyEmailDto, { email: 'ana@example.com', code: 'ab' }))
        .length,
    ).toBeGreaterThan(0);
    expect((await errorsOf(LocParceiroDto, { cnpj: '123' })).length).toBeGreaterThan(
      0,
    );
    expect(
      (await errorsOf(ReviewDto, { order_id: 0, driverRatting: 9 })).length,
    ).toBeGreaterThan(0);
    expect(
      (
        await errorsOf(NearbyDeliveriesDto, {
          latitude: 'sul',
          longitude: '-46.6',
        })
      ).length,
    ).toBeGreaterThan(0);
  });
});
