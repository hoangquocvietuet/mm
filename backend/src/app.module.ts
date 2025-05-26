import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonitorModule } from './modules/monitor/monitor.module';
import { WalletModule } from './modules/wallet/wallet.module';

@Module({
  imports: [MonitorModule, WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
