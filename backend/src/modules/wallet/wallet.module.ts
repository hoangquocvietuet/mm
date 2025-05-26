import { Module } from '@nestjs/common';
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';

@Module({
  imports: [],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
