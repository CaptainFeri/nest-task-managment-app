import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/creat-task.dto';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { GetTaskWithFilterDto } from './dto/get-task-with-filter.dto';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository : TaskRepository,
        ) {}

    getTasks(filterDTO: GetTaskWithFilterDto): Promise<Task[]> {
           return this.taskRepository.getTasks(filterDTO); 
        }

    async getTaskById(id:number): Promise<Task> {
        const found = await this.taskRepository.findOne(id);

        if(!found) {
            throw new NotFoundException(`task by  Id " ${id} " not found ...`);
        }

        return found;
    }

    async createTask(
        createTaskDto : CreateTaskDto,
        user: User,
    ) : Promise<Task> {
        return this.taskRepository.createTask(createTaskDto,user);
    }

    async deleteTask(id:number) : Promise<void> {
        const task = this.getTaskById(id);
        if(task){
            await this.taskRepository.delete(id);
        }
    }

    async updateTaskStatus(id:number,taskStatus : TaskStatus) : Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = taskStatus;
        await task.save();
        return task;
    }
}
