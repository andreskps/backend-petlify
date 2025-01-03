import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../enums/Validate-Roles.enum';

export const META_ROLES = '';

export const RoleProtected = (...args: ValidRoles[]) => {
  

    return SetMetadata(META_ROLES, args);
};
