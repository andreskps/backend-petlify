import { IsString } from 'class-validator';
export class CreatePetDto {

    @IsString()
    name: string;
}
