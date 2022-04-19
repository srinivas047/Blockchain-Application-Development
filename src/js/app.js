App = {
  web3: null,
  contracts: {},
  address:'0x2f83902839B64644cab0F707780aB6A9A8F37d87',
  network_id:3, // 5777 for local
  seller:null,
//   buyer:'0xc4033C62AB9394D300C67209358aa6bd125691ab',
  current_address: null,
  value:1000000000000000000,
  index:0,
  margin:10,
  left:15,
  init: function() {
    console.log("Initiating Web3 Provider")
    return App.initWeb3();
  },

  initWeb3: function() {    
    console.log("Initiating Web3 Provider")     
    if (typeof web3 !== 'undefined') {
      console.log("Initiating Web3 Provider")
      App.web3 = new Web3(Web3.givenProvider);
    } else {
      console.log("Initiating Web3 Url")
      App.web3 = new Web3(App.url);
    }
    ethereum.enable();    

	
	App.web3.eth.getGasPrice().then((result) => {
		var gas_price = App.web3.utils.fromWei(result, 'ether');
		console.log("gas price is: ",gas_price);
	  })
	// App.web3.eth.getAccounts().then(function(accounts){
	// 	var account = accounts[0]
	// 	App.current_address = account
	// });
    App.populateAddress();   
    return App.initContract();  
  },

  initContract: function() { 

	// const tx = {
	// 	from: walletAddress,
	// 	to: contractAddress,
	// 	gas: 4700000,
	// 	gasPrice: 20000000000,
	// 	data: encodedABI,
	//   };

    App.contracts.Counter = new App.web3.eth.Contract(App.abi,App.address, {});
    console.log("Initiating contracts")

	App.web3.eth.getGasPrice().then((result) => {
		var gas_price = App.web3.utils.fromWei(result, 'ether');
		console.log("gas price is: ",gas_price);
	  })
    // console.log(random) 
    return App.bindEvents();
  },  

  bindEvents: function() {  
    // $(document).on('click', '#initilaizeCounter', function(){
    //    App.handleInitialization(jQuery('#Initialize').val());
    // });

    $(document).on('click', '#register', function(){
      App.handleRegister();
    });

    $(document).on('click', '#available_items', function(){
      App.handleGet();
    });

	$(document).on('click', '#lowprice', function(){
		App.handlelowprice();
	  });

	$(document).on('click', '#lowage', function(){
		App.handlelowage();
	  });

    $(document).on('click', '#buyrequest',async function(){
    //   App.handlebuy(jQuery('#buyadress').val());

	loopNums();
	async function loopNums() {
		const accounts = await App.web3.eth.getAccounts();
		console.log(accounts[0])
		var	finalprice = 1;
		let response;
		response = await App.contracts.Counter.methods.buyRequest(jQuery('#buyadress').val()).send({  //would return a boolean value
			from: accounts[0],
			value: finalprice * 10 **18   //this is the amount entered in the front-end application
		});
	  }
	});

	// addFunds = async = () => {
	// 	const accounts = await App.web3.eth.getAccounts();
	// 	var	finalprice = 1;
	// 	let response;
	// 	response = await App.contracts.Counter.methods.balances(jQuery('#buyadress').val()).send({  //would return a boolean value
	// 		from: accounts[0],
	// 		value: finalprice * 10 **18   //this is the amount entered in the front-end application
	// 	});
	// };

    // });

	// $(document).on('click', '#buyrequest',function(){
	// 	App.handlegetbalance(jQuery('#buyadress').val());
	//   });

    $(document).on('click', '#sellrequest', function(){

		var id = jQuery('#ID').val()
		var price = jQuery('#price').val()
		var adress = jQuery('#months').val()
      App.handlesell(id, price, adress);
    });
    
  },

  populateAddress : function(){  
    App.handler=App.web3.givenProvider.selectedAddress;
  },  

  handleRegister:function(){
    App.web3.eth.getAccounts().then(function(accounts){
      var account = accounts[0]
      var option={from:account} 
      App.contracts.Counter.methods.register()
    .send(option)
    .on('receipt',(receipt)=>{

		jQuery('#register_success').text("Hello, you are registered Successfully, your adrress is : " + account)
    
    });
  });
  },

  handleGet:function(){
	App.contracts.Counter.methods.Available_Racquets()
    .call()
    .then((r)=>{
	console.log(r)
      jQuery('#getitems').text("Total Available Items : " + r)
    })
  },

  handlelowprice:function(){
	App.contracts.Counter.methods.get_LowCostRacquet()
    .call()
    .then((r)=>{
		console.log(r)
		App.contracts.Counter.methods.racquets(r).call(
			function(err, result){
				if(!err){
					var price = result.price
					console.log(result)
					jQuery('#getlowprice').empty().append("<i > Item Details : </i>" + "<br\>" + "<i>ID : "+ r +"</i>" + "<br\>" + "<i>Price : "+ price + " Wei" + "</i>");
				}
			});
      
    })
  },

  handlelowage:function(){
	// console.log(App.contracts.Counter.methods)
	App.contracts.Counter.methods.get_LowAgeRacquet()
    .call()
    .then((r)=>{
		console.log(r)
		App.contracts.Counter.methods.racquets(r).call(
			function(err, result){
				if(!err){
					var age = result.age
					jQuery('#getlowage').empty().append("<i > Item Details : </i>" + "<br\>" + "<i>ID : "+ r +"</i>" + "<br\>" + "<i>Age : "+ age + " Month(s)" + "</i>");
				}
			});
    })                               
  },

//   handlebuy: async function(adress){
//     if (adress===''){
//       alert("Please enter a valid decrementing value.")
//       return false
//     }

// 	// jQuery('#getlowage').append("<i > Item Details : </i>" 

// 	App.web3.eth.getAccounts().then(function(accounts){
// 		var account = accounts[0]
// 		var option={from:account} 
// 		console.log(account)
	
// 	App.contracts.Counter.methods.balances(account).call(
// 		function(err, result){
// 			jQuery('#successfullbuy').empty().append("<i id ='test'> User Balance Before Buying: " + result+ " Wei" + " </i>")
// 		})

// 	var	finalprice = 1;
//     await App.contracts.Counter.methods.buyRequest(adress)
//     .send({from: account, value: finalprice * 10 ** 18})
//     .on('receipt',(receipt)=>{
//       console.log(receipt)
//       if(receipt.status){
// 		App.contracts.Counter.methods.balances(account).call(
// 			function(err, result){
// 				jQuery('#test').append( "<br\>" + "<i > User Balance After Buying : " + result+ " Wei" + " </i>")
// 			})
//         toastr.success("Counter is decremented by " + adress);
//     }});
// });
  
//   },

  handlesell:function(id, price, adress){
	  console.log(price)
    if (id===''){
		alert("Please enter a valid incrementing value.")
		return false
	  }
	  if (price===''){
		alert("Please enter a valid incrementing value.")
		return false
	  }
	  if (adress===''){
		alert("Please enter a valid incrementing value.")
		return false
	  }
  
	  App.web3.eth.getAccounts().then(function(accounts){
		  var account = accounts[0]
		  var option={from:account} 
		  App.seller = account
		  App.contracts.Counter.methods.sellRequest(id, price, adress) 
		  .send(option)
		  .on('receipt',(receipt)=>{
		  if(receipt.status){
			  toastr.success("Counter is incremented by " + incrementValue);
		  }});

		});
  },
 
abi:[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "id",
				"type": "address"
			}
		],
		"name": "buyRequest",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "register",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "id",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			}
		],
		"name": "sellRequest",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "Allracquets",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Available_Racquets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "get_LowAgeRacquet",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "get_LowCostRacquet",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "myBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "racquets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "exchanges",
				"type": "uint256"
			},
			{
				"internalType": "enum badmintonHub.states",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

}
$(function() {
  $(window).load(function() {
    App.init();
  });

});
