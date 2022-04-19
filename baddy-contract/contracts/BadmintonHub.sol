//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;
// imagine a big integer counter that the whole world could share 


contract badmintonHub {

    address chairperson;
    uint public Available_Racquets;
    uint public myBalance;
    uint counter;

    enum states {OnSale, Sold} // 0: Available for Sale, 1: Sold

    struct racquet {
        uint id;
        uint price;
        uint age;
        uint exchanges;

        states status; // 0: Available for Sale, 1: Sold
        address seller;
        address buyer;   
    }

    address[] public Allracquets;  
    mapping (address=>uint) membership;
    mapping (address=>racquet) public racquets;
    mapping (address=>uint) public balances;


    function getbal(address adr) public view returns(uint){

        return balances[adr];

    }

    // modifiers or rules
    modifier onlyChairperson{ 
        require(msg.sender == chairperson);
        _;
    }
    modifier onlyMember{ 
        require(membership[msg.sender] == 1);
        _;
    }

    constructor () payable{
        Available_Racquets = 0;
        counter = 0;
        balances[msg.sender] = address(this).balance;
        // myBalance = address(this).balance;
    }

    function register ( ) public payable { 
        address memberA = msg.sender;
        membership[memberA] = 1;
        // balances[memberA] = msg.value;
        // myBalance = address(this).balance;
        balances[msg.sender] = address(msg.sender).balance;
    }


    function sellRequest (address id, uint price, uint age) onlyMember public {

        bool exists = false;
        for (uint i = 0; i < Allracquets.length; i++) {
            if (id == Allracquets[i]) {
                //ID already exists.
                exists = true;

                // SELL_rule-1: Only Sold product can be put on resale.
                require (racquets[id].status == states.Sold, "Product is already on Sale.");
                
                // SELL_rule-2: Only previous buyer can sell the product.
                require (racquets[id].buyer == msg.sender, "Only product holder can sell the product.");

                // SELL_rule-3: Age of product cannot be lower than previous age.
                require (racquets[id].age <= age, "Product age cannot be lower than previous age.");
                break;
            }
        }

        // Create New racquet if doesn't exist
        if (exists == false) {
            racquets[id].id = counter;
            counter += 1;
            Allracquets.push(id);
            Available_Racquets += 1;
        }

        // Update racquet information
        racquets[id].price = price;
        racquets[id].age = age;
        racquets[id].status = states.OnSale;//0: On Sale
        racquets[id].seller = msg.sender;
    } 


    function buyRequest (address id) onlyMember payable external { 

        address seller = racquets[id].seller;
        address payable wallet = payable(seller);

        // BUY_rule-1: Seller must be a member
        // require (membership[wallet] == 1, "Seller not a member.");

        // BUY_rule-2: Only On Sale product can be bought.
        //require (racquets[id].status == states.OnSale, "Product is not on Sale.");
        
        address buyer = msg.sender;
        uint amount = racquets[id].price;
        uint newamount = amount * 1000000000000000000;

        // Transfer Amount from buyer to Seller
        wallet.transfer(newamount);
        balances[buyer] -= newamount;
        balances[wallet] -= newamount;

        Available_Racquets -= 1;
        racquets[id].status = states.Sold;//1: Sold
        racquets[id].exchanges += 1;
        racquets[id].buyer = buyer;
    }

    function get_LowCostRacquet() view public returns (address) {
        address minPrice_racquet = address(0);
        uint minPrice = 10000000000;

        for (uint i = 0; i < Allracquets.length; i++) {
            if (racquets[Allracquets[i]].status == states.Sold) {
                continue;
            }
            if (racquets[Allracquets[i]].price < minPrice) {
                minPrice = racquets[Allracquets[i]].price;
                minPrice_racquet = Allracquets[i];
            }
        }
        return minPrice_racquet;
    }

    function get_LowAgeRacquet() view public returns (address) {
        address minAge_racquet = address(0);
        uint minAge = 10000000000;

        for (uint i = 0; i < Allracquets.length; i++) {
            if (racquets[Allracquets[i]].status == states.Sold) {
                continue;
            }
            if (racquets[Allracquets[i]].age < minAge) {
                minAge = racquets[Allracquets[i]].age;
                minAge_racquet = Allracquets[i];
            }
        }
        return minAge_racquet;
    }
}