import { getCustomRepository, getRepository } from 'typeorm';
import Category from '../models/Category';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    category,
    value,
    type,
  }: RequestDTO): Promise<Transaction> {
    const transactionRepo = getCustomRepository(TransactionsRepository);
    const categoryRepo = getRepository(Category);

    const transactionsBalance = await transactionRepo.getBalance();

    if (type === 'outcome' && value > transactionsBalance.total) {
      throw new AppError(
        'Transação impossível de ser feita: sem saldo o suficiente',
        400,
      );
    }

    // saber se já existe uma categoria
    const categoryExist = await categoryRepo.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryExist) {
      const newCategory = categoryRepo.create({
        title: category,
      });

      await categoryRepo.save(newCategory);

      const createdTransaction = transactionRepo.create({
        title,
        value,
        type,
        category_id: newCategory.id,
      });

      await transactionRepo.save(createdTransaction);

      return createdTransaction;
    }
    const createdTransaction = transactionRepo.create({
      title,
      value,
      type,
      category_id: categoryExist.id,
    });

    await transactionRepo.save(createdTransaction);

    return createdTransaction;
  }
}

export default CreateTransactionService;
