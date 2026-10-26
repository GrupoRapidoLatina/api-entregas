import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/auth/decorators/current-user.decorator';
import { ok } from '../../core/http/api-response';
import { UserStatus } from '../../core/shared/enums/user-status.enum';
import { UserType } from '../../core/shared/enums/user-type.enum';
import { EnsureEmailAvailableUseCase } from './use-cases/ensure_email_available.use-case';
import { CreateUserUseCase } from './use-cases/create_user.use-case';
import { RegisterRepository } from './repositories/register.repository';
import { RegisterDto } from './dto/register.dto';
import { RegisterImagesDto } from './dto/register_images.dto';

@ApiTags('Cadastro')
@Controller()
export class RegisterController {
  constructor(
    private readonly ensureEmailAvailableUseCase: EnsureEmailAvailableUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly registerRepository: RegisterRepository,
  ) {}

  @Public()
  @Post('registration')
  @ApiOperation({ summary: 'Cria a conta' })
  async registration(@Body() dto: RegisterDto) {
    const email = dto.email ?? '';
    await this.ensureEmailAvailableUseCase.call(email);

    const userType = dto.user_type ?? UserType.Customer;
    const verify = String(Math.floor(Math.random() * 10000));
    const user = await this.createUserUseCase.call({
      verify,
      firstname: dto.firstname ?? '',
      lastname: dto.lastname ?? '',
      email,
      phone: dto.phone ?? '',
      password: dto.password ?? '',
      userType,
      dob: dto.dob ?? '',
      vehicleType: dto.vehicle_type ?? '',
      profileImage: 'default.jpg',
      deviceToken: dto.device_token ?? '',
      houseNo: dto.house_no ?? '',
      countryCode: dto.country_code ?? '',
      streetName: dto.street_name ?? '',
      countryName: dto.country_name ?? '',
      vehicleNo: verify,
      state: dto.state ?? '',
      socialType: dto.social_type ?? '',
      socialId: dto.social_id ?? '',
      postcode: dto.postcode ?? '',
      suburb: dto.suburb ?? '',
      companyName: dto.company_name ?? '',
      idOperacao: dto.id_parceiro ?? null,
      vehicleRegNo: dto.vehicle_reg_no ?? '',
      userStatus:
        userType === UserType.Customer
          ? UserStatus.Active
          : UserStatus.PendingDriver,
      loginStatus: 'no',
    });

    return ok({
      user_id: user.userId,
      email: user.email,
    });
  }

  @Public()
  @Post('registrationImages')
  @ApiOperation({ summary: 'Grava as imagens do cadastro' })
  async registrationImages(@Body() dto: RegisterImagesDto) {
    if (!dto.user_id || dto.user_id <= 0) {
      throw new BadRequestException('user_id é obrigatório');
    }

    const user = await this.registerRepository.findByUserId(dto.user_id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const data: Record<string, string> = {};
    const profileImage = dto.profile_image?.trim() ?? '';
    const licenceFront = dto.licence_front_image?.trim() ?? '';
    const licenceBack = dto.licence_back_image?.trim() ?? '';
    if (profileImage) data.profileImage = profileImage;
    if (licenceFront) data.licenceImageFront = licenceFront;
    if (licenceBack) data.licenceImageBack = licenceBack;
    if (Object.keys(data).length === 0) {
      return ok({ user_id: user.userId });
    }

    await this.registerRepository.updateImages(user.userId, data);
    return ok({ user_id: user.userId });
  }
}
