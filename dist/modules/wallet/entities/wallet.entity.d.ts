import { User } from "src/modules/user/entities/user.entity";
export declare class Wallet {
    id: number;
    type: string;
    amount: number;
    reason: string;
    productId: number;
    invoice_number: string;
    created_at: Date;
    userId: number;
    user: User;
}
