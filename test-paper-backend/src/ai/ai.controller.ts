import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('api/paper')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Get('generate')
    async generatePaper(@Query('grade') grade: string) {
        const targetGrade = grade || '幼小衔接';
        const paperData = await this.aiService.generateDailyPaper(targetGrade);

        return {
            code: 200,
            message: 'success',
            data: paperData,
        };
    }
}