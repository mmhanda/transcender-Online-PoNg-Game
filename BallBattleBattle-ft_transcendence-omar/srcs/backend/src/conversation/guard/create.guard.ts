import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ValidUserIdGuard implements CanActivate {
    constructor( private readonly userService: UsersService, ) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean>  {
        const request = context.switchToHttp().getRequest();
        const body = request.body;
        if(body.type === 'direct'){
            if(body.guestId === request.user.id){
                throw new HttpException(
                    {
                        message: 'You can not create a conversation with yourself',
                    },
                    230,
                );
            }
            const guestUser = await this.userService.findOne(body.guestId);
            if(!guestUser){
                throw new HttpException(
                    {
                        message: 'Guest user not found',
                    },
                    230,
                );
            }
        }
        if(body.type !== 'group' && body.type !== 'direct'){
            throw new HttpException(
                {
                    message: 'Invalid conversation type',
                },
                230,
            );
        }
        if(body.status !== 'public' && body.status !== 'private' && body.status !== 'protected'){
            throw new HttpException(
                {
                    message: 'Invalid conversation status',
                },
                230,
            );
        }
        if(body.status === 'protected' && !body.password){
            throw new HttpException(
                {
                    message: 'Password is required',
                },
                230,
            );
        }
        return true;
    }
}