import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validateRoles = this.reflector.get(META_ROLES, context.getHandler());

    if (!validateRoles) {
      return true;
    }

    if (validateRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user  = request.user as User;

    if(!user){
      throw new BadRequestException('User not found');
    }

    for (const role of user.roles) {
      if (validateRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException('You do not have permission to access this route');
  }
}
