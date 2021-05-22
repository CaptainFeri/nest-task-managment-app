import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/creat-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTaskWithFilterDto } from "./dto/get-task-with-filter.dto";
import { Task } from "./task.entity";
import { User } from "src/auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(taskFilter : GetTaskWithFilterDto) : Promise<Task[]> {

        const { status , search } = taskFilter;
        const query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status',{ status });
        }

        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search',{ search : `%${search}%`});
        }

        const tasks = await query.getMany();
        return tasks;
    }


    async createTask(
        createTaskDto : CreateTaskDto,
        user: User,
    ): Promise<Task> {
        const { title , description } = createTaskDto;

        const task = new Task();
        task.title = title;
        task.description = description;
        task.user = user;
        task.status = TaskStatus.OPEN;

        await task.save();
        
        return task;
    }
}