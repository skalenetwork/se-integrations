import { NewToken, UpdatedToken } from '../generated/MyToken/MyToken'
import { MyToken } from '../generated/schema'

export function handleNewToken(event: NewToken): void {
  let myToken = new MyToken(event.params.id.toHex())
  myToken.owner = event.params.owner
  myToken.tokenValue = event.params.tokenValue
  myToken.save()
}

export function handleUpdatedToken(event: UpdatedToken): void {
  let id = event.params.id.toHex()
  let myToken = MyToken.load(id)
  if (myToken == null) {
    myToken = new MyToken(id)
  }
  myToken.owner = event.params.owner
  myToken.tokenValue = event.params.tokenValue
  myToken.save()
}
