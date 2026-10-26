import { Injectable, NotFoundException } from '@nestjs/common';
import { imageUrl } from '../../../core/helpers/image-url.helper';
import { ok } from '../../../core/http/api-response';
import { ProfileRepository } from '../repositories/profile.repository';

@Injectable()
export class ProfileInfoUseCase {
  constructor(private readonly repository: ProfileRepository) { }

  async call(userId: number) {
    const results = await this.repository.findById(userId);
    if (!results) throw new NotFoundException('Please enter valid user id !');
    const userdetail = {
      user_id: results.userId,
      firstname: results.firstname,
      lastname: results.lastname,
      email: results.email,
      phone: results.phone,
      reg_type: results.regType,
      user_type: results.userType,
      dob: results.dob,
      vehicle_type: results.vehicleType,
      profile_image: imageUrl(results.profileImage),
      vehicle_no: results.vehicleNo,
      company_name: results.companyName,
      licence_image_front: imageUrl(results.licenceImageFront),
      licence_image_back: imageUrl(results.licenceImageBack),
      suburb: results.suburb,
      postcode: results.postcode,
      state: results.state,
      country_name: results.countryName,
      street_name: results.streetName,
      house_no: results.houseNo,
      vehicle_reg_no: results.vehicleRegNo,
      country_code: results.countryCode,
    };
    return ok(userdetail);
  }
}
