import { Body, Controller, Post } from '@nestjs/common';
import {
  WalletService,
  SendTransactionParams,
  TriggerPriceParams,
} from '../services/wallet.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('send-transaction')
  async sendTransaction(@Body() body: SendTransactionParams) {
    return this.walletService.sendTransaction(body);
  }

  @Post('trigger-price')
  async triggerPrice(@Body() body: TriggerPriceParams) {
    return this.walletService.triggerPrice(body);
  }
}
