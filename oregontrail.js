var fm = require("./formatting.js");
var karma = require("./karma.js");

function OregonTrail(bot, discordroom){
	var gameActive = false;
	var gameStarted = false;
	var user;
	var crew = [];
	this.input = function(discorddata) {
		var t = discorddata.text;
		t = t.toLowerCase().trim();
		if (t == "join") {
			if (gameActive == false) {
				var p = discorddata.author;
				p = "<@" + p.id + ">";
				if (!user) {
					user = discorddata.author;
					bot.postMessage(discorddata.channel, "Welcome to the trail " + p + " [**" + karma.get(p) + "**mIps]\nType **START** when your ready to leave!");
					gameActive = true;
				}
			}
			else {
				var p = discorddata.author;
				p = "<@" + p.id + ">";
				if ("<@" + user.id + ">" != p) {
					if (!crew.find(f => "<@" + f.id + ">" != p)) {
						crew.push(discorddata.author);
						bot.postMessage(discorddata.channel, "Welcome to the trail " + p + " [**" + karma.get(p) + "**mIps]\nYou will be riding along with " + user);
					}
				}
			}
			return;
		}
		else if (t == "start" && !gameStarted && gameActive) {
			gameStarted = true;
			firstPrompt();
		}
		else if (user) {
			var p = discorddata.author;
			p = "<@" + p.id + ">";
			if ("<@" + user.id + ">" == p) {
				msgBuffer.push(discorddata);
			}
		}
	};
	function sendMessage(msg) {
		if (msg.length) {
			bot.channels.get(discordroom).send(msg);
		}
	}
	var msgBuffer = [];
	function awaitInput(inputs) {
		return new Promise((resolve, reject) => {
			function checkBuffer() {
				var b = "";
				if (inputs == "*") {
					if (msgBuffer.length) {
						resolve(msgBuffer[msgBuffer.length - 1].text);
						msgBuffer = [];
						return;
					}
					setTimeout(checkBuffer, 1000);
					return;
				}
				inputs.forEach(i => {
					if (msgBuffer.find(mb => mb.text.toLowerCase() == i.toLowerCase())) {
						b = i;
					}
				});
				if (b.length) {
					msgBuffer = [];
					resolve(b);
				}
				else {
					setTimeout(checkBuffer, 1000);
				}
			}
			setTimeout(checkBuffer, 1000);
		});
	}
	function awaitNumber() {
		return new Promise((resolve, reject) => {
			function checkBuffer() {
				var b;
				msgBuffer.forEach(mb => {
					var n = parseInt(mb.text);
					if (!isNaN(n)) {
						b = n;
					}
				});
				if (!isNaN(b)) {
					msgBuffer = [];
					resolve(b);
				}
				else {
					setTimeout(checkBuffer, 1000);
				}
			}
			setTimeout(checkBuffer, 1000);
		});
	}
	var version = "0.3.0";
	sendMessage("OREGON TRAIL version no " + version + "\n\n");
	sendMessage("\n\nupdated May 2018");

	function getRandomInt(min,max){
		return Math.floor(Math.random() * (max - min +1))+ min;  //keep
	}
	function saveHighScore(scoreobj) {
		highScores.push(scoreobj);
		fm.writeFile("oregontrailhighscores.json", highScores, function() {});
	}
	var highScores = [];
	fm.readFile("oregontrailhighscores.json", function(data) {
		if (data) {
			highScores = data;
		}
		sendMessage("THESE SAVVY ADVENTURERS HAVE SAFELY ARRIVED IN OREGON CITY!\n\n");
		displayScores();
	});
	
	function displayScores(){
		if(highScores.length == 0) {
			sendMessage("No one has conquered the trail yet!  Be the first name on the list!!! \n\n");

			return;
		}
		else {
			var msg = "";
			highScores.sort((a,b) => b.score - a.score);
			for(i = 0; i < highScores.length; i++){
				var highScore = highScores[i];
				msg += highScore["date"] + " --- " + highScore["name"] + " scoring " + highScore["score"] + " points!\n";
			}
			sendMessage(msg);
		}
	}

	function saveGrave(grave) {
		tombStones.push(grave);
		fm.writeFile("oregontrailgraves.json", tombStones, function() {});
	}
	var tombStones = [];
	fm.readFile("oregontrailgraves.json", function(data) {
		if (data) {
			tombStones = data;
		}
		tombStones = tombStones.reverse();

		sendMessage("THESE ARE THE MOST RECENT TRAVELERS TO PERISH ON THE TRAIL\n***[R.I.P.]***\n");
		displayGraves();
	});

	
	function displayGraves(){
		var rowsMinusOne = console.screen_rows - 4;
		var ct = 0;
		var msg = "";
		for(i = 0; i < tombStones.length && i < 10; i++){
			var tombStone = tombStones[i];
			msg += tombStone["date"] + "**" + tombStone["name"] + "** " + tombStone["cause"] + ", " + tombStone["score"] + " miles\n--" + tombStone["engraving"] + "\n";
			
		}
		sendMessage(msg);

	}




	function Score(){
	    return totalMileage + animalsAMT + foodAMT + clothingAMT + supplyAMT;  //do not erase
	}




	var yesNo = "";
	var choiceShootingExptLvl = 0;
	var animalsAMT = 0;
	var foodAMT = 0;
	var ammoAMT = 0;
	var clothingAMT = 0;
	var supplyAMT = 0;
	var flagForFortOption = 0;
	var cashInitialPurchase = 0; 
	var totalMileage = 0;
	var turnNumber = 0;
	var woundedFlag = 0;
	var southPassFlag = 0;
	var blueMountainPassFlag = 0;
	var mileSouthPassFlag = 0;
	var actionChoice = 0;
	var choiceEat = 0;
	var bangResponse = 0;
	var blizzardFlag = 0;
	var notEnoughClothes = 0;
	var fortAMT = 0;
	var eventNo = 0;
	var tacticChoice = 0;
	var riderHostilityFactor = 0;
	var deadFlag = 0;
	var illnessFlag = 0;
	var causeOfDeath = "";
	var outOfAmmoToggle = false;


	
	
//log(eventNo.toSource());
	function firstPrompt() {
		sendMessage("DO YOU NEED INSTRUCTIONS (YES/NO)");
		awaitInput(["yes", "no", "y", "n"])
		.then(res => {
			yesNo = res;
			yesNo = yesNo.toUpperCase();
			if(yesNo[0] == "Y") {
				instructions();
			}
			rifleSkills();	
		});
		
	}

	function instructions() {
	// ***INSTRUCTIONS***
		sendMessage("THIS PROGRAM SIMULATES A TRIP OVER THE OREGON TRAIL FROM\n" +
			"INDEPENDENCE MISSOURI TO OREGON CITY, OREGON IN 1847.\n" +
			"YOUR FAMILY OF FIVE WILL COVER THE 2040 MILE OREGONTRAIL\n" +
			"IN 5-6 MONTHS --- IF YOU MAKE IT ALIVE.\n" +
			"YOU HAD SAVED $900 TO SPEND FOR THE TRIP, AND YOU'VE JUST PAID $200 FOR A WAGON.\n" +
			"YOU WILL NEED TO SPEND THE REST OF YOUR MONEY ($700) ON THE FOLLOWING ITEMS:\n\n");
		sendMessage("```\nOXEN *** YOU CAN SPEND $200-$300 ON YOUR TEAM. THE MORE YOU SPEND, THE FASTER YOU'LL GO, BECAUSE YOU'LL HAVE BETTER ANIMALS\n\n" +
			"FOOD *** THE MORE YOU HAVE, THE LESS CHANCE THERE IS OF GETTING SICK\n\n" +
			"AMMUNITION *** $1 BUYS A BELT OF 50 BULLETS. YOU WILL NEED BULLETS FOR ATTACKS BY ANIMALS AND BANDITS, AND FOR HUNTING FOOD\n\n" +
			"CLOTHING *** THIS IS ESPECIALLY IMPORTANT FOR THE COLD WEATHER YOU WILL ENCOUNTER WHEN CROSSING THE MOUNTAINS\n\n" +
			"MISCELLANEOUS SUPPLIES *** THIS INCLUDES MEDICINE AND OTHER THINGS YOU WILL NEED FOR SICKNESS AND EMERGENCY REPAIRS\n```");
		sendMessage("YOU CAN SPEND ALL YOUR MONEY BEFORE YOU START YOUR TRIP - OR YOU CAN SAVE SOME OF YOUR CASH TO SPEND AT FORTS ALONG THE WAY WHEN YOU RUN LOW.\n" +
			"HOWEVER, ITEMS COST MORE AT THE FORTS. YOU CAN ALSO GO HUNTING ALONG THE WAY TO GET MORE FOOD.\n" +
			"WHENEVER YOU HAVE TO USE YOUR TRUSTY RIFLE ALONG THE WAY, YOU WILL BE TOLD TO TYPE IN A WORD (ONE THAT SOUNDS LIKE A GUN SHOT).\n" +
			"THE FASTER YOU TYPE IN THAT WORD AND SEND, THE BETTER LUCK YOU'LL HAVE WITH YOUR GUN.\n" +
			"AT EACH TURN, ALL ITEMS ARE SHOWN IN DOLLAR AMOUNTS, EXCEPT BULLETS.\n" +
			"WHEN ASKED TO ENTER MONEY AMOUNTS, DON'T USE A **$**.\n" +
			"GOOD LUCK!!!\n\n");
	}
	function rifleSkills() {
		 sendMessage("HOW GOOD A SHOT ARE YOU WITH YOUR RIFLE?\n" +
		 	"```\n(1) ACE MARKSMAN,\n(2) GOOD SHOT,\n(3) FAIR TO MIDDLIN'\n"+ 
		 	"(4) NEED MORE PRACTICE,\n(5) SHAKY KNEES\n```\n" + 
		 	"ENTER ONE OF THE ABOVE, THE BETTER YOU CLAIM YOU ARE, THE FASTER YOU'LL HAVE TO BE WITH YOUR GUN TO BE SUCCESSFUL.");
		 awaitInput(["1", "2", "3", "4", "5"])
		 .then(res => {
		 	choiceShootingExptLvl = parseInt(res);
			if(1 > choiceShootingExptLvl || choiceShootingExptLvl > 5) {
				sendMessage("[Invalid Selection]");
				rifleSkills();
				return;
			}
			initialPurchase();
		 });
	}
	function getAnimals() {
		return new Promise((resolve, reject) => {
			sendMessage("HOW MUCH DO YOU WANT TO SPEND ON YOUR OXEN TEAM\n`Min: 201, Max: 299`");
			awaitNumber()
			.then(res => {
				animalsAMT = res;
				if(animalsAMT <= 200){
					sendMessage("NOT ENOUGH");
					reject();
					return;
				}
				else if(animalsAMT >= 300) {
					sendMessage("TOO MUCH");
					reject();
					return;
				}
				resolve();
			});
		});
	}
	function getFood() {
		return new Promise((resolve, reject) => {
			sendMessage("HOW MUCH DO YOU WANT TO SPEND ON FOOD?\n`Min: 1, Max: None`");
			awaitNumber()
			.then(res => {
				console.log(res)
				foodAMT = res;
				if (foodAMT <= 0) { 
					sendMessage("IMPOSSIBLE");
					reject();
					return;
				}
				console.log("FoodAmt", foodAMT)
				resolve();
			});
		});
		
	}
	function getAmmo() {
		return new Promise((resolve, reject) => {
			sendMessage("HOW MUCH DO YOU WANT TO SPEND ON AMMUNITION?\n`Min: 1, Max: None`");
			awaitNumber()
			.then(res => {
				ammoAMT = res;
				if (ammoAMT <= 0) { 
					sendMessage("IMPOSSIBLE");
					reject();
					return;
				}	
				resolve();
			});
		});
	}
	function getClothing(){
		return new Promise((resolve, reject) => {
			sendMessage("HOW MUCH DO YOU WANT TO SPEND ON CLOTHING\n`Min: 1, Max: None`");
			awaitNumber()
			.then(res => {
				clothingAMT = res;
				if (clothingAMT <= 0) { 
					sendMessage("IMPOSSIBLE");
					reject();
					return;
				}	
				resolve();
			});
		});
	}
	function getSupplies() {
		return new Promise((resolve, reject) => {
			sendMessage("HOW MUCH DO YOU WANT TO SPEND ON MISCELLANEOUS SUPPLIES\n`Min: 1, Max: None`");
			awaitNumber()
			.then(res => {
				supplyAMT = res;
				if (supplyAMT <= 0) { 
					sendMessage("IMPOSSIBLE");
					reject();
					return;
				}
				resolve();
			});
		});
	}
	function initialPurchase() {
		outOfAmmoToggle = false;
		flagForFortOption = flagForFortOption * -1;  // WTF IS THIS? -- switch from true to false whether or not you have to go to the fort
		woundedFlag=illnessFlag=southPassFlag=blueMountainPassFlag=M=mileSouthPassFlag=turnNumber=totalMileage=turnNumber=eventNo=0;  // WTF IS THISg removed as its probably some legacy basic code for clearing memory in old cpus
		anotherPurchase();

	}
	function anotherPurchase() {
		//console.crlf();
		getAnimals()
		.then(() => getFood())
		.then(() => getAmmo())
		.then(() => getClothing())
		.then(() => getSupplies())
		.then(() => calculateCosts())
		.catch(() => {
			setTimeout(function() {
				initialPurchase();
			}, 10);
		});
	}
	function calculateCosts() {
		cashInitialPurchase = 700 - animalsAMT - foodAMT - ammoAMT - clothingAMT - supplyAMT;
		if(cashInitialPurchase <= 0) {
			sendMessage("YOU OVERSPENT! \r\nYOU ONLY HAD $700 TO SPEND. BUY AGAIN");
			initialPurchase();
			return;
		}
		else {
			ammoAMT *= 50;
			sendMessage("AFTER ALL YOUR PURCHASES, YOU NOW HAVE " + cashInitialPurchase + "  DOLLARS LEFT");
			firstTurn();
		}
	}
	function inventoryCheck() {
		if(foodAMT <= 0) { 
			foodAMT=0;
		}
		if(ammoAMT <= 0) {
			ammoAMT=0;
		} 
		//clearIllness();
		if(clothingAMT <= 0) {  // if there is no clothing then there is no clothing
			clothingAMT = 0;
		} 	
		if(supplyAMT <= 0) {
			supplyAMT=0;
		} 
		if(foodAMT <= 13) {
			sendMessage("YOU'D BETTER DO SOME HUNTING OR BUY FOOD AND SOON!!!!\r\n\r\n");
		}
		foodAMT = parseInt(foodAMT);
		ammoAMT = parseInt(ammoAMT);
		clothingAMT = parseInt(clothingAMT);
		supplyAMT = parseInt(supplyAMT);
		cashInitialPurchase = parseInt(cashInitialPurchase);
		totalMileage = parseInt(totalMileage);
		prevMileage = totalMileage; // WTF IS THIS} decemberSixth();
		//sendMessage("end inventory check");
	}
	function doctorVisit() {
		
		if(cashInitialPurchase - 20 > 0) {
			cashInitialPurchase = cashInitialPurchase - 20;
			sendMessage("'Let's get you stitched up.'\n**DOCTOR'S BILL IS $20**");
			clearIllness();
		}
		else {
			cantAffordDoctor();
		}
	}
	function turnStart(){
		inventoryCheck();
		//sendMessage("\r\nTurn " + turnNumber + " Start.\r\nIllness Flag = " + illnessFlag + "\r\nWounded Flag = " + woundedFlag + "\r\n\1bActual Mileage = " + totalMileage + "\r\nSouth Pass Flag normal[mile] = " + southPassFlag + "/" + mileSouthPassFlag + "\r\n");
		if(illnessFlag == 1 || woundedFlag == 1) {  //are you sick?
			doctorVisit();

		}
		if (illnessFlag != 1 && woundedFlag != 1) {
			southPassFlagCheck();	
		}
		
	}
	function firstTurn() {
		turnNumber = 0;
		sendMessage("MONDAY MARCH 29 1847");
		turnStart();
	}
	function turnCheck() {

		if(totalMileage <= 2040) { 
		 	// ***SETTING DATE****
			turnNumber++;  //advances turn
			var msg = "";
			msg += "MONDAY ";
			if(turnNumber == 1) {
				msg += "APRIL 12 ";
			}
			if(turnNumber == 2) {
				msg += "APRIL 26 ";
			}
			if(turnNumber == 3) {
				msg += "MAY 10 ";
			}
			if(turnNumber == 4) {
				msg += "MAY 24 ";
			}
			if(turnNumber == 5) {
				msg += "JUNE 7 ";
			}
			if(turnNumber == 6) {
				msg += "JUNE 21 ";
			}
			if(turnNumber == 7) {
				msg += "JULY 5 ";
			}
			if(turnNumber == 8) {
				msg += "JULY 19 ";
			}
			if(turnNumber == 9) {
				msg += "AUGUST 2 ";
			}
			if(turnNumber == 10) {
				msg += "AUGUST 16 ";
			}
			if(turnNumber == 11) {
				msg += "AUGUST 31 ";
			}
			if(turnNumber == 12) {
				msg += "SEPTEMBER 13 ";
			}
			if(turnNumber == 13) {
				msg += "SEPTEMBER 27 ";
			}
			if(turnNumber == 14) {
				msg += "OCTOBER 11 ";
			}
			if(turnNumber == 15) {
				msg += "OCTOBER 25 ";
			}
			if(turnNumber == 16) {
				msg += "NOVEMBER 8 ";
			}
			if(turnNumber == 17) {
				msg += "NOVEMBER 22 ";
			}
			if(turnNumber == 18) {
				msg += "DECEMBER 6 ";
			}
			if(turnNumber == 19) {
				msg += "DECEMBER 20 ";
			}
			if(turnNumber == 20) {
		 		sendMessage(msg + "\nYOU HAVE BEEN ON THE TRAIL TOO LONG  ------ \n" +
		 			"YOUR FAMILY DIES IN THE FIRST BLIZZARD OF WINTER");
		 		causeOfDeath = "got too tired";
		 		formalities();
	            return; //this might be okay since it should exit the function after the end of the game, maybe take out
	            
	        }

	        sendMessage(msg + " 1847\n");
	        turnStart();
	    }
	    else {
	    	finalTurn();
	    }
	}
	function cantAffordDoctor() {
		cashInitialPurchase = 0;
		sendMessage("YOU CAN'T AFFORD A DOCTOR");
		youDiedOf();
	}				
	function clearIllness() {
		woundedFlag = 0;
		illnessFlag = 0;
	}
	function turnChoice() {
		sendMessage("```\nFOOD: " + foodAMT + ", BULLETS: " + ammoAMT + ", CLOTHING: " + clothingAMT + ", MISC. SUPP.: " + supplyAMT + ", CASH: " + cashInitialPurchase+ "\n```");
		if(flagForFortOption != -1) {
			flagForFortOption = flagForFortOption * -1; 
			fortHuntContinue();
		}
	}
	function southPassFlagCheck(){
		//sendMessage("south pass flag check");
		if(mileSouthPassFlag != 1) {
			sendMessage("TOTAL MILEAGE IS : " + totalMileage);
			turnChoice();
		}
		else {
			sendMessage("TOTAL MILEAGE IS " + totalMileage + "\nYou are traveling through mountains");
			mileSouthPassFlag = 0;
			turnChoice();
		} 
	}
	function fortHuntContinue(){
		sendMessage("DO YOU WANT TO: `(1) STOP AT THE NEXT FORT`, `(2) HUNT`, OR `(3) CONTINUE` ?");
		awaitNumber()
		.then(res => {
			actionChoice = res;
			if (actionChoice == 1) {
				fortBuy();
			}	
			else if (actionChoice == 2) {
				if (ammoAMT < 39){
					sendMessage("TOUGH---YOU NEED MORE BULLETS TO GO HUNTING");
					fortHuntContinue();
				}
				else {
					goHunting();
				}
			}
			else if (actionChoice == 3) {
				checkFoodAMT();
			} 
			else {
				sendMessage("[Invalid Selection]");
				fortHuntContinue();
			}
		});
		
	}
	function fortBuy(){
		sendMessage("ENTER WHAT YOU WISH TO SPEND ON THE FOLLOWING\r\n");

		//setFortAmtSubroutine();
		foodFortCycle()
		.then(() => ammoFortCycle())
		.then(() => clothingFortCycle())
		.then(() => supplyFortCycle())
		.then(() => {
			totalMileage = totalMileage-45;
			checkFoodAMT();	
		})
		.catch(() => {
			setTimeout(function() {
				fortBuy();
			}, 10);
		});
		
	}

	function foodFortCycle(){
		return new Promise((resolve, reject) => {
			fortAMT = 0;
			sendMessage("FOOD");

			if(cashInitialPurchase > 0) { 
				showSupplies();
				sendMessage("You have $" + cashInitialPurchase + " remaining\r\n");
				//showSupplies();
				awaitNumber()
				.then(res => {
					fortAMT = res;
					if(fortAMT > cashInitialPurchase) {
						sendMessage("YOU DON'T HAVE THAT MUCH--KEEP YOUR SPENDING DOWN\r\n");
						reject();
						return;
					}
					else {
						cashInitialPurchase = cashInitialPurchase - fortAMT;
						foodAMT = parseInt(foodAMT + (0.667 * fortAMT));
						fortAMT = 0;
						//showSupplies();
						resolve();
					}
				});
			} 
			else {
				sendMessage("You don't have any money left");
				resolve();
			}
		});
	}
	function ammoFortCycle(){
		return new Promise((resolve, reject) => {
			sendMessage("AMMUNITION");
			fortAMT = 0;
			if(cashInitialPurchase > 0) { 
				showSupplies();
				sendMessage("You have $" + cashInitialPurchase + " remaining\n");
				//showSupplies();
				awaitNumber()
				.then(res => {
					fortAMT = res;
					if(fortAMT > cashInitialPurchase) {
						sendMessage("YOU DON'T HAVE THAT MUCH--KEEP YOUR SPENDING DOWN\r\n");
						reject();
					}
					else {
						cashInitialPurchase = cashInitialPurchase - fortAMT;
						ammoAMT=parseInt(ammoAMT + (0.667 * fortAMT * 50));
						fortAMT = 0;
						resolve();
						//showSupplies();
					}
				});
			} 
			else {
				sendMessage("You don't have any money left");
				resolve();
			}
		});
	}
	function clothingFortCycle(){
		return new Promise((resolve, reject) => {
			sendMessage("CLOTHING");
			fortAMT = 0;
			if(cashInitialPurchase > 0) { 
				showSupplies();
				sendMessage("You have $" + cashInitialPurchase + " remaining\r\n");
				//showSupplies();
				awaitNumber()
				.then(res => {
					fortAMT = res;
					if(fortAMT > cashInitialPurchase) {
						sendMessage("YOU DON'T HAVE THAT MUCH--KEEP YOUR SPENDING DOWN\r\n");
						reject();
					}
					else {
						cashInitialPurchase = cashInitialPurchase - fortAMT;
						clothingAMT = parseInt(clothingAMT + (0.667 * fortAMT));
						fortAMT = 0;
						resolve();
					}
				});

			} 
			else {
				sendMessage("You don't have any money left");
				resolve();
			}		
		});
	}
	function supplyFortCycle(){
		return new Promise((resolve, reject) =>{
			sendMessage("MISCELLANEOUS SUPPLIES");
			fortAMT = 0;
			if(cashInitialPurchase > 0) { 
				showSupplies();
				sendMessage("You have $" + cashInitialPurchase + " remaining\r\n");
				//showSupplies();
				awaitNumber()
				.then(res => {
					fortAMT = res;
					if(fortAMT > cashInitialPurchase) {
						sendMessage("YOU DON'T HAVE THAT MUCH--KEEP YOUR SPENDING DOWN\r\n");
						reject();
					}
					else {
						cashInitialPurchase = cashInitialPurchase - fortAMT;
						supplyAMT = parseInt(supplyAMT + (.667 * fortAMT));
						fortAMT = 0;
						//showSupplies();
						resolve();
					}
				});
			}
			else {
				sendMessage("You don't have any money left");
				resolve();
			}
		});
	}


	function goHunting() {
		if(ammoAMT < 39) {
			sendMessage("TOUGH---YOU NEED MORE BULLETS TO GO HUNTING");
			fortHuntContinue();
		} 
		else {
			totalMileage = totalMileage - 45;
			shootingSub()
			.then(() => {
				sendMessage("bangResponse time " + bangResponse);
				if(bangResponse >= 1) {
					var randomMeasure =  1000 * Math.random();
					//sendMessage("" + randomMeasure + " : random " + 3*bangResponse + " adj bang response");
					if(randomMeasure > 3 * bangResponse) {
						sendMessage("NICE SHOT!!!  RIGHT ON TARGET\nGOOD EATIN' TONIGHT!!\n RIGHT BETWEEN THE EYES \n---YOU GOT A BIG ONE!!!!\nFULL BELLIES TONIGHT!");
						foodAMT = foodAMT + 52 + Math.random() * 6;
						ammoAMT = ammoAMT - 10 - 3 * bangResponse;
						//checkFoodAMT();
					}
					else {
						sendMessage("YOU MISSED..........AND YOUR DINNER GOT AWAY.....");
						ammoAMT = ammoAMT - 10 - Math.random() * 4;
					}
				}
				checkFoodAMT();
			});
		}
	}

	function shootingSub() {
		return new Promise((resolve, reject) => {
			var variationsOfShootingWord = [];
			variationsOfShootingWord[0] = "BANG";
			variationsOfShootingWord[1] = "BLAM";
			variationsOfShootingWord[2] = "POW";
			variationsOfShootingWord[3] = "WHAM";
			var shootingWordSelector = parseInt(getRandomInt(0,3));
			sendMessage("TYPE **" + variationsOfShootingWord[shootingWordSelector] + "**");
			bangClockStart = new Date().getTime();
			//sendMessage("bangClockStart time " + bangClockStart);
			awaitInput([variationsOfShootingWord[shootingWordSelector], "bang", "blam", "pow", "wham"])
			.then(res => {
				function bangResponseCheck() {
					bangResponse = (((bangResponse - bangClockStart) / 1000) * 36) - (choiceShootingExptLvl - 1);

					if(bangResponse < 0) {
				 		bangResponse = 0;
					} 
					if(userBangWord != variationsOfShootingWord[shootingWordSelector]) {
						bangResponse = 0;
						misfire();
						resolve();
					}
					else {
						resolve();
					}
				}
				userBangWord = res;
				bangResponse = new Date().getTime();
				userBangWord = userBangWord.toUpperCase();
				//sendMessage("bangResponse time " + bangResponse);
				bangResponseCheck();
			});
		});
		
	}
	function misfire() {
		var misfirePhrase = [];
		misfirePhrase[0]="You hit a rock";
		misfirePhrase[1]="You completely miss your target, but almost kill your favorite sheep.";
		misfirePhrase[2]="Looks like you forgot to take the safety off";
		misfirePhrase[3]="Who taught you to shoot? Plaxico Burress?";
		var misfirePhraseSelector = parseInt(getRandomInt(0,misfirePhrase.length - 1));
		sendMessage(misfirePhrase[misfirePhraseSelector]);
	}

	function checkFoodAMT(){
		//sendMessage("checkFoodAMT function");
		if(foodAMT <= 13) {
			starve();
			return;  //this should be okay 
		} 
		else {
			eatChoice();

		}
	}
	function eatChoice(){
		sendMessage("DO YOU WANT TO EAT `(1) POORLY`, `(2) MODERATELY`, OR `(3) WELL` ?");
		awaitNumber()
		.then(res => {
			choiceEat = res;
			if(foodAMT -8 - 5 < 0) {
				starve();
			}
			else if(choiceEat > 3 || choiceEat < 1) {
				sendMessage("YOU CAN'T EAT THAT WELL");
				eatChoice();
			}	
			else { 
				foodAMT = foodAMT - 8 - (5 * choiceEat);
				totalMileage = totalMileage + 200 + ((animalsAMT - 220) / 5) + (10 * Math.random());
				blizzardFlag = 0;
				notEnoughClothes = 0;
				riders();
			}
		});
	}

	function actionEvaluate()  {
		sendMessage("\r\nDO YOU WANT TO (1) HUNT, OR (2) CONTINUE");
		actionChoice = console.getnum();
		if(actionChoice == 1) {
			goHunting();
		}
		if(actionChoice == 2){
			checkFoodAMT();
			fortBuy();
		} 
	}
	function riders() {
		//sendMessage("riders function beginning");
		if (Math.random() * 10 < ((Math.pow(totalMileage/100-4),27)+72)/(((Math.pow(totalMileage/100-4),2)+12)-1) ){
			//sendMessage("math selected event selector");
			eventSelector();
		}
		else {
			var msg = "";
			msg += "RIDERS AHEAD.  THEY ";
			riderHostilityFactor = 0;
			if(Math.random() < 0.8) {
				msg += "DON'T ";
				riderHostilityFactor = 1;
			}
			sendMessage(msg + "LOOK HOSTILE");

			if(Math.random() > 0.2) {
				riderHostilityFactor = 1 - riderHostilityFactor;
			}

			tacticChoice = 0;

			function getTactics(callback) {
				riderTatics()
				.then(() => callback())
				.catch(() => getTactics(callback));
			}
			getTactics(() => {
				if(riderHostilityFactor == 1) {
					milesAfterRiders();
				}
				else {
					if(tacticChoice == 1) { // 3110
						totalMileage = totalMileage + 20;
						supplyAMT = supplyAMT - 15;
						ammoAMT = ammoAMT - 150;
						animalsAMT = animalsAMT - 40;
						riderHostilityCheck();
					}
					if(tacticChoice == 2) { // attackCycle();
						shootingSub()
						.then(() => {
							//sendMessage(bangResponse + " : BANG RESPONSE (multiply times 4 subtract 40 ammo amt)");

							ammoAMT = ammoAMT - bangResponse * 4 - 40;
							attackRiders();	
						});
						
						
					}
					if(tacticChoice == 3) {
						fortAMT = 0;
						milesAfterRiders();
					}
					if(tacticChoice == 4) {
						if(Math.random() > 0.8) { 
							ridersNoAttack();
						}
						else {
							ammoAMT = ammoAMT - 150;
							supplyAMT = supplyAMT - 15;

							shootingSub()
							.then(() => {
								ammoAMT = ammoAMT - bangResponse * 30 - 80;
								totalMileage = totalMileage - 25;
								attackRiders();	
							});
							
						}
					}
				}
			});

			
		}
	}

	function riderTatics() {
		return new Promise((resolve, reject) => {
			sendMessage("TACTICS\n`(1) RUN`, `(2) ATTACK`, `(3) CONTINUE`, or `(4) CIRCLE WAGONS` ?");
			awaitNumber()
			.then(res => {
				tacticChoice = res;
				if (tacticChoice < 1 || tacticChoice > 4) {
					reject();
					return;
				}
				resolve();
			});
		});
	}

	function milesAfterRiders() {
		if(tacticChoice == 1) { //RUN milesMinusFive(); 
			totalMileage = totalMileage + 15;
			animalsAMT = animalsAMT - 10;
			riderHostilityCheck();
		}
		if(tacticChoice == 2) { //checkMoney();
			totalMileage = totalMileage - 5;
			ammoAMT = ammoAMT - 100;
			riderHostilityCheck();
		}
		if(tacticChoice == 3) { // milesMinusTwenty();
			riderHostilityCheck();
		} 
		if(tacticChoice == 4) {
			totalMileage = totalMileage - 20;
			riderHostilityCheck();
		}
	}
	function ridersNoAttack() {
		sendMessage("THEY DID NOT ATTACK");
		eventSelector();
	}
	//was friendly.Riders()
	function riderHostilityCheck() { 
		if(riderHostilityFactor != 0) {
			sendMessage("RIDERS WERE FRIENDLY, BUT CHECK FOR POSSIBLE LOSSES");
			eventSelector();
		}
		else {
			sendMessage("RIDERS WERE HOSTILE\n--CHECK FOR LOSSES\n");
			if(ammoAMT <= 0) {
				sendMessage("YOU RAN OUT OF BULLETS AND GOT MASSACRED BY THE RIDERS");
				//nsole.putmsg("ammoAMT var :   " + ammoAMT);
				causeOfDeath = "got massacred";
				formalities();
			}
			else {
				eventSelector();
			}
		}
	}
	//southPassFlagCheck();
	function attackRiders() {
		//sendMessage("\r\nYour BANG RESPONSE was " + bangResponse + "\r\n");
		if(bangResponse <= 40 && bangResponse >= 1) {
			sendMessage("NICE SHOOTING---YOU DROVE THEM OFF");
			eventSelector();
		}
		else { 
			if(bangResponse <= 90 && bangResponse >= 1) {
				sendMessage("KINDA SLOW WITH YOUR COLT .45 --- BUT YOU DROVE THEM OFF");
				eventSelector();
			}
			else {
				sendMessage("LOUSY SHOT---YOU GOT KNIFED\nYOU HAVE TO SEE OL' DOC BLANCHARD");
				woundedFlag = 1;
				riderHostilityFactor = 0;
				eventSelector();
			}
		}
	}	
	function showSupplies() {
		sendMessage("```\nFOOD: " + foodAMT + ", BULLETS: " + ammoAMT + ", CLOTHING: " + clothingAMT + ", MISC. SUPP.: " + supplyAMT + ", CASH: " + cashInitialPurchase+ "\n```");
	}	

	function shotInLeg() { 
		if(bangResponse <= 110 && ammoAMT > 1  && outOfAmmoToggle != true) { 
			quickestDraw();
		}
		else {
			sendMessage("YOU GOT SHOT IN THE LEG AND THEY TOOK ONE OF YOUR OXEN\nBETTER HAVE A DOC LOOK AT YOUR WOUND");
			woundedFlag = 1;
			supplyAMT = supplyAMT - 5;
			animalsAMT = animalsAMT - 20;
			outOfAmmoToggle = false;
			mountains();
		}
	}
	function eventSelector() {
		//sendMessage("event slector function beginning");
		advanceEventCounter();
		secondSwitch();
		//sendMessage("event switch passed");
	}
	function advanceEventCounter() {
		//sendMessage("event prior ")
		//log(eventNo.toSource());
		//sendMessage(eventNo);
		eventNo++;
		//log(eventNo.toSource());
		//sendMessage("event advanced "); 
		//sendMessage(eventNo);
	}
	function secondSwitch() {
		//console.pause();
		//console.clear();
		//ON eventNo-10 continue: 4220,4290,4340,4650,4610,indianFood();
		if(eventNo == 1) {
			sendMessage("WAGON BREAKS DOWN --\nLOSE TIME AND SUPPLIES FIXING IT");
			totalMileage = totalMileage - 15 - (5 * Math.random());
			supplyAMT = supplyAMT - 8;
			mountains();
		}

		if(eventNo == 2) {
			sendMessage("OX INJURES LEG\n---\nSLOWS YOU DOWN REST OF TRIP\n");
			totalMileage = totalMileage - 25;
			animalsAMT = animalsAMT - 20;
			mountains();
		}	 
		if(eventNo == 3) {
			sendMessage("BAD LUCK---YOUR DAUGHTER BROKE HER ARM\nYOU HAD TO STOP AND USE SUPPLIES TO MAKE A SLING");
			totalMileage = totalMileage - 5 - (4 * Math.random());
			supplyAMT = supplyAMT - 2 - (3 * Math.random());
			mountains();
		}	
		if(eventNo == 4) {
			sendMessage("OX WANDERS OFF\n---\nSPEND TIME LOOKING FOR IT");
			totalMileage = totalMileage - 17;
			mountains();
		}
		if(eventNo == 5) {
			sendMessage("YOUR SON GETS LOST\n---\nSPEND HALF THE DAY LOOKING FOR HIM");
			totalMileage = totalMileage - 10;
			mountains();
		}	 
		if(eventNo == 6) {
			sendMessage("UNSAFE WATER\n---\nLOSE TIME LOOKING FOR CLEAN SPRING");
			totalMileage = totalMileage - (10 * Math.random() * -2);
			mountains();
		}

		if(eventNo == 7) {
			if(totalMileage > 950) {
				coldWeather();
			}
			else {
				sendMessage("HEAVY RAINS---TIME AND SUPPLIES LOST");
				foodAMT = foodAMT - 10;
				ammoAMT = ammoAMT - 500;
				supplyAMT = supplyAMT - 15;
				totalMileage = totalMileage - (10 * Math.random()) - 5;
				mountains();
			}
		}
		if(eventNo == 8) {
			sendMessage("BANDITS ATTACK!\nDraw Your Weapon\n");
			shootingSub()
			.then(() => {
				ammoAMT = ammoAMT - (20 * bangResponse);
				sendMessage("BANG RESPONSE = " + bangResponse + "\r\n"); 
				if(bangResponse <= 120  && bangResponse >= 1) { 
					shotInLeg();
				}
				else {
					sendMessage("YOU RAN OUT OF BULLETS---THEY GET LOTS OF CASH");
					cashInitialPurchase = cashInitialPurchase / 3;
					outOfAmmoToggle = true;
					shotInLeg();
				}
			});
		}

		if(eventNo == 9) {
			sendMessage("THERE WAS A FIRE IN YOUR WAGON\n--\n FOOD AND SUPPLIES DAMAGED!");
			foodAMT = foodAMT - 40;
			ammoAMT = ammoAMT - 400;
			supplyAMT = supplyAMT - (Math.random() * 68) - 3;
			totalMileage = totalMileage - 15;
			mountains();
		}
		if(eventNo == 10) {
			sendMessage("LOSE YOUR WAY IN HEAVY FOG\n---\nTIME IS LOST"); 
			totalMileage = totalMileage - 10 - (5 * Math.random());
			mountains();
		}

		if(eventNo == 11) {
			sendMessage("YOU KILLED A POISONOUS SNAKE AFTER IT BIT YOU");
			ammoAMT = ammoAMT - 10;
			supplyAMT = supplyAMT - 5;
			if(supplyAMT <= 0) {
				sendMessage("YOU DIE OF SNAKEBITE SINCE YOU HAVE NO MEDICINE");
				causeOfDeath = "got bit by a snake";
				formalities();
			}
			else {
				mountains();
			}
		}
		if(eventNo == 12) {
			sendMessage("YOUR WAGON GETS SWAMPED FORDING RIVER--LOSE FOOD AND CLOTHES");
			foodAMT = foodAMT - 30;
			clothingAMT = clothingAMT - 20;
			totalMileage = totalMileage - 20 - (20 * Math.random());
			mountains();
		}	 
		if(eventNo == 13) {
			sendMessage("WILD ANIMALS ATTACK!");
			shootingSub()
			.then(() => {
				if(ammoAMT > 39) { 
					wildBangResponse();
				}
				else {
					sendMessage("YOU WERE TOO LOW ON BULLETS--\nTHE WOLVES OVERPOWERED YOU");
					woundedFlag = 1;
					youDiedOf();
					return;
				}
				ammoAMT = ammoAMT - (20 * bangResponse);
				clothingAMT = clothingAMT - (bangResponse * 4);
				foodAMT = foodAMT - (bangResponse * 8);
				mountains();
			});
		}	
		// this one looks like it needs fixing;	
		if(eventNo == 14) {
			if(choiceEat == 1) {
				illnessSubroutine();
			} 
			if(choiceEat == 2) {
				if(Math.random() < 0.25) {
					illnessSubroutine();
				}

				mountains();
				
			}
			if(choiceEat == 3){
				if(Math.random() > 0.5) {
					illnessSubroutine();
					mountains();
				}
				else {
					mountains();
					
				}
			}
		}
		if(eventNo == 15) {
			sendMessage("HELPFUL INDIANS SHOW YOU WHERE TO FIND MORE FOOD");
			foodAMT = foodAMT + 14;
			mountains();
		}
		if (eventNo > 15) {
			mountains();
		}

	}
	// ***MOUNTAINS***
	function mountains()  {
		//console.pause();
		if(totalMileage <= 950) {
			turnCheck();
			return;//this is the sketchiest one it seems to leave in.
		}
		if(Math.random() * 10 < 4) {
			hailStorm();
		}
		sendMessage("\nRUGGED MOUNTAINS \n/^.~/^.~/^.~");
		if(Math.random() < 0.1) {
			totalMileage = totalMileage - 60;
		} //4780
		if(Math.random() < 0.35) {
			slowGoing();
		}
		else {
			sendMessage("YOU GOT LOST\n---\nLOSE VALUABLE TIME TRYING TO FIND TRAIL!");
			totalMileage = totalMileage - 60;
			if (Math.random() * 10 < 3) {
				hailStorm();
				sendMessage("WAGON DAMAGED!\n---\nLOSE TIME AND SUPPLIES");
				supplyAMT = supplyAMT - 5;
				ammoAMT = ammoAMT - 200;
				totalMileage = totalMileage - 20 - (30 * Math.random());
			}
			checkSouthPass();
		}
	}
	function checkSouthPass() {
		if(southPassFlag == 1) { 
			checkMileage17hundred();
		}
		else {
			southPassFlag = 1;
			if(Math.random()<.8) {
				blizzard(); 
			} 
			else {
				sendMessage("YOU MADE IT SAFELY THROUGH SOUTH PASS--NO SNOW");
				checkMileage17hundred();
			}
		}
	}
	function slowGoing() {
		sendMessage("THE GOING GETS SLOW");
		totalMileage = totalMileage - 45 - (Math.random() / 0.02);
		checkSouthPass();
	}
	//this needs to be fixed big time  ALERT ALERT 
	function checkMileage17hundred() { 
		if(totalMileage < 1700) {
			checkMileageNine50();
		}
		else if(blueMountainPassFlag != 1) { 
			checkMileageNine50();
		}
		else {
			blueMountainPassFlag = 1;
			if(Math.random() < 0.7) {
				blizzard();
			}
			else {
				turnCheck();
			}
		}
		
	}

	function checkMileageNine50() {
		if(totalMileage < 950) {
			turnCheck();
		}
		else {
			mileSouthPassFlag = 1;
			turnCheck();
		}
	}
	function blizzard() {
		sendMessage("BLIZZARD IN MOUNTAIN PASS--TIME AND SUPPLIES LOST");
		blizzardFlag = 1;
		foodAMT = foodAMT - 25;
		supplyAMT = supplyAMT - 10;
		ammoAMT = ammoAMT - 300;
		totalMileage = totalMileage - 30 - (40 * Math.random());
		if(clothingAMT < 18 + (2 * Math.random())) {
			illnessSubroutine();
		}
		else {
			checkMileageNine50();
		}
	}
	// ***DYING***
	function starve() {
		sendMessage("YOU RAN OUT OF FOOD AND STARVED TO DEATH");
		causeOfDeath = "starved to death";
		formalities();
	}
	function outOfMedicalSupplies() {
		sendMessage("YOU RAN OUT OF MEDICAL SUPPLIES");
		youDiedOf();
	}
	function youDiedOf() {
		sendMessage("YOU DIED OF ");
		if(woundedFlag == 1) {
			injuries();
		}
		else {
			sendMessage("PNEUMONIA");
			causeOfDeath = "got pneumonia";
			formalities();
		}
	}
	function injuries() {
		sendMessage("INJURIES");
		causeOfDeath = "was injured badly";
		formalities();
	}
	function formalities() {
		sendMessage("DUE TO YOUR UNFORTUNATE SITUATION, THERE ARE A FEW FORMALITIES WE MUST GO THROUGH\n" +
			"WOULD YOU LIKE A MINISTER? `(Y)ES`/`(N)O`");
		awaitInput(["y", "n", "yes", "no"])
		.then(res => {
			sendMessage("WOULD YOU LIKE A FANCY FUNERAL? `(Y)ES`/`(N)O`");		
			return awaitInput(["y", "n", "yes", "no"]);
		})
		.then(res => {
			sendMessage("WOULD YOU LIKE US TO INFORM YOUR NEXT OF KIN? `(Y)ES`/`(N)O`");
			return awaitInput(["y", "n", "yes", "no"]);
		})
		.then(res => {
			yesNo = res; 
			if(yesNo.substr(0, 1).toUpperCase() == "Y") {
				telegraph();
			} 
			else {
				sendMessage("BUT YOUR AUNT SADIE IN ST. LOUIS IS REALLY WORRIED ABOUT YOU");
			 	telegraph();
			}
		});
	}

	function digGrave(){
		sendMessage("What would you like on your tombstone? (79 chars)");
		awaitInput("*")
		.then(res => {
			this.engraving = res;
			this.engraving = this.engraving.substring(0,78);
			this.score = parseInt(totalMileage);
			this.corpseName = user.username;
			this.deathDate = new Date().toDateString();
			this.deathCause = causeOfDeath;
			//console.clear();
			sendMessage("Here lies the rotten corpse of " + this.corpseName +
				"\n ... \n" + this.engraving +
				"\nTraveled " + this.score + " miles before they " + this.deathCause + " and died.");
			var graveObj = {
				"name":this.corpseName,
				"engraving":this.engraving,
				"score":this.score,
				"date":this.deathDate,
				"cause":this.deathCause
			};
			saveGrave(graveObj);

			resetGame();
		});
	}

	function telegraph() {
		sendMessage("THAT WILL BE $4.50 FOR THE TELEGRAPH CHARGE.\n" +
			"WE THANK YOU FOR THIS INFORMATION AND WE ARE SORRY YOU " +
			"DIDN'T MAKE IT TO THE GREAT TERRITORY OF OREGON " +
			"BETTER LUCK NEXT TIME\n" +
			"SINCERELY\n" +
			"THE OREGONCITY CHAMBER OF COMMERCE");
		sendMessage("GAME OVER");
		digGrave();
	}

	function finalMonth(day) {
		if(turnNumber < 93) {
			turnNumber = turnNumber - 93;
			sendMessage(day + "JULY " + turnNumber + " 1847");
		}
		if(93 < turnNumber < 124) {
			turnNumber = turnNumber-124;
			sendMessage(day + "AUGUST " + turnNumber + " 1847");
		}
		if(123 < turnNumber < 155) {
			turnNumber=turnNumber - 155;
			sendMessage(day + "SEPTEMBER " + turnNumber + " 1847");
		}

		if(154 < turnNumber < 185) {
			turnNumber = turnNumber - 185;
			sendMessage(day + "OCTOBER " + turnNumber + " 1847");
		}

		if(184 < turnNumber < 216) {
			turnNumber = turnNumber - 216;
			sendMessage(day + "NOVEMBER " + turnNumber + " 1847");
		}
		if(215 < turnNumber < 246) {
			turnNumber = turnNumber - 246;
			sendMessage(day + "DECEMBER " + turnNumber + "1847");
		}
	}
	// ***FINAL TURN***
	function finalTurn() {
		twoWeekFraction = (2040 - prevMileage) / (totalMileage - prevMileage);
		foodAMT = foodAMT + ((1 - twoWeekFraction) * (8 + 5 * choiceEat));
		sendMessage("YOU FINALLY ARRIVED AT OREGONCITY\n" +
			"AFTER 2040 LONG MILES---HOORAY!!!!!\n" +
			"A REAL PIONEER!");
	 	twoWeekFraction = parseInt(twoWeekFraction * 14);
	    turnNumber = (turnNumber * 14) + twoWeekFraction;
	 	twoWeekFraction = twoWeekFraction + 1;

	 	switch(twoWeekFraction % 7) { 
			case 1 :
				finalMonth("MONDAY ");
				break;
			case 2 :
				finalMonth("TUESDAY ");
				break;
			case 3 :
				finalMonth("WEDNESDAY ");
				break;
			case 4 :
				finalMonth("THURSDAY ");
				break;
			case 5 :
				finalMonth("FRIDAY ");
				break;
			case 6 :
				finalMonth("SATURDAY ");
				break;
			case 0 :
				finalMonth("SUNDAY ");
				break;
		}
		if(ammoAmt < 0) {
			ammoAMT = 0;
		}
		if(clothingAmount < 0) {
			clothingAMT = 0;
		}
		if(supplyAMT < 0) {
			supplyAMT = 0;
		}
		if(cashInitialPurchase < 0) {
			cashInitialPurchase = 0;
		}
		if(foodAMT < 0) {
			foodAMT = 0;
		}
		showSupplies();
	 
		sendMessage("PRESIDENT JAMES K. POLK SENDS YOU HIS HEARTIEST CONGRATULATIONS AND WISHES YOU A PROSERPOUS LIFE AHEAD AT YOUR NEW HOME");
		newHighScore();
	}
	function newHighScore(){
		sendMessage("YOUR NAME HAS BEEN ADDED TO THE HIGH SCORE LIST!!!");
		this.score = Score();
		this.score = this.score * (22 - turnNumber) * (6 - choiceShootingExptLvl);
		sendMessage("Your score was " + this.score);
		this.corpseName = user.username;
		this.deathDate = new Date().toDateString();
		scoreObj = {
			"name": this.corpseName,
			"score": this.score,
			"date":this.deathDate
		};
		saveHighScore(scoreObj);
		resetGame();

	}

	function resetGame() {
		user = null;
		crew = [];
		gameActive = false;
		gameStarted = false;
		msgBuffer = [];
	}

	// ***ILLNESS SUB-ROUTINE***
	function illnessSubroutine() {
		if((100 * Math.random()) < (10 + ((choiceEat - 1) * 35))) {
			sendMessage("MILD ILLNESS\n---\nMEDICINE USED\n");
			totalMileage = totalMileage - 5;
			supplyAMT = supplyAMT - 2;
		}
		else { 
			if((100 * Math.random()) < (100 - (40 / Math.pow(4, (choiceEat-1)) ) ) ) {
				sendMessage("BAD ILLNESS\n---MEDICINE USED");
				totalMileage = totalMileage - 5;
				supplyAMT = supplyAMT - 5;
			}
			else {
				sendMessage("SERIOUS ILLNESS\n---\nYOU MUST STOP FOR MEDICAL ATTENTION");
				supplyAMT = supplyAMT - 10;
				illnessFlag = 1;
			}
		}

		if(supplyAMT < 0) {
			outOfMedicalSupplies();
		}
		else {
			if(blizzardFlag == 1) {
				checkMileageNine50();
			}
			else {
				mountains();
			}
		}
	}


	function hailStorm() { 
		sendMessage("HAIL STORM\n---\nSUPPLIES DAMAGED");
		totalMileage = totalMileage - 5 - (Math.random() * 10);
		ammoAMT = ammoAMT - 200;
		supplyAMT = supplyAMT - Math.random() * 3;
		// mountains();
	}

	function warmEnough() {	
		if(notEnoughClothes != 1) {
			mountains();
		}
		else {
			illnessSubroutine();
		}
	}

	function coldWeather() {
		var msg = "COLD WEATHER ---BRRRRRRR!---YOU ";
		if(clothingAMT < 22 + (4 * Math.random())) {
			notEnoughClothes = 0;
		}
		else {
			msg += "DON'T ";
			notEnoughClothes = 1;

		}
		sendMessage(msg + "HAVE ENOUGH CLOTHING TO KEEP WARM");
		warmEnough();
	}

	function wildBangResponse() {
		if(bangResponse < 45 || bangResponse == 0){
			slowDraw();
		}
		else {
			sendMessage("NICE SHOOTIN' PARDNER---THEY DIDN'T GET MUCH");
		}
	}

	function slowDraw() {
		sendMessage("SLOW ON THE DRAW---THEY GOT AT YOUR FOOD AND CLOTHES");
	}
		

	function quickestDraw() {
		sendMessage("QUICKEST DRAW OUTSIDE OF DODGE CITY!!!");
		sendMessage("YOU GOT 'EM!");
		mountains();
	}

					


				
}

module.exports = {
	OregonTrail: OregonTrail
};
