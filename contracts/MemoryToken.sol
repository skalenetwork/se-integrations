pragma solidity ^0.6.0;

import "@openzeppelin/contracts/presets/ERC721PresetMinterPauserAutoId.sol";

contract MemoryToken is ERC721PresetMinterPauserAutoId {

    event TokenMinted(address from, string tokenURI);

    uint256 public globalLimit;

    mapping (address => mapping (bytes32 => bool)) private _addressToTokenURI;
    mapping (bytes32 => uint256) private _limitOfTokenURIs;
    mapping (bytes32 => uint256) private _countersOfTokenURIs;

    constructor() 
        ERC721PresetMinterPauserAutoId("SKALE Match", "SKALE_MATCH", "https://demo.skalelabs.com/")
        public
    {
        grantRole(MINTER_ROLE, msg.sender);
        globalLimit = 500;
    }

    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _;
    }

    /**
     * @dev allow minter set a global limit of tokens
     */
    function setGlobalLimit(uint256 _newLimit) public onlyMinter {
        globalLimit = _newLimit;
    }

    /**
     * @dev allow minter set an individual limit for tokenURI
     */
    function setLimitOfTokenURI(string memory _tokenURI, uint256 _newLimit) public onlyMinter {
        _limitOfTokenURIs[keccak256(abi.encodePacked(_tokenURI))] = _newLimit;
    }

    /**
     * @dev allow minter mint token with {_tokenURI}
     */
    function mint(address _to, string memory _tokenURI) public onlyMinter returns(bool) {
        bytes32 tokenURIHash = keccak256(abi.encodePacked(_tokenURI));

        // check is a receiver has token of the tokenURI
        // if receiver has - would raise an error 
        // "Receiver already has this token"
        require(!_addressToTokenURI[_to][tokenURIHash], "Receiver already has this token");

        // check is amount of minted token of this tokenURI
        // less than global limit or individual limit
        // if individual limit exists
        require(
            _limitOfTokenURIs[tokenURIHash] == 0 ?
            _countersOfTokenURIs[tokenURIHash] < globalLimit :
            _countersOfTokenURIs[tokenURIHash] < _limitOfTokenURIs[tokenURIHash],
            "All tokens minted"
        );

        uint _tokenId = totalSupply().add(1);
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        emit TokenMinted(_to, _tokenURI);

        // set that a receiver has token of the tokenURI
        _addressToTokenURI[_to][tokenURIHash] = true;

        // increase counter of minted tokens of this tokenURI
        _countersOfTokenURIs[tokenURIHash] = _countersOfTokenURIs[tokenURIHash].add(1);
        return true;
    }

    /**
     * @dev Return true if {_sender} has token of {_tokenURI}, false - otherwise
     */
    function hasAddressTokenURI(address _sender, string memory _tokenURI) public view returns (bool) {
        return _addressToTokenURI[_sender][keccak256(abi.encodePacked(_tokenURI))];
    }

    /**
     * @dev Return amount of tokens remaining to mint of this {_tokenURI}
     */
    function tokensRemaining(string memory _tokenURI) public view returns (uint256) {
        bytes32 tokenURIHash = keccak256(abi.encodePacked(_tokenURI));
        return _limitOfTokenURIs[tokenURIHash] == 0 ?
            globalLimit - _countersOfTokenURIs[tokenURIHash] :
            _limitOfTokenURIs[tokenURIHash] - _countersOfTokenURIs[tokenURIHash];
    }
}
