import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileInfoUseCase } from './use-cases/profile_info.use-case';
import { UpdateProfileUseCase } from './use-cases/update_profile.use-case';
import { DeleteAccountUseCase } from './use-cases/delete_account.use-case';
import { ProfileRepository } from './repositories/profile.repository';

@Module({
  controllers: [ProfileController],
  providers: [
    ProfileInfoUseCase,
    UpdateProfileUseCase,
    DeleteAccountUseCase,
    ProfileRepository,
  ],
})
export class ProfileModule {}
