import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

import { ImportacaoService } from './importacao.service';

@Controller('importacao')
export class ImportacaoController {
  constructor(private readonly importacaoService: ImportacaoService) { }

  @Post('csv')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const ext = extname(file.originalname);
        const name = `${Date.now()}${ext}`;
        cb(null, name);
      }
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.csv$/)) {
        return cb(new Error('Somente arquivos CSV são permitidos'), false);
      }
      cb(null, true);
    }
  }))
  async uploadCSV(@UploadedFile() file: Express.Multer.File) {
    return this.importacaoService.importarCSV(file.path);
  }

  @Post('pdf')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    const savedPaths = await this.importacaoService.extrairPaginasPDF(file.path);
    return { total_paginas: savedPaths.length, arquivos: savedPaths };
  }

}
