import { Global, Module } from '@nestjs/common';
import { FileUploadService } from './file-upload/file-upload.service';
import { PdfService } from './pdf/pdf.service';
import { FcmService } from './fcm/fcm.service';
import { MailService } from './mail/mail.service';

@Global()
@Module({
  providers: [FileUploadService, PdfService, FcmService, MailService],
  exports: [FileUploadService, PdfService, FcmService, MailService],
})
export class InfraModule { }
