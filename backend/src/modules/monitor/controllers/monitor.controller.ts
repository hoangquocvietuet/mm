import { Controller, Get, Injectable } from '@nestjs/common';
import { MonitorService } from '../services/monitor.service';

@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get()
  async getMonitor() {
    return this.monitorService.getMonitor();
  }
}
