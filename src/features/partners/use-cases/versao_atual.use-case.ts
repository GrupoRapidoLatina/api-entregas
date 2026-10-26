import { Injectable } from '@nestjs/common';
import { ok } from '../../../core/http/api-response';

@Injectable()
export class VersaoAtualUseCase {
  async call() {
    const version = process.env.APP_VERSION;
    return ok(version);
  }
}
