pragma solidity >=0.4.21 <0.7.0;
contract MyToken{

    struct Token {
        address owner;
        uint tokenValue;
    }

    Token[] public tokens;

    event NewToken(uint id, address owner, uint tokenValue);
    event UpdatedToken(uint id, address owner, uint tokenValue);
    
    mapping (address => uint) public ownerOfToken;

    function createToken(uint tokenValue) public
    {
        require(ownerOfToken[msg.sender] == 0,"token and value already exist call update instead");
        uint id = tokens.push(Token(msg.sender, tokenValue)) - 1;
        ownerOfToken[msg.sender] = id;
        emit NewToken(id, msg.sender, tokenValue);
    }

    function setTokenValue(uint _tokenValue) public{
        require(msg.sender == tokens[ownerOfToken[msg.sender]].owner,'owner of the token doesnt match the sender');
        uint id = ownerOfToken[msg.sender];
        tokens[id].tokenValue = _tokenValue;
        emit UpdatedToken(id, msg.sender, _tokenValue);
    }

    function getTokenBalance(address owner) public view returns(uint){
        uint id = ownerOfToken[owner];
        return (tokens[id].tokenValue);
    }

    function doesOwnerExist(address owner) public view returns(bool){
        return ownerOfToken[owner] != 0;
    }
}