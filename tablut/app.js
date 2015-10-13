$(function(){
	listenForClicks();
})


var tablut = {
	board: [["edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge"],
	["edge", null, null, null, "B", "B", "B", null, null, null, "edge"],
	["edge", null, null, null, null, "B", null, null, null, null, "edge"],
	["edge", null, null, null, null, "W", null, null, null, null, "edge"],
	["edge", "B", null, null, null, "W", null, null, null, "B", "edge"],
	["edge", "B", "B", "W", "W", "K", "W", "W", "B", "B", "edge"],
	["edge", "B", null, null, null, "W", null, null, null, "B", "edge"],
	["edge", null, null, null, null, "W", null, null, null, null, "edge"],
	["edge", null, null, null, null, "B", null, null, null, null, "edge"],
	["edge", null, null, null, "B", "B", "B", null, null, null, "edge"],
	["edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge", "edge"]],
	homeColor: "B",
	enemyColor: "W",
	pieceSelected: null,
	movingFrom: [null, null],
	moveDirection: null,
	movingTo: {
		row: null,
		column: null
	},
	kingIsAt: {
		row: 5,
		column: 5
	},
	gameOver: false
};


function listenForClicks(){
	$("td").on("click", function(){
		var $element = $(this);
		clickedOn($element);
	})
}


function clickedOn($element){
	if (!tablut.gameOver){
		if (tablut.movingFrom.toString() === ","){
			selectPiece($element);
		} else {
			clickedAfterHighlighting($element);
		}
	}
}


function selectPiece($element){
	tablut.movingFrom[0] = parseInt($element.attr("data-row"));
	tablut.movingFrom[1] = parseInt($element.attr("data-column"));
	if (legalSelection()){
		highlight($element);	
		tablut.pieceSelected = tablut.board[tablut.movingFrom[0]][tablut.movingFrom[1]];
		console.log("Selected " + tablut.pieceSelected + " at " + tablut.movingFrom);
	} else {
		tablut.movingFrom = [null, null];
	}
}


function legalSelection(){
	if (tablut.board[tablut.movingFrom[0]][tablut.movingFrom[1]] === tablut.homeColor) return true;
	if (tablut.board[tablut.movingFrom[0]][tablut.movingFrom[1]] === "K" && tablut.homeColor === "W") return true;
	else return false;
}


function highlight($element){
	$element.toggleClass("highlighted");
}


function unhighlight($element){
	$element.toggleClass("highlighted");
	tablut.movingFrom = [null, null];
}


function clickedAfterHighlighting($element){
	if (identical($element)){
		unhighlight($element);
	} else {
		attemptMove($element);
	}
}


function identical($element){
	if (tablut.movingFrom[0] == parseInt($element.attr("data-row")) && tablut.movingFrom[1] == parseInt($element.attr("data-column"))) {
		return true;
	} 
}


function attemptMove($element){
	tablut.movingTo.row = parseInt($element.attr("data-row"));
	tablut.movingTo.column = parseInt($element.attr("data-column"));
	if (legalMove()){
		movePieceTo($element);
		wipeVacated();
		checkForCaptures();
		checkForWins();
	} else {
		tablut.movingTo.row = null;
		tablut.movingTo.column = null;
		console.log("Illegal move.")
	}
}


function legalMove(){
	if (matchesGridPosition() && available() && noInterveningPieces()){
		return true;
	}
}


function available(){
	if (tablut.board[tablut.movingTo.row][tablut.movingTo.column] === null) return true;
	if (shadyShortMove()) return true;
}




function matchesGridPosition(){
	if (tablut.movingTo.row === tablut.movingFrom[0]){
		tablut.moveDirection = "horizontal";
		return true;
	} else if (tablut.movingTo.column === tablut.movingFrom[1]){
		tablut.moveDirection = "vertical";
		return true;
	}
}


function shadyShortMove(){
	if (leavingShadedSquare() && shortMove()){
		return true;
	}
}

function shortMove() {
	if (tablut.movingTo.row - tablut.movingFrom[0] > 0 && tablut.movingTo.row - tablut.movingFrom[0] < 3) return true;
	if (tablut.movingFrom[0] - tablut.movingTo.row > 0 && tablut.movingFrom[0] - tablut.movingTo.row < 3) return true;
	if (tablut.movingTo.column - tablut.movingFrom[1] > 0 && tablut.movingTo.column - tablut.movingFrom[1] < 3) return true;
	if (tablut.movingFrom[1] - tablut.movingTo.column > 0 && tablut.movingFrom[1] - tablut.movingTo.column < 3) return true;
}


// BELOW SECTION V WET, NEEDS REFACTORING

function noInterveningPieces(){	
	if (tablut.moveDirection === "horizontal"){
		return horizontalMove();
	} else if (tablut.moveDirection === "vertical"){
		return verticalMove();
	}
}


