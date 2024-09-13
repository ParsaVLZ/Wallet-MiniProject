import { WalletService } from './wallet.service';
import { DepositDto, WithdrawDto } from './wallet.dto';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    create(depositDto: DepositDto): Promise<{
        message: string;
    }>;
    withdraw(withdrawDto: WithdrawDto): Promise<{
        message: string;
    }>;
}
