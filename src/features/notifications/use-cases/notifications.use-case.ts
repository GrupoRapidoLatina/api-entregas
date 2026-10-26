import { Injectable } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { imageUrl } from '../../../core/helpers/image-url.helper';
import { NotificationsRepository } from '../repositories/notifications.repository';

@Injectable()
export class NotificationsUseCase {
  constructor(private readonly repository: NotificationsRepository) { }

  async call(userId: number) {
    const rows = await this.repository.findByUserId(userId);
    const data = rows.map((notification) => ({
      notification_id: notification.notification_id,
      type: notification.notification_type,
      user_id: notification.user_id,
      pickup_comapny_name: notification.pickup_comapny_name,
      dropoff_comapny_name: notification.dropoff_comapny_name,
      pickup_first_name: notification.pickup_first_name,
      pickup_last_name: notification.pickup_last_name,
      pickup_mob_number: notification.pickup_mob_number,
      dropoff_first_name: notification.dropoff_first_name,
      dropoff_last_name: notification.dropoff_last_name,
      dropoff_mob_number: notification.dropoff_mob_number,
      pickupaddress: notification.pickupaddress,
      dropoffaddress: notification.dropoffaddress,
      item_quantity: notification.item_quantity,
      delivery_date: notification.delivery_date,
      delivery_cost: notification.delivery_cost,
      driver_id: notification.driver_id,
      message: notification.notification_message,
      firstname: notification.firstname,
      lastname: notification.lastname,
      profile_image: imageUrl(
        typeof notification.profile_image === 'string' ? notification.profile_image : null,
      ),
      order_id: notification.order_id,
      delivery_status: notification.delivery_status,
    }));
    return ok(data);
  }
}
