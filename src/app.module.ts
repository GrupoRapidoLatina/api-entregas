import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { SessionAuthModule } from './core/auth/session-auth.module';
import { InfraModule } from './core/services/service.module';
import { HealthController } from './health/health.controller';
import { LoginModule } from './features/login/login.module';
import { RegisterModule } from './features/register/register.module';
import { ForgotPasswordModule } from './features/forgot_password/forgot_password.module';
import { ChangePasswordModule } from './features/change_password/change_password.module';
import { ProfileModule } from './features/profile/profile.module';
import { CreateOrderModule } from './features/create_order/create_order.module';
import { DeliveryDetailModule } from './features/delivery_detail/delivery_detail.module';
import { NearbyDeliveriesModule } from './features/nearby_deliveries/nearby_deliveries.module';
import { CurrentDeliveriesModule } from './features/current_deliveries/current_deliveries.module';
import { DriverHistoryModule } from './features/driver_history/driver_history.module';
import { CustomerHistoryModule } from './features/customer_history/customer_history.module';
import { AcceptDeliveryModule } from './features/accept_delivery/accept_delivery.module';
import { PickupDeliveryModule } from './features/pickup_delivery/pickup_delivery.module';
import { DeliverOrderModule } from './features/deliver_order/deliver_order.module';
import { ReportProblemModule } from './features/report_problem/report_problem.module';
import { ReviewModule } from './features/review/review.module';
import { CancelDeliveryModule } from './features/cancel_delivery/cancel_delivery.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { SettingsPricesModule } from './features/settings_prices/settings_prices.module';
import { PartnersModule } from './features/partners/partners.module';
import { VerifyEmailModule } from './features/verify_email/verify_email.module';
import { StatusModule } from './features/status/status.module';
import { UploadModule } from './features/upload/upload.module';
import { ValidarComprovanteModule } from './features/validar_comprovante/validar_comprovante.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SessionAuthModule,
    InfraModule,
    UploadModule,
    ValidarComprovanteModule,
    LoginModule,
    RegisterModule,
    ForgotPasswordModule,
    ChangePasswordModule,
    ProfileModule,
    CreateOrderModule,
    DeliveryDetailModule,
    NearbyDeliveriesModule,
    CurrentDeliveriesModule,
    DriverHistoryModule,
    CustomerHistoryModule,
    AcceptDeliveryModule,
    PickupDeliveryModule,
    DeliverOrderModule,
    ReportProblemModule,
    ReviewModule,
    CancelDeliveryModule,
    NotificationsModule,
    SettingsPricesModule,
    PartnersModule,
    VerifyEmailModule,
    StatusModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }
