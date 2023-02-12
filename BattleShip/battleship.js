var view = {
  

    displayMessage: function(msg){
      var messageArea = document.getElementById("messageArea");
      messageArea.innerHTML = msg
    },

    displayHit: function(location){
      var cell = document.getElementById(location)
      cell.setAttribute ("class", "hit");

    },
    displayMiss: function(location){
      var cell = document.getElementById(location)
      cell.setAttribute ("class", "miss")

    }
};


var model = {

  boardSize: 7,
  numShips: 3,
  shipSunk: 0,
  shipLength: 3,

  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }],

  fire: function(guess) {  
    for(var i= 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var locations = ship.locations;
      var index = locations.indexOf(guess);
      
      if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },
  
  isSunk: function(ship) {
    for(var i = 0; i < this.shipLength; i++){
      if(ship.hits[i] !== "hit"){
        return false;
      }
    }
    return true;
  },
  
  generateShipLocations: function(){
    var locations;
    for(var i =0; i < this.numShips; i++) {
      do{
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
    console.log("Ships array: ");
    console.log(this.ships)
  },
  
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1){
      // Generate a starting location for a horizontal ship
      row =Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
    } else {
      // generate a starting location for a vertical ship
       row =Math.floor(Math.random() *  (this.boardSize - this.shipLength + 1));
       col = Math.floor(Math.random() * this.boardSize);
       
    }
    
    var newShipLocations = [];
    for(var i = 0; i < this.shipLength; i++) {
      if(direction === 1){
        // add locations to array for new horizontal ship
        newShipLocations.push(row + "" + (col + i))
      } else {
        // add location to array for new verical ship
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },
  
  collision: function(locations) {
    for(var i = 0; i< this.numShips; i++) {
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if(ship.locations.indexOf(locations[j]) >= 0) {
          return true
        }
      }
    }
    return false
  },
}
  
  
  
  
  
  
  
var controller = {
  guesses: 0,
  
  processGuess: function(guess) {
    var location = parseGuess(guess);
    if(location) {
      this.guesses++
      var hit = model.fire(location);
      if(hit && 
        model.shipSunk === model.numShips){
          view.displayMessage ("You sank all my battleship, in " + this.guesses + "guesses");
        }
      }
    }
  }
  
  function parseGuess(guess) {
    
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if(guess === null || guess.length !== 2 ) {
      alert("Oops, please enter a letter and a number on the board.");
    } else {
      var firstChar = guess.charAt(0);
      var row = alphabet.indexOf(firstChar)
      var column = guess.charAt(1)
      
      if(isNaN(row) || isNaN(column)) {
        alert("Oops, that isn't on the board.");
      } else if(row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize )  {
        alert("Oops, thats off the board!");
      } else {
        return row + column;
      }
    }
    return null
  }
  
  
  
  function handleFireBUtton(){
    var guessInput = document.getElementById("guessInput");
    
    var guess = guessInput.value.toUpperCase();
    controller.processGuess(guess);
    
    guessInput.value = "";
  }

  function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton")

    e = e || window.event
    if (e.keycode === 13) {
      fireButton.click();
      return false
    }
  }
  window.onload = init
  
  function init() {
    // get the player's guess from the form
    // and get it to the controller.
  
    var fireButton = document.getElementById("fireButton")
    fireButton.onclick = handleFireBUtton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations()
  }

