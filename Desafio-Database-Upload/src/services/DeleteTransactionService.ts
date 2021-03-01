import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionRepo = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepo.findOne(id);

    if (!transaction) throw new AppError('Transaction not found');

    await transactionRepo.remove(transaction);
  }
}

export default DeleteTransactionService;
