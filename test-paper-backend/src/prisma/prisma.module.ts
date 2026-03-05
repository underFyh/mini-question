// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 设为全局模块，这样就不需要每次都在其他 module 中 import PrismaModule 了
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }