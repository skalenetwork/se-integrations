from TransactionFactory import TransactionFactory


import logging

logger = logging.getLogger(__name__)

factory = TransactionFactory()

factory.get_transaction_ops("Transaction").transaction_load()
