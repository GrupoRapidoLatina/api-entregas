import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../core/auth/decorators/current-user.decorator';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { TokenService } from '../../core/auth/services/token.service';
import { imageUrl } from '../../core/helpers/image-url.helper';
import { ok } from '../../core/http/api-response';
import { AuthenticateCredentialsUseCase } from './use-cases/authenticate_credentials.use-case';
import { UpdateLoginSessionUseCase } from './use-cases/update_login_session.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { LoginDto } from './dto/login.dto';

@ApiTags('Login')
@Controller()
export class LoginController {
  constructor(
    private readonly authenticateCredentialsUseCase: AuthenticateCredentialsUseCase,
    private readonly updateLoginSessionUseCase: UpdateLoginSessionUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly tokenService: TokenService,
    private readonly sessionAuth: SessionAuthService,
  ) { }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Entra com e-mail e senha e devolve o token' })
  async login(@Body() dto: LoginDto) {
    const email = dto.email ?? '';
    const password = dto.password ?? '';
    const user = await this.authenticateCredentialsUseCase.call(email, password);

    await this.updateLoginSessionUseCase.call(user.userId, {
      deviceToken: dto.device_token ?? '',
      deviceType: dto.device_type ?? null,
      latitude: dto.latitude ?? '',
      longitude: dto.longitude ?? '',
      loginStatus: 'yes',
    });

    const token = this.tokenService.sign(user.userId, user.userType ?? null);
    return ok({
      user_id: user.userId,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      user_type: user.userType,
      dob: user.dob,
      vehicle_type: user.vehicleType,
      profile_image: imageUrl(user.profileImage),
      device_token: dto.device_token ?? '',
      vehicle_no: user.vehicleNo,
      company_name: user.companyName,
      licence_image_front: imageUrl(user.licenceImageFront),
      licence_image_back: imageUrl(user.licenceImageBack),
      suburb: user.suburb,
      postcode: user.postcode,
      state: user.state,
      country_name: user.countryName,
      street_name: user.streetName,
      house_no: user.houseNo,
      vehicle_reg_no: user.vehicleRegNo,
      country_code: user.countryCode,
      token,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Encerra a sessão' })
  async logout(@CurrentUser() user: AuthUser) {
    await this.sessionAuth.requireActiveUser(user.userId);
    return this.logoutUseCase.call(user.userId);
  }
}
