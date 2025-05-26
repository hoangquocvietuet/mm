import { Injectable } from '@nestjs/common';
import { createPublicClient, http, PublicClient } from 'viem';
import { sepolia } from 'viem/chains';

@Injectable()
export class MonitorService {
  private client: PublicClient;
  constructor() {
    this.client = createPublicClient({
      chain: sepolia,
      transport: http(),
    });
  }

  async getMonitor() {
    const blockNumber = await this.client.getBlockNumber();
    const block = await this.client.getBlock({
      blockNumber: blockNumber,
    });
    return {
      blockNumber: Number(blockNumber),
      timestamp: Number(block.timestamp),
    };
  }
}
