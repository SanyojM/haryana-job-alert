import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get<string>('RAZORPAY_KEY_ID'),
      key_secret: this.configService.get<string>('RAZORPAY_KEY_SECRET'),
    });
  }

  async createOrder(mockSeriesId: number, userId: number) {
    const series = await this.prisma.mock_series.findUnique({
      where: { id: mockSeriesId },
    });

    // FIX: Convert series.price to a number before comparison
    if (!series || !series.price || Number(series.price) <= 0) {
      throw new NotFoundException('Paid series not found or has no price.');
    }

    const amountInPaise = Number(series.price) * 100;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_series_${mockSeriesId}_user_${userId}`,
    };

    const order = await this.razorpay.orders.create(options);

    await this.prisma.payments.create({
      data: {
        amount: series.price,
        payment_method: 'razorpay',
        status: 'pending',
        transaction_id: order.id,
        user_id: userId,
        mock_series_id: mockSeriesId,
      },
    });

    return {
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      series_title: series.title,
    };
  }

  async verifyPayment(body: any, signature: string) {
    const webhookSecret = this.configService.get<string>('RAZORPAY_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
        console.error('FATAL ERROR: RAZORPAY_WEBHOOK_SECRET is not set in .env file.');
        throw new InternalServerErrorException('Webhook secret is not configured.');
    }

    const shasum = crypto.createHmac('sha256', webhookSecret);
    // IMPORTANT: Razorpay generates the signature from the raw request body.
    shasum.update(JSON.stringify(body));
    const digest = shasum.digest('hex');

    if (digest !== signature) {
      console.error('SIGNATURE MISMATCH: Generated digest does not match the Razorpay signature.');
      throw new BadRequestException('Invalid webhook signature.');
    }

    const { order_id } = body.payload.payment.entity;

    const updatedPayment = await this.prisma.payments.update({
      where: { transaction_id: order_id },
      data: {
        status: 'success',
      },
    });

    return { status: 'ok', payment: updatedPayment };
  }
}