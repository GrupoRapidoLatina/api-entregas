import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';
import { UserType } from '../../../core/shared/enums/user-type.enum';

@Injectable()
export class NearbyDeliveriesRepository {
  constructor(private readonly prisma: PrismaService) { }

  updateLocation(userId: number, latitude: string, longitude: string) {
    return this.prisma.user.updateMany({
      where: { userId },
      data: { latitude, longitude },
    });
  }

  findUser(userId: number) {
    return this.prisma.user.findUnique({ where: { userId } });
  }

  findNearbyDeliveries(latitude: string, longitude: string, vehicleType: string) {
    return this.prisma.$queryRaw<Array<Record<string, unknown>>>`
      SELECT o.*,
    ( 3959 * acos( cos( radians(${latitude}) ) * cos( radians(o.pickup_lat) )
      * cos( radians(o.pickup_long) - radians(${longitude}) )
      + sin( radians(${latitude}) ) * sin( radians(o.pickup_lat) ) ) ) AS distance
      FROM orders o
      WHERE o.delivery_status = ${DeliveryStatus.Available}
    AND o.vehicle_type = ${vehicleType}
    AND (o.driver_id = 0 OR o.driver_id IS NULL)
      HAVING distance <= 7
      ORDER BY distance ASC
    `;
  }

  findNearbyDeliveryBoys(latitude: string, longitude: string) {
    return this.prisma.$queryRaw<Array<Record<string, unknown>>>`
      SELECT u.*,
    ( 3959 * acos( cos( radians(${latitude}) ) * cos( radians(u.latitude) )
      * cos( radians(u.longitude) - radians(${longitude}) )
      + sin( radians(${latitude}) ) * sin( radians(u.latitude) ) ) ) AS distance
      FROM user u
      WHERE u.user_type = ${UserType.Driver} AND u.login_status = 'yes'
      HAVING distance <= 7
      ORDER BY distance ASC
    `;
  }
}
