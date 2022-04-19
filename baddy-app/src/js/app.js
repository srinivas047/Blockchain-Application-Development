App = {
	web3Provider: null,
  contracts: {},
  url: 'http://127.0.0.1:7545',
  network_id:3, // 5777 for local
  index:0,
  margin:10,
  left:15,
  init: function() {
    return App.initWeb3();
},

// Initiating Web3
initWeb3: function() {    
    console.log("Initiating Web3 Provider")     
	if (window.ethereum){
		web3 = new Web3(web3.currentProvider);
		try {
		  //Request account access
		window.ethereum.request({ method: "eth_requestAccounts" });
		} catch (error) {
		  // User denied account access...
		  console.error("User denied account access");
		}
		App.web3Provider = web3.currentProvider;
	  }
	  // Legacy dapp browsers...
	  else if (window.web3) {
		App.web3Provider = window.web3.currentProvider;
	  }
	  // if no injected web3 instance is detected, fall back to Ganache
	  else {
		App.web3Provider = new Web3.providers.HttpProvider(App.url);
	  }
	  web3 = new Web3(App.web3Provider);
	  return App.initContract();  
},

// Initiating Contract
initContract: function() { 
	$.getJSON('badmintonHub.json', function(data) {
		// Get the necessary contract artifact file and instantiate it with truffle-contract
		var badmintonArtifact = data;
		App.contracts.baddy = TruffleContract(badmintonArtifact);
	
		// Set the provider for our contract
		App.contracts.baddy.setProvider(web3.currentProvider);	 

		console.log("Initiating Web3 contracts")
		console.log(App.contracts.baddy)
	  });

    return App.bindEvents();
},  

// Binding User Events
bindEvents: function() {  

    $(document).on('click', '#register', function(){
      App.handleRegister();
    });

	$(document).on('click', '#user_balance', function(){
		App.handleuserbal();
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

    $(document).on('click', '#buyrequest',function(){
      App.handlebuy(jQuery('#buyadress').val());
    });

    $(document).on('click', '#sellrequest', function(){
		var id = jQuery('#ID').val()
		var price = jQuery('#price').val()
		var age = jQuery('#months').val()
      App.handlesell(id, price, age);
    });
    
},

// User Registration
handleRegister:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.baddy.deployed().then(function(instance) {
	registerInstance = instance;
    return registerInstance.register({from: account});
    }).then(function(result, err){
		if(result){
            if(result.receipt.status == true)
            jQuery('#register_success').text("Hello, you are registered Successfully, your adrress is : " + account)
        }  
	});
});
},

// User Balance
handleuserbal:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.baddy.deployed().then(function(instance) {
	registerInstance = instance;
    return registerInstance.balances(account, {from: account});
    }).then(function(result, err){
		if(result){
            jQuery('#getbal').text("Your Current Balance is : " + (result/10**18).toString() + " Eth")
        }  
	});
});
},

handlesell:function(id, price, age){
    if (id===''){
		alert("Please enter a valid ID.")
		return false
	  }
	  if (price===''){
		alert("Please enter a valid Price.")
		return false
	  }
	  if (age===''){
		alert("Please enter a valid Age.")
		return false
	  }

	  const id1 = "0x"+id.toString(16);
	  var sellInstance;


	  web3.eth.getAccounts(function(error, accounts) {
	  var account = accounts[0];
	  App.contracts.baddy.deployed().then(function(instance) {
		var sellInstance;
	  sellInstance = instance;
	  return sellInstance.sellRequest(id1, price, age, {from: account}).then((result)=>{
		jQuery('#successfullsell').empty().append("<i> Success !!, You have sold the Racket : </i>")  
	  })
  });
  });

  
  },


// Available Rackets
handleGet:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.baddy.deployed().then(function(instance) {
	registerInstance = instance;
	registerInstance.Available_Racquets({from: account}).then((result)=>{
		jQuery('#getitems').empty().append("<i >Total Available Rackets : " + result.toString() +  "</i>")
	})
});
});
},

// Low Price Items
handlelowprice:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.baddy.deployed().then(function(instance) {
	registerInstance = instance;
	registerInstance.get_LowCostRacquet({from: account}).then((r)=>{
		registerInstance.racquets(r.toString(), {from: account}).then((result)=>{
		jQuery('#getlowprice').empty().append("<i > Racket Details : </i>" + "<br\>" + "<i>ID : "+ r.toString() +"</i>" + "<br\>" + "<i>Price : "+ result.price.toString() + " Eth" + "<br\>" + "<i>Age : "+ result.age.toString() + " Month(s)"+ "</i>");
	})
});
});
});
},

// Low Age Items
handlelowage:function(){
	var registerInstance;
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.baddy.deployed().then(function(instance) {
	registerInstance = instance;
	registerInstance.get_LowAgeRacquet({from: account}).then((r)=>{
		registerInstance.racquets(r.toString(), {from: account}).then((result)=>{
		jQuery('#getlowage').empty().append("<i > Racket Details : </i>" + "<br\>" + "<i> ID : "+ r.toString() +"</i>" + "<br\>" +  "<i>Price : "+ result.price.toString() + " Eth" + "<br\>" + "<i>Age : "+ result.age.toString() + " Month(s)"+ "</i>");
	})
});
});
});                            
},

// Buy Items
handlebuy:function(adress){
    if (adress===''){
      alert("Please Enter an ID.")
      return false
	}
	
    web3.eth.getAccounts(function(error, accounts) {
    App.contracts.baddy.deployed().then(function(instance) {
	
    web3.eth.getAccounts(function(error, accounts) {
    var account = accounts[0];

    App.contracts.baddy.deployed().then(function(instance) {
	var registerInstance;
	registerInstance = instance;
	registerInstance.racquets(adress.toString(), {from: account}).then((result)=>{
	var price;
	price = result.price.toString()
	var finalprice = price

	registerInstance.buyRequest(adress, {from: account, value: web3.utils.toWei(finalprice.toString(), "ether")}).then((r)=>{
		web3.eth.getAccounts(function(error, accounts) {
			var account = accounts[0];
			App.contracts.baddy.deployed().then(function(instance) {
				registerInstance = instance;
				registerInstance.balances(account,{from: account}).then((result)=>{
					jQuery('#successfullbuy').append("<i> Success !!, Your remaining balance is: " + (result/10**18).toString()+ " ETH" + " </i>")
				});
	})
})

	})
})
})
})   
}) 
}) 
},

// Sell Items

}

$(function() {
  $(window).load(function() {
    App.init();
  });

});

