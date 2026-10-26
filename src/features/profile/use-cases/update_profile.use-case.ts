import { BadRequestException, Injectable } from '@nestjs/common';
import { UserType } from '../../../core/shared/enums/user-type.enum';
import {
  isValidPlate,
  normalizePlate,
  normalizeVehicleType,
} from '../../../core/helpers/vehicle-plate.helper';
import { ProfileRepository } from '../repositories/profile.repository';

@Injectable()
export class UpdateProfileUseCase {
  constructor(private readonly repository: ProfileRepository) {}

  async call(userId: number, data: Record<string, string>) {
    const email = data.email?.trim();
    if (email) {
      const existing = await this.repository.findByEmail(email);
      if (existing && existing.userId !== userId) {
        throw new BadRequestException('E-mail inválido !');
      }
    }

    const current = await this.repository.findById(userId);
    if (!current) throw new BadRequestException('Usuário não encontrado');
    if (current.userType === UserType.Driver) {
      this.assertVehiclePlate(current.vehicleType, current.vehicleRegNo, data);
    }

    return this.repository.updateProfile(userId, data);
  }

  private assertVehiclePlate(
    savedType: string | null,
    savedPlate: string | null,
    data: Record<string, string>,
  ) {
    const nextType = data.vehicleType;
    const nextPlate = data.vehicleRegNo?.trim() ?? '';
    const typeChanged =
      nextType != null &&
      normalizeVehicleType(nextType) !== normalizeVehicleType(savedType);

    if (nextPlate && !isValidPlate(nextPlate)) {
      throw new BadRequestException('Placa inválida');
    }

    if (!typeChanged) return;

    const plateChanged =
      nextPlate.length > 0 &&
      normalizePlate(nextPlate) !== normalizePlate(savedPlate);
    if (!plateChanged) {
      throw new BadRequestException(
        'Ao trocar o veículo, informe a placa nova',
      );
    }
  }
}
