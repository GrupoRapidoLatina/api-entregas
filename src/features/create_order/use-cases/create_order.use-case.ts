import { BadRequestException, Injectable } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';
import { parseOptionalDate } from '../../../core/helpers/date.helper';
import { DeliveryStatus } from '../../../core/shared/enums/delivery-status.enum';
import { FileUploadService } from '../../../core/services/file-upload/file-upload.service';
import { PdfService } from '../../../core/services/pdf/pdf.service';
import { buildLabelPdf } from '../helpers/label-pdf.helper';
import { imageUrl } from '../../../core/helpers/image-url.helper';
import { CreateOrderDto } from '../dto/create_order.dto';
import { CreateOrderRepository } from '../repositories/create_order.repository';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly repository: CreateOrderRepository,
    private readonly fileUpload: FileUploadService,
    private readonly pdfService: PdfService,
  ) {}

  async call(userId: number, dto: CreateOrderDto, deliveryCost: string) {
    const user = await this.repository.findUser(userId);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    if (user.idOperacao == null) {
      throw new BadRequestException(
        'id_operacao é obrigatório. Usuário sem operação cadastrada.',
      );
    }
    const created = await this.repository.createOrder({
      userId,
      idOperacao: user.idOperacao,
      nfChave: `APP${Date.now()}`,
      orderId: '0',
      pickupComapnyName: dto.pickup_comapny_name ?? '',
      pickupFirstName: dto.pickup_first_name ?? '',
      pickupLastName: dto.pickup_last_name ?? '',
      pickupMobNumber: dto.pickup_mob_number ?? '',
      pickupaddress: dto.pickupaddress ?? '',
      pickupLat: (dto.pickUpLat ?? '') || (dto.pickup_lat ?? ''),
      pickupLong: (dto.pickUpLong ?? '') || (dto.pickup_long ?? ''),
      itemDescription: dto.item_description ?? '',
      itemQuantity: dto.item_quantity ?? '',
      deliveryDate: parseOptionalDate(dto.delivery_date),
      pickupSpecialInst: dto.pickup_special_inst ?? '',
      dropoffFirstName: dto.dropoff_first_name ?? '',
      dropoffLastName: dto.dropoff_last_name ?? '',
      dropoffMobNumber: dto.dropoff_mob_number ?? '',
      dropoffSpecialInst: dto.dropoff_special_inst ?? '',
      dropoffaddress: dto.dropoffaddress ?? '',
      dropoffLat: (dto.dropOffLat ?? '') || (dto.dropoff_lat ?? ''),
      dropoffLong: (dto.dropOffLong ?? '') || (dto.dropoff_long ?? ''),
      parcelHeight: dto.parcel_height ?? '',
      parcelWidth: dto.parcel_width ?? '',
      parcelLenght: dto.parcel_lenght ?? '',
      parcelWeight: dto.parcel_weight ?? '',
      deliveryDistance: dto.delivery_distance ?? '',
      deliveryStatus: DeliveryStatus.Available,
      deliveryCost,
      vehicleType: dto.vehicle_type ?? '',
      deliveryType: dto.delivery_type ?? '',
      driverDeliveryCost: dto.driver_delivery_cost ?? '',
      dropoffComapnyName: dto.dropoff_comapny_name ?? '',
      deliveryTime: dto.delivery_time ?? '',
      pickupCountryCode: dto.pickup_country_code ?? '',
      dropoffCountryCode: dto.dropoff_country_code ?? '',
      driverId: 0,
    });

    let pdfUrl = '';
    try {
      const fileName = `label_${created.orderId}.pdf`;
      const pdfBuffer = buildLabelPdf(this.pdfService, {
        orderId: created.orderId,
        pickup: dto.pickupaddress ?? '',
        dropoff: dto.dropoffaddress ?? '',
        deliveryType: dto.delivery_type ?? '',
        deliveryDate: dto.delivery_date ?? '',
        deliveryTime: dto.delivery_time ?? '',
      });
      const storedName = await this.fileUpload.uploadBuffer(
        pdfBuffer,
        fileName,
      );
      pdfUrl = imageUrl(storedName);
      await this.repository.updatePdfUrl(created.id, pdfUrl);
    } catch {
      pdfUrl = '';
    }

    return ok({
      order_id: created.orderId,
      id: created.id,
      pick: dto.pickupaddress ?? '',
      drop: dto.dropoffaddress ?? '',
      pdf_url: pdfUrl,
    });
  }
}
