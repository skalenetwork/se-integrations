from abc import ABC, abstractmethod
import csv
import json

from config import CSV_SOURCE,JSON_SOURCE,ETH_PRIVATE_KEY,JSON_FINISHED,OLD_ADDRESS,\
    NEW_ADDRESS,ENDPOINT, COVEY_ABI_FILEPATH,COVEY_NEW_ABI_FILEPATH
from datetime import datetime

from skale.utils.web3_utils import to_checksum_address
from skale.utils.helper import init_default_logger, get_abi

from web3 import Web3

import logging

logger = logging.getLogger(__name__)
now = datetime.now()
init_default_logger()

w3 = Web3(Web3.HTTPProvider(ENDPOINT))
manager_abi = get_abi(COVEY_ABI_FILEPATH)
manager_new_abi = get_abi(COVEY_NEW_ABI_FILEPATH)


class MainCreator(ABC):

    @abstractmethod
    def parameters(self, tx, contract_id, cont_address, contract_function_name, contract_parameters,
                   implementation_address):
        pass

    def transaction_load(self) -> bool:
        old_cont_address= OLD_ADDRESS
        cont_address = NEW_ADDRESS
        cont_name = "CoveyLedger"
        logger.info(f'Loading Transactions,  address {cont_address}')
        jsonArrayFailed = []
        jsonArrayHash = []
        try:
            d3 = self.get_response()
            if len(d3) > 0:
                for tx in d3:
                    tx_to = tx["to_address_hash"]
                    print("tx to:",tx_to)
                    if old_cont_address.lower() in tx_to.lower():
                        print('Loading ', tx_to)
                        block_num = tx["block_number"]
                        tx_from = tx["from_address_hash"]
                        tx_hash_old = tx["hash"]
                        print("tx_old", tx_hash_old)

                        txtime = datetime.strptime(tx["timestamp"], '%Y-%m-%d %H:%M:%S')
                        print("timestamp =",tx["timestamp"]," - - ", txtime)
                        # tx_ts = datetime.timestamp(txtime)
                        tx_ts = (txtime - datetime(1970, 1, 1)).total_seconds()
                        print(tx_ts)
                        milliseconds = int(round(tx_ts * 1000))
                        print("Integer timestamp in milliseconds: ",
                              milliseconds)
                        print("timestamp =", milliseconds)

                        logger.info(f'extracting block number.. {block_num} , {tx_from} , {milliseconds}')
                        checksum_address = to_checksum_address(cont_address)
                        mkr_contract = w3.eth.contract(checksum_address)
                        mkr_contract.abi = manager_abi
                        params = {}
                        try:
                            input = tx['input']
                            func, params = mkr_contract.decode_function_input(input)
                            func_name = func.fn_name

                            logger.info(f'function name {func_name}')
                        except Exception as err:
                            logger.warning(f'No function found for this ABI input, for hash :{tx["hash"]} error: {err} input :{input}')
                        try:
                            json_param = json.dumps(params)
                            if len(json_param) <= 1000:
                                json_dump_param = params["content"]
                                logger.info(f'arguments {params["content"]}')
                                new_contract = w3.eth.contract(checksum_address, abi=manager_new_abi)

                                w3.eth.default_account = w3.eth.account.privateKeyToAccount(ETH_PRIVATE_KEY)
                                logger.info(f'default account {w3.eth.default_account.address }')
                                txn = new_contract.functions.createContent(json_dump_param,
                                                                           to_checksum_address(tx_from),
                                                                           milliseconds,
                                                                           tx_hash_old).buildTransaction()
                                txn.update({ 'nonce' : w3.eth.getTransactionCount(w3.eth.default_account.address) })

                                signed = w3.eth.account.signTransaction(txn, ETH_PRIVATE_KEY)
                                tx_hash = w3.eth.sendRawTransaction(signed.rawTransaction)

                                receipt = w3.eth.waitForTransactionReceipt(tx_hash)

                                jsonobj = {"old":tx_hash_old, "new" : receipt["transactionHash"].hex() }
                                jsonArrayHash.append(jsonobj)
                                jsonStringHash = json.dumps(jsonArrayHash)
                                jsonFileHash = open(f'{JSON_FINISHED}', "wt")
                                jsonFileHash.write(jsonStringHash)
                                jsonFileHash.close()
                                logger.info(f'loaded {jsonobj}')
                        except Exception as err:
                            logger.error('whats happening', tx_hash_old, err)
                            jsonArrayFailed.append(tx)
                            jsonString = json.dumps(jsonArrayFailed)
                            jsonFile = open(f'{JSON_SOURCE}', "wt")
                            jsonFile.write(jsonString)
                            jsonFile.close()
        except Exception as err:
            logger.error(f'Execution Failed {err}')
            return False
        logger.info(f'Completed loading contract name {cont_name} and address {cont_address} ')
        return True

    def get_response(self):
        jsonArray = []

        with open(f'{CSV_SOURCE}', encoding='utf-8') as csvf:
            csvReader = csv.DictReader(csvf)
            for row in csvReader:
                jsonArray.append(row)

        d3 = json.loads(json.dumps(jsonArray, indent=4))

        return d3
