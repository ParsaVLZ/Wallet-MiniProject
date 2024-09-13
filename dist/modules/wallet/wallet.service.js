"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const wallet_entity_1 = require("./entities/wallet.entity");
const typeorm_2 = require("typeorm");
const user_service_1 = require("../user/user.service");
const user_entity_1 = require("../user/entities/user.entity");
const wallet_enum_1 = require("./wallet.enum");
const products_1 = require("../products");
let WalletService = class WalletService {
    constructor(walletRepository, userService, dataSource) {
        this.walletRepository = walletRepository;
        this.userService = userService;
        this.dataSource = dataSource;
    }
    async deposit(depositDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const { fullName, mobile, amount } = depositDto;
            const user = await this.userService.createUser({ fullName, mobile });
            const userData = await queryRunner.manager.findOneBy(user_entity_1.User, { id: user.id });
            const newBalance = userData.balance + amount;
            await queryRunner.manager.update(user_entity_1.User, { id: user.id }, { balance: newBalance });
            await queryRunner.manager.insert(wallet_entity_1.Wallet, {
                amount,
                type: wallet_enum_1.WalletType.Deposit,
                invoice_number: Date.now().toString(),
                userId: user.id
            });
            await queryRunner.commitTransaction();
            await queryRunner.release();
        }
        catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
        }
        return {
            message: "Payment was successful!"
        };
    }
    async paymentByWallet(withdrawDto) {
        const { productId, userId } = withdrawDto;
        const product = products_1.ProductList.find(product => product.id === productId);
        if (!product)
            throw new common_1.NotFoundException("Product Not Found!");
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const user = await queryRunner.manager.findOneBy(user_entity_1.User, { id: userId });
            if (!user)
                throw new common_1.NotFoundException("User Not Found!");
            if (product.price > user.balance)
                throw new common_1.BadRequestException("User balance is not enough!");
            const newBalance = user.balance - product.price;
            await queryRunner.manager.update(user_entity_1.User, { id: userId }, { balance: newBalance });
            await queryRunner.manager.insert(wallet_entity_1.Wallet, {
                amount: product.price,
                userId,
                reason: "Buying Product" + product.name,
                productId,
                invoice_number: Date.now().toString(),
                type: wallet_enum_1.WalletType.Withdraw
            });
            await queryRunner.commitTransaction();
            await queryRunner.release();
        }
        catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            if (error?.statusCode) {
                throw new common_1.HttpException(error.message, error?.statusCode);
            }
            throw new common_1.BadRequestException(error?.message);
        }
        return {
            message: "Payment Order Done successfully!"
        };
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        user_service_1.UserService,
        typeorm_2.DataSource])
], WalletService);
//# sourceMappingURL=wallet.service.js.map