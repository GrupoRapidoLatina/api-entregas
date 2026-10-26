import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../core/auth/decorators/current-user.decorator';
import type { AuthUser } from '../../core/auth/models/auth-user.model';
import { SessionAuthService } from '../../core/auth/services/session-auth.service';
import { ProfileInfoUseCase } from './use-cases/profile_info.use-case';
import { UpdateProfileUseCase } from './use-cases/update_profile.use-case';
import { DeleteAccountUseCase } from './use-cases/delete_account.use-case';
import { EditProfileDto } from './dto/edit_profile.dto';
import { ok } from '../../core/http/api-response';

const profileFieldMap: Record<string, string> = {
  firstname: 'firstname',
  lastname: 'lastname',
  email: 'email',
  phone: 'phone',
  dob: 'dob',
  vehicleType: 'vehicleType',
  vehicle_type: 'vehicleType',
  companyName: 'companyName',
  company_name: 'companyName',
  suburb: 'suburb',
  postcode: 'postcode',
  state: 'state',
  countryName: 'countryName',
  country_name: 'countryName',
  streetName: 'streetName',
  street_name: 'streetName',
  houseNo: 'houseNo',
  house_no: 'houseNo',
  vehicleRegNo: 'vehicleRegNo',
  vehicle_reg_no: 'vehicleRegNo',
  countryCode: 'countryCode',
  country_code: 'countryCode',
};

@ApiTags('Perfil')
@ApiBearerAuth()
@Controller()
export class ProfileController {
  constructor(
    private readonly profileInfoUseCase: ProfileInfoUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    private readonly sessionAuth: SessionAuthService,
  ) {}

  @Post('profileinfo')
  @ApiOperation({ summary: 'Devolve o perfil da conta logada' })
  async profileinfo(@CurrentUser() user: AuthUser) {
    await this.sessionAuth.requireActiveUser(user.userId);
    return this.profileInfoUseCase.call(user.userId);
  }

  @Post('editProfile')
  @ApiOperation({ summary: 'Atualiza o perfil da conta logada' })
  async editProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: EditProfileDto,
  ) {
    await this.sessionAuth.requireActiveUser(user.userId);

    const data: Record<string, string> = {};
    for (const [key, value] of Object.entries(dto)) {
      const mapped = profileFieldMap[key];
      if (!mapped || value == null || value === '') continue;
      data[mapped] = String(value);
    }

    this.assignTrimmed(data, 'profileImage', dto.profile_image);
    this.assignTrimmed(data, 'licenceImageFront', dto.licence_front_image);
    this.assignTrimmed(data, 'licenceImageBack', dto.licence_back_image);

    await this.updateProfileUseCase.call(user.userId, data);
    return this.profileInfoUseCase.call(user.userId);
  }

  @Post('deleteAccount')
  @ApiOperation({ summary: 'Exclui a conta logada' })
  async deleteAccount(@CurrentUser() user: AuthUser) {
    await this.sessionAuth.requireActiveUser(user.userId);
    await this.deleteAccountUseCase.call(user.userId);
    return ok();
  }

  private assignTrimmed(
    data: Record<string, string>,
    key: string,
    value?: string,
  ) {
    const trimmed = value?.trim();
    if (!trimmed) return;
    data[key] = trimmed;
  }
}
