import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  operation: string;

  @ApiProperty()
  data: any;
  /*| accountDto.ResponseAccountRecoveryDto
    | accountDto.ResponseAccountRecoveryUpdateDto
    | accountDto.ResponseAccountRecoveryVerifyDto
    | authDto.ResponseKeysDto
    | authDto.ResponseLoginDto;*/
}
