import { Injectable } from '@nestjs/common';
import {
  createPublicClient,
  http,
  PublicClient,
  createWalletClient,
  parseEther,
  encodeFunctionData,
} from 'viem';
import { sepolia } from 'viem/chains';
import { DexABI } from '../../../common/abi/dex';
import { privateKeyToAccount } from 'viem/accounts';
import { config } from 'dotenv';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { DEX_ADDRESS, ROUTER_ADDRESS } from '../../../common/constrant';
config();

export interface SendTransactionParams {
  to: `0x${string}`;
  value: bigint;
  data: any;
}

export class TriggerPriceParams {
  @ApiProperty()
  token: `0x${string}`;

  @ApiProperty()
  router: string;

  @ApiProperty()
  targetPrice: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;
}

@Injectable()
export class WalletService {
  private client: PublicClient;
  private walletClient: any;
  constructor() {
    this.client = createPublicClient({
      chain: sepolia,
      transport: http(),
    });
    this.walletClient = createWalletClient({
      chain: sepolia,
      transport: http(),
      account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
    });
  }

  async sendTransaction({ to, value, data }: SendTransactionParams) {
    const hash = await this.walletClient.sendTransaction({
      to,
      data,
      value,
    });
    return hash;
  }

  async triggerPrice({
    token,
    router,
    targetPrice,
    orderId,
    status,
    startTime,
    endTime,
  }: TriggerPriceParams) {
    const calldata = encodeFunctionData({
      abi: DexABI,
      functionName: 'setToPrice',
      args: [router, token, targetPrice, orderId, status, startTime, endTime],
    });
    const tx = await this.sendTransaction({
      to: DEX_ADDRESS,
      value: parseEther('1'),
      data: calldata,
    });
    const receipt = await this.client.waitForTransactionReceipt({
      hash: tx,
    });
    return receipt;
  }
}
