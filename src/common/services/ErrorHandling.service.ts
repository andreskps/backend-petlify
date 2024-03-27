import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import {
    BadRequestException,
    InternalServerErrorException,
  } from '@nestjs/common';
  
  @Injectable()
  export class ErrorHandlingService {
    handleDBError(error: any): never {
      if (error.code === '23505') {
        throw new BadRequestException('Registro duplicado');
      }
  
      if (error.code === '23503') {
        throw new BadRequestException(
          'No se encontró el registro en la base de datos',
        );
      }
  
      throw new InternalServerErrorException('Error interno del servidor');
    }
  
    handleErrors(error: any): never {
      if (error.response.statusCode === 400) {
        throw new BadRequestException(error.message);
      }
  
      if (error.response.statusCode === 404) {
        throw new NotFoundException(error.message);
      }
  
      if (error.resonse.statusCode === 401) {
        throw new UnauthorizedException(error.message);
      }
  
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
  