import * as bcrypt from 'bcrypt';

export const hashPassword =  (password: string): string => {
  
  return bcrypt.hashSync(password, 10);
};

export const comparePasswords =  (password: string, hash: string): boolean=> {
  return  bcrypt.compareSync(password, hash);
};
