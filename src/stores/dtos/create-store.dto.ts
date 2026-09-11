import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateStoreDto {
    @ApiProperty({example: 'Pizza Hut', description: 'store name'})
    @IsString()
    @IsNotEmpty()
    name:string;


    @ApiPropertyOptional({ example: 'Best pizza in town', description: 'Store description' })
    @IsString()
    @IsOptional()
    description?:string;


    @ApiProperty({ example: 'Main Street 123, Agadir', description: 'Store physical address' })
    @IsString()
    @IsNotEmpty()
    address:string;


    @ApiPropertyOptional({ example: 'https://example.com/logo.png', description: 'Store image or logo URL' })
    @IsString()
    @IsOptional()
    image?:string;


    @ApiPropertyOptional({ example: true, description: 'Store open or closed status' })
    @IsOptional()
    @IsBoolean()
    isOpen?:boolean;
}