function horizontalMove() {

	var comingFromColumn = tablut.movingFrom[1];
	var goingToColumn = tablut.movingTo.column;

	if (goingToColumn > comingFromColumn){
		for (var i = comingFromColumn + 1; i < goingToColumn; i++){
			var intermediateSquare = tablut.board[tablut.movingFrom[0]][i];
			if (intermediateSquare === "B" || intermediateSquare === "W" || intermediateSquare === "K"){
				console.log("There are intervening pieces.")
				return false;
			}
		}
		return true;

	} else if (comingFromColumn > goingToColumn){
		for (var i = comingFromColumn - 1; i > goingToColumn; i--){
			var intermediateSquare = tablut.board[tablut.movingFrom[0]][i];
			if (intermediateSquare === "B" || intermediateSquare === "W" || intermediateSquare === "K"){
				console.log("There are intervening pieces.")
				return false;
			}
		}
		return true;
	}
}


function verticalMove(){
	
	var comingFromRow = tablut.movingFrom[0];
	var goingToRow = tablut.movingTo.row;

	if (goingToRow > comingFromRow){
		for (var i = comingFromRow + 1; i < goingToRow; i++){
			var intermediateSquare = tablut.board[i][tablut.movingFrom[1]];
			if (intermediateSquare === "B" || intermediateSquare === "W" || intermediateSquare === "K"){
				console.log("There are intervening pieces.")
				return false;
			}
		}
		return true;

	} else if (comingFromRow > goingToRow){
		for (var i = comingFromRow - 1; i > goingToRow; i--){
			var intermediateSquare = tablut.board[i][tablut.movingFrom[1]];
			if (intermediateSquare === "B" || intermediateSquare === "W" || intermediateSquare === "K"){
				console.log("There are intervening pieces.")
				return false;
			}
		}
		return true;
	}
}

// END OF WET CODE


function movePieceTo($element){
	tablut.board[tablut.movingTo.row][tablut.movingTo.column] = tablut.pieceSelected;
	if (tablut.pieceSelected === "K"){
		tablut.kingIsAt.row = tablut.movingTo.row;
		tablut.kingIsAt.column = tablut.movingTo.column;
	}
	if (tablut.pieceSelected === "B"){
		$element.html("<img src='images/black.png'>");
	} else if (tablut.pieceSelected === "W") {
		$element.html("<img src='images/white.png'>");
	} else if (tablut.pieceSelected === "K"){
		$element.html("<img src='images/king.png'>");
	}
	console.log("Moving to: " + tablut.movingTo.row + ", " + tablut.movingTo.column);
}


function checkForCaptures(square){
	lookNorth();
	lookEast();
	lookSouth();
	lookWest();
}

function lookNorth(){
	var arrayPosition = tablut.board[tablut.movingTo.row - 1][tablut.movingTo.column];
	if (arrayPosition === tablut.enemyColor){
		var $square = $("tr:nth-child(" + (tablut.movingTo.row - 1) + ") td:nth-child(" + tablut.movingTo.column + ")");
		var $piece = $("tr:nth-child(" + (tablut.movingTo.row - 1) + ") td:nth-child(" + tablut.movingTo.column + ") > img");
		var nextSquare = tablut.board[tablut.movingTo.row - 2][tablut.movingTo.column];
		if (nextSquare === tablut.homeColor || nextSquare === "shaded"){
			if ($square.hasClass("shaded")){
				tablut.board[tablut.movingTo.row - 1][tablut.movingTo.column] = "shaded";
			}	else {	
				tablut.board[tablut.movingTo.row - 1][tablut.movingTo.column] = null;
			}
			capture($square, $piece);
		}
	} 
}

function lookEast(){
	var arrayPosition = tablut.board[tablut.movingTo.row][tablut.movingTo.column + 1];
	if (arrayPosition === tablut.enemyColor){
		var $square = $("tr:nth-child(" + tablut.movingTo.row + ") td:nth-child(" + (tablut.movingTo.column + 1) + ")");
		var $piece = $("tr:nth-child(" + tablut.movingTo.row + ") td:nth-child(" + (tablut.movingTo.column + 1) + ") > img");
		var nextSquare = tablut.board[tablut.movingTo.row][tablut.movingTo.column + 2];
		if (nextSquare === tablut.homeColor || nextSquare === "shaded"){
			if ($square.hasClass("shaded")){
				tablut.board[tablut.movingTo.row][tablut.movingTo.column + 1] = "shaded";
			} else {
				tablut.board[tablut.movingTo.row][tablut.movingTo.column + 1] = null;
			}
			capture($square, $piece);
		}
	}
}

function lookSouth(){
	var arrayPosition = tablut.board[tablut.movingTo.row + 1][tablut.movingTo.column];
	if (arrayPosition === tablut.enemyColor){
		var $square = $("tr:nth-child(" + (tablut.movingTo.row + 1) + ") td:nth-child(" + tablut.movingTo.column + ")");
		var $piece = $("tr:nth-child(" + (tablut.movingTo.row + 1) + ") td:nth-child(" + tablut.movingTo.column + ") > img");
		var nextSquare = tablut.board[tablut.movingTo.row + 2][tablut.movingTo.column];
		if (nextSquare === tablut.homeColor || nextSquare === "shaded"){
			if ($square.hasClass("shaded")){
				tablut.board[tablut.movingTo.row + 1][tablut.movingTo.column] = "shaded";
			} else {
				tablut.board[tablut.movingTo.row + 1][tablut.movingTo.column] = null;
			}
			capture($square, $piece);
		}
	}
}

