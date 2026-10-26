import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../core/database/prisma.service';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(data: Omit<Prisma.ReviewCreateInput, 'id'>) {
    const last = await this.prisma.review.aggregate({ _max: { id: true } });
    return this.prisma.review.create({
      data: {
        ...data,
        id: (last._max.id ?? 0) + 1,
      },
    });
  }
}
