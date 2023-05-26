//SPDX-License-Identifier: MIT

pragma solidity >=0.4.24;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "../app/node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {
    // Star data
    struct Star {
        string name;
    }

    // Implement Task 1 Add a name and symbol properties
    // name: Is a short name to your token
    // symbol: Is a short string like 'USD' -> 'American Dollar'
    string private _name;
    string private _symbol;

    constructor() public {
        _name = "Star High Token";
        _symbol = "SHT";
    }

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;

    // Create Star using the Struct
    function createStar(string memory _starName, uint256 _tokenId) public {
        // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_starName); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(_msgSender(), _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(
            ownerOf(_tokenId) == _msgSender(),
            "You can't sell the Star you don't own."
        );
        starsForSale[_tokenId] = _price;
    }

    // Function that allows you to convert an address into a payable address
    function _make_payable(
        address addr
    ) internal pure returns (address payable) {
        return address(uint160(addr));
    }

    function buyStar(uint256 _tokenId) public payable {
        uint256 price = starsForSale[_tokenId];
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        require(msg.value > price, "You need to have enough Ether");

        address ownerAddress = ownerOf(_tokenId);

        safeTransferFrom(ownerAddress, _msgSender(), _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = _make_payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(price);

        if (msg.value > price) {
            _msgSender().transfer(msg.value - price);
        }
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo(
        uint _tokenId
    ) public view returns (string memory) {
        //1. You should return the Star saved in tokenIdToStarInfo mapping
        string memory starName = tokenIdToStarInfo[_tokenId].name;
        require(bytes(starName).length != 0, "Star not found.");

        return starName;
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        address ownerOfTokenId1 = ownerOf(_tokenId1);
        address ownerOfTokenId2 = ownerOf(_tokenId2);
        require(
            _isApprovedOrOwner(_msgSender(), _tokenId1),
            "You can't exchange if you don't own any of the Stars."
        );

        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId2)
        //4. Use _transferFrom function to exchange the tokens.
        transferFrom(ownerOfTokenId1, ownerOfTokenId2, _tokenId1);
        transferFrom(ownerOfTokenId2, ownerOfTokenId1, _tokenId2);
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        // transferFrom() and safeTransferFrom() already require() the msg.sender to be the owner, approved, or operator.

        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        transferFrom(_msgSender(), _to1, _tokenId);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }
}
