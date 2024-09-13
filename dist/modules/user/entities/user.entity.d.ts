import { Wallet } from "src/modules/wallet/entities/wallet.entity";
export declare class User {
    id: number;
    fullName: string;
    mobile: string;
    balance: number;
    created_at: Date;
    transactions: Wallet[];
}
