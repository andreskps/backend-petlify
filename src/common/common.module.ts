import { Module } from '@nestjs/common';
import { ErrorHandlingService } from './services/ErrorHandling.service';


@Module({

  providers: [ErrorHandlingService],
  exports: [ErrorHandlingService],
})
export class CommonModule {}
