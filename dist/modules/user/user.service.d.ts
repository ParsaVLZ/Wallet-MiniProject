import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findById(id: number): Promise<User>;
    createUser(createDto: CreateUserDto): Promise<User>;
}
