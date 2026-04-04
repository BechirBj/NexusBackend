import { IsEmail, IsString, IsDefined } from 'class-validator';

export class AdminLoginDto {
  @IsEmail()
  @IsDefined({ message: 'Email is required and should be a valid email.' })
  email: string;

  @IsString()
  @IsDefined({ message: 'Password is required.' })
  password: string;
}
