import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UsersDto {
  @IsString()
  @Length(3, 50)
  @IsNotEmpty({ message: 'Имя должно быть обязательно!' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Email должен быть обязательно!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Описание должно быть обязательно!' })
  description: string;
}
