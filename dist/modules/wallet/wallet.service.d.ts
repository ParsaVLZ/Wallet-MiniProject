import { Wallet } from './entities/wallet.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { DepositDto, WithdrawDto } from './wallet.dto';
export declare class WalletService {
    private walletRepository;
    private userService;
    private dataSource;
    constructor(walletRepository: Repository<Wallet>, userService: UserService, dataSource: DataSource);
    deposit(depositDto: DepositDto): Promise<{
        message: string;
    }>;
    paymentByWallet(withdrawDto: WithdrawDto): Promise<{
        message: string;
    }>;
}
