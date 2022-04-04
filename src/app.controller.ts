import { Controller, Delete, Get, Post, Put, Patch, Body, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post('/*')
  capturePostRequest(@Body() payload: any, @Query() params) {
    try {
      const passthrough = JSON.parse(payload?.invoice?.passthrough || payload?.transaction?.invoice.passthrough);
      return this.appService.putCallbackDataToQueue(payload, passthrough.routingKey)

    } catch (e) {
      console.log("Invalid body")
    } finally {
      return;
    }

  }


}
