import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { DepositDto, WithdrawDto } from './wallet.dto';
import { User } from '../user/entities/user.entity';
import { WalletType } from './wallet.enum';
import { ProductList } from '../products';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private userService: UserService,
    private dataSource: DataSource
  ){}

  async deposit(depositDto: DepositDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //commit
      const { fullName, mobile, amount } = depositDto;
      const user = await this.userService.createUser({fullName, mobile});
      const userData = await queryRunner.manager.findOneBy(User, {id: user.id});
      const newBalance = userData.balance + amount;
      await queryRunner.manager.update(User, {id: user.id}, {balance: newBalance});
      await queryRunner.manager.insert(Wallet, {
        amount,
        type: WalletType.Deposit,
        invoice_number: Date.now().toString(),
        userId: user.id
      });
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      //rollback
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
    return {
      message: "Payment was successful!"
    }
  }

  async paymentByWallet(withdrawDto: WithdrawDto) {
    const {productId, userId} = withdrawDto;
    const product = ProductList.find(product => product.id === productId);
    if(!product) throw new NotFoundException("Product Not Found!");
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneBy(User, {id: userId});
      if(!user) throw new NotFoundException("User Not Found!");
      if(product.price > user.balance) throw new BadRequestException("User balance is not enough!");
      const newBalance = user.balance - product.price;
      await queryRunner.manager.update(User, {id: userId}, {balance: newBalance});
      await queryRunner.manager.insert(Wallet, {
        amount: product.price,
        userId,
        reason: "Buying Product" + product.name,
        productId,
        invoice_number: Date.now().toString(),
        type: WalletType.Withdraw
      })
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      if(error?.statusCode) {
        throw new HttpException(error.message, error?.statusCode);
      }
      throw new BadRequestException(error?.message);
    }
    return {
      message: "Payment Order Done successfully!"
    }
  }
}