function lookWest(){
	var arrayPosition = tablut.board[tablut.movingTo.row][tablut.movingTo.column - 1];
	if (arrayPosition === tablut.enemyColor){
		var $square = $("tr:nth-child(" + tablut.movingTo.row + ") td:nth-child(" + (tablut.movingTo.column - 1) + ")");
		var $piece = $("tr:nth-child(" + tablut.movingTo.row + ") td:nth-child(" + (tablut.movingTo.column - 1) + ") > img");
		var nextSquare = tablut.board[tablut.movingTo.row][tablut.movingTo.column - 2];
		if (nextSquare === tablut.homeColor || nextSquare === "shaded"){
			if ($square.hasClass("shaded")){
				tablut.board[tablut.movingTo.row][tablut.movingTo.column - 1] = "shaded";
			} else {
				tablut.board[tablut.movingTo.row][tablut.movingTo.column - 1] = null;
			}
			capture($square, $piece);
		}
	}
}


function capture($square, $piece){
	$square.toggleClass("red");
	$piece.fadeOut();
	setTimeout(function(){ 
  	$square.toggleClass("red"); 
	}, 400);
}


function wipeVacated(){

	var $leftSquare = $("tr:nth-child(" + tablut.movingFrom[0] + ") td:nth-child(" + tablut.movingFrom[1]);
	$leftSquare.toggleClass("highlighted");
	var $oldImage = $("tr:nth-child(" + tablut.movingFrom[0] + ") td:nth-child(" + tablut.movingFrom[1] + ") > img");
	$oldImage.fadeOut();
	if (leavingShadedSquare() ){
		tablut.board[tablut.movingFrom[0]][tablut.movingFrom[1]] = "shaded";
	} else {
		tablut.board[tablut.movingFrom[0]][tablut.movingFrom[1]] = null;
	}
	tablut.movingFrom = [null, null];
	tablut.pieceSelected = null;
}


function leavingShadedSquare(){
	var shadedSquares = ["1,4" , "1,5" , "1,6" , "2,5" , "4,1" , "4,9" , "5,1" , "5,2" , "5,5" , "5,8" , "5,9" , "6,1" , "6,9" , "8,5" , "9,4" , "9,5" , "9,6"]
	if (shadedSquares.indexOf(tablut.movingFrom.toString()) !== -1){
		console.log("Leaving shaded square.");
		return true;
	}
}


function checkForWins(){
	checkForWhiteWin();
	checkForBlackWin();
	if (!tablut.gameOver){
		switchTurns();
	}
}


function switchTurns(){
	tablut.moveDirection = null;
	tablut.movingTo.row = null;
	tablut.movingTo.column = null;
	if (tablut.homeColor === "B"){
		tablut.homeColor = "W";
		tablut.enemyColor = "B";
	} else {
		tablut.homeColor = "B";
		tablut.enemyColor = "W";
	}
	if (tablut.homeColor === "B"){
		$(".status-text").text("Black to move.");
	} else {
		$(".status-text").text("White to move.");	
	}
}


function checkForWhiteWin(){
	if (tablut.kingIsAt.row === 1 || tablut.kingIsAt.row === 9 || tablut.kingIsAt.column === 1 || tablut.kingIsAt.column === 9) {
		$(".status-text").text("The King escapes! White wins the game.");
		var $winningSquare = $("tr:nth-child(" + tablut.kingIsAt.row + ") td:nth-child(" + tablut.kingIsAt.column + ")");
		$winningSquare.addClass("blue");
		tablut.gameOver = true;
	}
}


function checkForBlackWin(){
	if (kingTrappedFromNorth() && kingTrappedFromEast() && kingTrappedFromWest() && kingTrappedFromSouth()){
			$(".status-text").text("The King is surrounded! Black wins the game.");	
			var $winningSquare = $("tr:nth-child(" + tablut.kingIsAt.row + ") td:nth-child(" + tablut.kingIsAt.column + ")");
			$winningSquare.addClass("red");	
			tablut.gameOver = true;	
	}
}

function kingTrappedFromNorth(){
	var oneSquareNorth = tablut.board[tablut.kingIsAt.row][tablut.kingIsAt.column - 1];
	if (oneSquareNorth === "B" || oneSquareNorth === "shaded") return true;
}

function kingTrappedFromEast(){
	var oneSquareEast = tablut.board[tablut.kingIsAt.row + 1][tablut.kingIsAt.column];
	if (oneSquareEast === "B" || oneSquareEast === "shaded") return true;
}

function kingTrappedFromSouth(){
	var oneSquareSouth = tablut.board[tablut.kingIsAt.row][tablut.kingIsAt.column + 1];
	if (oneSquareSouth === "B" || oneSquareSouth === "shaded") return true;
}

function kingTrappedFromWest(){
	var oneSquareWest = tablut.board[tablut.kingIsAt.row - 1][tablut.kingIsAt.column];
	if (oneSquareWest === "B" || oneSquareWest === "shaded") return true;
}