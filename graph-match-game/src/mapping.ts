import { TokenMinted } from '../generated/MemoryToken/MemoryToken'
import { MyMemoryToken, Player, MyMemoryTokenMeta,Token } from '../generated/schema'
import {  BigInt } from '@graphprotocol/graph-ts'

let ONE = BigInt.fromI32(1)


export function handleNewMemoryToken(event: TokenMinted): void {
  let id = (event.params.from).toString().concat(event.params.tokenURI.toString())

  let tokenMinted = new MyMemoryToken(id)
  tokenMinted.from = event.params.from
  tokenMinted.tokenURI = event.params.tokenURI

  let player = Player.load(event.params.from.toString())
  let token = Token.load(event.params.tokenURI.toString())

  if (player != null) {
    player.totalCountTokens = player.totalCountTokens.plus(ONE)
  } else {
    player = new Player(event.params.from.toString())
    player.totalCountTokens = ONE
    let tokenMeta = MyMemoryTokenMeta.load(ONE.toString())

    if (tokenMeta == null) {
      tokenMeta = new MyMemoryTokenMeta(ONE.toString())
      tokenMeta.totalPlayerCount = ONE
    } else {
      tokenMeta.totalPlayerCount = tokenMeta.totalPlayerCount.plus(ONE)
    }
    tokenMeta.save()

    if (token != null)
      token.totalCountPlayers = token.totalCountPlayers.plus(ONE)
  }

  if(token == null)
  {
    token = new Token(tokenMinted.tokenURI.toString())
    token.totalCountPlayers = ONE
    token.howManyFound = ONE
  }
  else{
    token.howManyFound = token.howManyFound.plus(ONE)
  }

  token.tokenURI = tokenMinted.tokenURI;
  player.from = event.params.from
  player.save()
  token.save()
  // token.save()

  tokenMinted.token = token.id
  tokenMinted.player = player.id
  tokenMinted.save()

}

