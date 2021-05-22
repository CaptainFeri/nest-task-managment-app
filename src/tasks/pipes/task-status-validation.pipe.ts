import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {

    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];
    
    transform(value : any){
        value = value.toUpperCase();
        if(!this.isStatusValide(value)){
            throw new BadRequestException(`${value} is bad status request!`);
        }

        return value;
    }

    private isStatusValide(status : any ) {
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }
}