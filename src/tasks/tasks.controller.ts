import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/creat-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { GetTaskWithFilterDto } from './dto/get-task-with-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService : TasksService){}

    @Get()
    getTasks(@Query(ValidationPipe) taskFilterDto: GetTaskWithFilterDto) : Promise<Task[]> {
        return this.taskService.getTasks(taskFilterDto);
    }

    @Get('/:id')
    getTaskById(@Param('id',ParseIntPipe) id : number): Promise<Task> {
        return this.taskService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto : CreateTaskDto,
    @GetUser() user: User,
    ) : Promise<Task> {
        return this.taskService.createTask(createTaskDto,user);
    }

    @Delete('/:id')
    deleteTask(@Param('id',ParseIntPipe) id:number): Promise<void> {
        return this.taskService.deleteTask(id);
    }

    @Patch(':id/status')
    updateTaskStatus(@Param('id',ParseIntPipe) id:number ,@Body('status',TaskStatusValidationPipe) status:TaskStatus): Promise<Task> {
        return this.taskService.updateTaskStatus(id,status);
    }
}
