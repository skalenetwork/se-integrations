import json
import requests
from requests.exceptions import HTTPError
from datetime import datetime
from config import ENDPOINT, SCHAIN_ENDPOINT, SCHAIN_PRIVATE_KEY
from web3 import Web3
import logging
logger = logging.getLogger(__name__)
now = datetime.now()
web3 = Web3(Web3.HTTPProvider(ENDPOINT))



def api_link():
    return 'https://api.etherscan.io/api?module=account' \
           '&action=txlist' \
           '&address=0x4d5f2faafaaee5c49428a6ee567f280121c9da85' \
           '&startblock=0' \
           '&endblock=99999999' \
           '&sort=asc&apikey=EY54ZFWWAJTYGBKDYC2PHMABIB8WPRUP86'


def get_response( api_call):
    response = requests.get(api_call)
    response.raise_for_status()
    jsonResponse = response.json()
    d2 = json.loads(json.dumps(jsonResponse))
    d3 = json.loads(json.dumps(d2["result"]))
    return d3



def send_tx(web3, tx_to, amount, tx_from,tx_input,  gas_price=None):
    print(f'Check nonce for {tx_from}' )
    eth_nonce = get_eth_nonce(web3, tx_from)
    print(f'Transaction nonce {eth_nonce}')
    gas_price = gas_price or web3.eth.gasPrice
    print(f'Send transaction gas price: {gas_price}')
    txn = {
        'from': tx_from,
        'to': Web3.toChecksumAddress(tx_to),
        'value': amount,
        'gasPrice': gas_price,
        'nonce': eth_nonce,
        'chainId': 0xfd74e32e5c5b5,
        'data': tx_input
    }
    gas_estimate = web3.eth.estimateGas(txn)
    txn["gas"] = gas_estimate
    signed_txn = web3.eth.account.sign_transaction(txn, SCHAIN_PRIVATE_KEY)
    tx = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    print(
        f'ETH transfer {tx_from} => {tx_to}, {amount} wei,'
        f'tx: {web3.toHex(tx)}'
    )
    return w3.eth.waitForTransactionReceipt(web3.toHex(tx))



def get_eth_nonce(web3, address):
    return web3.eth.getTransactionCount(address)



try:
    api_call = api_link()
    logger.info(f'api_call : {api_call}')
    d3 = get_response(api_call)
    values = []
    ids = set([])
    if len(d3) > 0:
        print(len(d3))
        for tx in d3:
            last_block_num = tx["blockNumber"]
            tx_input = web3.toText(tx["input"])
            tx_from =  tx["from"] #put your own Address
            tx_to =  tx["to"] #put your own Address
            tx_value =tx["value"]
            print("Input for transaction: ", tx_from, tx_to, tx_input)
            tx_from =  Web3.toChecksumAddress('0xc4B8929609AC322648C6C87F0E5978Ea8236b392')
            w3 = Web3(Web3.HTTPProvider(SCHAIN_ENDPOINT))
            receipt = send_tx(w3, tx_to, web3.toHex(web3.toWei("0.001", "ether")), tx_from,tx["input"])
            print(f'tx receipt {receipt}')
    else:
        logger.info(f'No new transactions')
except HTTPError as http_err:
    logger.error(f'Transaction execution failed because of a HTTP error. {http_err}')
except Exception as err:
    logger.error(f'Transaction execution failed. {err}')
logger.info(f'Completed...')
