from TransactionCreator import TransactionCreator


class TransactionFactory:
    def get_transaction_ops(self, type):
        if type == 'Transaction':
            return TransactionCreator()
        else:
            raise ValueError(format)
