from TransactionMainCreator import MainCreator
import logging

logger = logging.getLogger(__name__)


class TransactionCreator(MainCreator):

    def parameters(self, tx, contract_id, cont_address, contract_function_name, contract_parameters,
                   implementation_address):
        tx_blockNumber = tx["blockNumber"]
        tx_timeStamp = tx["timeStamp"]
        tx_hash = tx["hash"]
        tx_from = tx["from"]
        tx_to = tx["to"]
        tx_value = tx["value"]
        tx_contractAddress = tx["contractAddress"]
        tx_gas = tx["gas"]
        tx_gasUsed = tx["gasUsed"]
        tx_isError = tx["isError"]

        tx_nonce = tx["nonce"]
        tx_transactionIndex = tx["transactionIndex"]
        tx_gasPrice = tx["gasPrice"]
        tx_txreceipt_status = tx["txreceipt_status"]
        tx_cumulativeGasUsed = tx["cumulativeGasUsed"]
        tx_confirmations = tx["confirmations"]

        return (tx_blockNumber, tx_timeStamp, tx_hash, tx_nonce, tx_transactionIndex
                , tx_from, tx_to, tx_value, tx_gas, tx_gasPrice
                , tx_isError, tx_txreceipt_status, '', tx_contractAddress, tx_cumulativeGasUsed
                , tx_gasUsed, tx_confirmations, contract_id, cont_address, contract_function_name
                , contract_parameters, implementation_address, '', '', ''
                , '')

