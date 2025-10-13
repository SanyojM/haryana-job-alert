import { Controller, Post, Body, Headers, UseGuards, Req, Param, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import type { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    const user = req.user as any;
    return this.paymentsService.createOrder(createOrderDto.mock_series_id, user.id);
  }

  @Post('webhook/razorpay')
  handleRazorpayWebhook(@Body() body: any, @Headers('x-razorpay-signature') signature: string) {
    
    if (!signature) {
        console.error('ERROR: Razorpay signature is missing from headers.');
        throw new BadRequestException('Razorpay signature missing');
    }
    
    return this.paymentsService.verifyPayment(body, signature);
  }
}