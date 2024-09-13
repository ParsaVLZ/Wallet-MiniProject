import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findById(id: number): Promise<import("./entities/user.entity").User>;
}
