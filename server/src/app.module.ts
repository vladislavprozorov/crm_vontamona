import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { RequestsModule } from './requests/requests.module';

@Module({
  imports: [ClientsModule, RequestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
