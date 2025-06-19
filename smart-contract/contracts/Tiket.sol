// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Tiket {
    address public owner;
    uint256 public tokenIdCounter = 0; 
    uint256 public ticketTypeCounter = 0;

    struct TicketType {
        string name;
        uint256 price;
        uint256 total;
        uint256 sold;
        string uri; //ipfs data meta url
    }

    struct TicketNft {
        address owner;
        uint256 typeId;
    }

    mapping(uint256 => TicketType) public ticketTypes;
    mapping (uint256 => TicketNft) public ticketNft;
    mapping(address => uint256[]) public ownedTickets;

    event Withdraw(address _user, uint256 amount);
    event AddTicket(string name, uint256 price, uint256 total, uint256 sold, string uri);

    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addTicket(string memory name, uint256 price, uint256 total, string memory uri) external onlyOwner {
        ticketTypes[ticketTypeCounter] = TicketType(name, price, total, 0, uri);

        emit AddTicket(name, price, total, 0, uri);
        
        ticketTypeCounter++;
    }

    function buyTiket(uint256 ticketId) external payable {
        require(ticketId < ticketTypeCounter, "Ticket not found");
        
        TicketType storage t = ticketTypes[ticketId];
        require(t.sold < t.total, "Tickets sold out");
        require(msg.value >= t.price, "Less money");

        ticketNft[tokenIdCounter] = TicketNft(msg.sender, ticketId);
        ownedTickets[msg.sender].push(tokenIdCounter);

        t.sold++;
        
        unchecked {
            tokenIdCounter++;
        }
    }   

    function getMyTickets() external view returns(uint256[] memory) {
        return ownedTickets[msg.sender];
    }

    function getAllTickets() external view returns (TicketType[] memory) {
        TicketType[] memory allTickets = new TicketType[](ticketTypeCounter);
        for (uint256 i = 0; i < ticketTypeCounter; i++) {
            allTickets[i] = ticketTypes[i];
        }

        return allTickets;
    }

    function withdraw(uint256 _amount) external onlyOwner() {
        require(_amount <= address(this).balance, "Inssufficient contract balance");

        (bool success, ) = owner.call{ value: _amount }("");

        require(success, "Withdraw failed");
        emit Withdraw(owner, _amount);
    }
}