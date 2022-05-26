import {TokenMinted,TransferSingle,TokenUsed} from '../generated/Shack15NFTToken/Shack15NFTToken'
import { MyShack15NFTToken } from '../generated/schema'
import {  BigInt } from '@graphprotocol/graph-ts'

let ONE = BigInt.fromI32(1)
let ZERO = BigInt.fromI32(0)


export function handleNewShack15NFTToken(event: TokenMinted): void {
  let id = (event.params.from.toHex()+"-"+ event.params.tokenId.toString());

  let tokenMinted = new MyShack15NFTToken(id)
  tokenMinted.from = event.params.from
  tokenMinted.type = event.params.nfttype
  tokenMinted.tokenURI = event.params.tokenURI
  tokenMinted.amount = event.params.amount
  tokenMinted.used = ZERO;
  tokenMinted.save()

}

export function handleTransferShack15NFTToken(event: TransferSingle): void {

  let old_id = (event.params.from.toHex()+"-"+ event.params.id.toString());
  let new_id = event.params.to.toHex() + "-" + event.params.id.toString();

  let tokenMinted = MyShack15NFTToken.load(old_id)
  let tokenTransfered = MyShack15NFTToken.load(new_id)
  if(tokenTransfered==null) {
    let tokenTransfered = new MyShack15NFTToken(new_id)
    tokenTransfered.from = event.params.to
    tokenTransfered.amount = event.params.value
    tokenTransfered.used = ZERO;
    tokenTransfered.type = 2
    if (tokenMinted) {
      tokenTransfered.tokenURI = tokenMinted.tokenURI
    }
    tokenTransfered.save()
  }
  else
  {
    tokenTransfered.amount = tokenTransfered.amount.plus(event.params.value)
    if (tokenMinted) {
      tokenTransfered.tokenURI = tokenMinted.tokenURI
    }
    tokenTransfered.save()
  }
  if (tokenMinted) {
    tokenMinted.amount = tokenMinted.amount.minus(ONE)
    tokenMinted.save()
  }
}

  export function handleLockShack15NFTToken(event: TokenUsed): void {
    let id = event.params.from.toHex() + "-" + event.params.tokenId.toString();

    let tokenMinted = MyShack15NFTToken.load(id)
    if (tokenMinted != null) {
      tokenMinted.amount = tokenMinted.amount.minus(ONE)
      tokenMinted.used = tokenMinted.used.plus(ONE)
      tokenMinted.save()
    }
  }

