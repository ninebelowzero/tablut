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
	highlighted: false,
	$leaving: null,
	pieceSelected: {
//		row: null,
//		column: null,
		letter: null
	},
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
		var square = $(this);
		clickedOn(square);
	})
}


function clickedOn(square){
	if (!tablut.gameOver){
		if (!tablut.highlighted){
			selectingPiece(square);
		} else {
			clickedAfterHighlighting(square);
		}
	}
}


function selectingPiece(square){
	if (legalSelection(square)){
		highlight(square);
	}
}


function legalSelection(square){
	if (!square.text()) return false;
	if (square.text() === tablut.homeColor) return true;
	if (square.text() === "K" && tablut.homeColor === "W") return true;
}


function highlight(square){
	// tablut.pieceSelected.row = parseInt(square.attr("data-row"));
	// tablut.pieceSelected.column = parseInt(square.attr("data-column"));

	tablut.movingFrom[0] = parseInt(square.attr("data-row"));
	tablut.movingFrom[1] = parseInt(square.attr("data-column"));

	tablut.pieceSelected.letter = square.text();
	square.toggleClass("highlighted");
	tablut.highlighted = true;
	console.log("Selected " + tablut.pieceSelected.letter + " at " + tablut.movingFrom);
	tablut.$leaving = square;	
}


function unhighlight(square){
	square.toggleClass("highlighted");
	tablut.highlighted = false;
}


function clickedAfterHighlighting(square){
	if (identical(square)){
		unhighlight(square);
	} else {
		attemptMove(square);
	}
}


function identical(square){
	if (tablut.movingFrom[0] == square.attr("data-row") && tablut.movingFrom[1] == square.attr("data-column")) {
		return true;
	} 
}


function attemptMove(square){
	if (legalMove(square)){
		movePieceTo(square);
		wipeVacated();
		checkForCaptures(square);
		checkForWins();
	} else {
		console.log("Illegal move.")
	}
}


function legalMove(square){
	if (available(square) && matchesGridPosition(square) && noInterveningPieces(square)){
		return true;
	}
}


function available(square){
	if (square.text()){
		console.log("Square occupied");
		return false;
	} else if (square.hasClass("shaded")){
		console.log("Cannot move to shaded squares.");
		return false;
	} else {
		return true;
	}
}


function matchesGridPosition(square){
	if (square.attr("data-row") == tablut.movingFrom[0]){
		tablut.moveDirection = "horizontal";
		return true;
	} else if (square.attr("data-column") == tablut.movingFrom[1]){
		tablut.moveDirection = "vertical";
		return true;
	}
}


// BELOW SECTION V WET, NEEDS REFACTORING

function noInterveningPieces(square){	
	if (tablut.moveDirection === "horizontal"){
		return horizontalMove(square);
	} else if (tablut.moveDirection === "vertical"){
		return verticalMove(square);
	}
}


function horizontalMove(square) {

	var comingFromColumn = tablut.movingFrom[1];
	var goingToColumn = square.attr("data-column");

	if (goingToColumn > comingFromColumn){
		for (var i = comingFromColumn + 1; i < goingToColumn; i++){
			var intermediateSquare = tablut.board[tablut.movingFrom[0]][i];
			if (intermediateSquare !== null){
				console.log("There are intervening pieces.")
				return false;
			}
		}
		return true;

	} else if (comingFromColumn > goingToColumn){
		for (var i = comingFromColumn - 1; i > goingToColumn; i--){
			var intermediateSquare = tablut.board[tablut.movingFrom[0]][i];
			if (intermediateSquare !== null){
				console.log("There are intervening pieces.")
				return false;
			}
		}
		return true;
	}
}


function verticalMove(square){
	
	var comingFromRow = tablut.movingFrom[0];
	var goingToRow = square.attr("data-row");

	if (goingToRow > comingFromRow){
		for (var i = comingFromRow + 1; i < goingToRow; i++){
			var intermediateSquare = tablut.board[i][tablut.movingFrom[1]];
			if (intermediateSquare !== null){
				console.log("There are intervening pieces.")
				return false;
			}
		}
		return true;

	} else if (comingFromRow > goingToRow){
		for (var i = comingFromRow - 1; i > goingToRow; i--){
			var intermediateSquare = tablut.board[i][tablut.movingFrom[1]];
			if (intermediateSquare !== null){
				console.log("There are intervening pieces.")
				return false;
			}
		}
		return true;
	}
}

// END OF WET CODE


function movePieceTo(square){
	tablut.movingTo.row = parseInt(square.attr("data-row"));
	tablut.movingTo.column = parseInt(square.attr("data-column"));
	console.log("Moving to: " + tablut.movingTo.row + ", " + tablut.movingTo.column);
	square.text(tablut.pieceSelected.letter);
	tablut.board[tablut.movingTo.row][tablut.movingTo.column] = tablut.pieceSelected.letter;
	if (tablut.pieceSelected.letter === "K"){
		tablut.kingIsAt.row = tablut.movingTo.row;
		tablut.kingIsAt.column = tablut.movingTo.column;
	}
}


// MORE WET CODE

function checkForCaptures(square){
	lookNorth();
	lookEast();
	lookSouth();
	lookWest();
}

function lookNorth(){
	if (tablut.board[tablut.movingTo.row - 1][tablut.movingTo.column] === tablut.enemyColor){
		checkingSquare = $("tr:nth-child(" + (tablut.movingTo.row - 1) + ") td:nth-child(" + tablut.movingTo.column + ")");
		if (tablut.board[tablut.movingTo.row - 2][tablut.movingTo.column] === tablut.homeColor){
			tablut.board[tablut.movingTo.row - 1][tablut.movingTo.column] = null;
			checkingSquare.text("");
		}
	} 
}

function lookEast(){
	if (tablut.board[tablut.movingTo.row][tablut.movingTo.column + 1] === tablut.enemyColor){
		checkingSquare = $("tr:nth-child(" + tablut.movingTo.row + ") td:nth-child(" + (tablut.movingTo.column + 1) + ")");
		if (tablut.board[tablut.movingTo.row][tablut.movingTo.column + 2] === tablut.homeColor){
			tablut.board[tablut.movingTo.row][tablut.movingTo.column + 1] = null;
			checkingSquare.text("");
		}
	}
}

function lookSouth(){
	if (tablut.board[tablut.movingTo.row + 1][tablut.movingTo.column] === tablut.enemyColor){
		checkingSquare = $("tr:nth-child(" + (tablut.movingTo.row + 1) + ") td:nth-child(" + tablut.movingTo.column + ")");
		if (tablut.board[tablut.movingTo.row + 2][tablut.movingTo.column] === tablut.homeColor){
			tablut.board[tablut.movingTo.row + 1][tablut.movingTo.column] = null;
			checkingSquare.text("");
		}
	}
}

function lookWest(){
	if (tablut.board[tablut.movingTo.row][tablut.movingTo.column - 1] === tablut.enemyColor){
		checkingSquare = $("tr:nth-child(" + tablut.movingTo.row + ") td:nth-child(" + (tablut.movingTo.column - 1) + ")");
		if (tablut.board[tablut.movingTo.row][tablut.movingTo.column - 2] === tablut.homeColor){
			tablut.board[tablut.movingTo.row][tablut.movingTo.column - 1] = null;
			checkingSquare.text("");
		}
	}
}

// END OF WET CODE


function wipeVacated(){
	tablut.$leaving.text("");
	tablut.$leaving.toggleClass("highlighted");
	if (leavingShadedSquare() ){
		tablut.board[tablut.movingFrom[0]][tablut.movingFrom[1]] = "shaded";
	} else {
		tablut.board[tablut.movingFrom[0]][tablut.movingFrom[1]] = null;
	}
	tablut.highlighted = null;
	tablut.$leaving = null;
	// tablut.pieceSelected.row = null;
	// tablut.pieceSelected.column = null;
	tablut.pieceSelected.letter = null;
}


function leavingShadedSquare(){
	if (tablut.movingFrom.toString() === "1,4" || "1,5" || "1,6" || "2,5" || "4,1" || "4,9" || "5,1" || "5,2" || "5,5" || "5,8" || "5,9" || "6,1" || "6,9" || "8,5" || "9,4" || "9,5" || "9,6"){
		console.log("Leaving shaded square.")
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
		tablut.gameOver = true;
	}
}


function checkForBlackWin(){
	if (kingTrappedFromNorth() && kingTrappedFromEast() && kingTrappedFromWest() && kingTrappedFromSouth()){
			$(".status-text").text("The King is surrounded! Black wins the game.");	
			tablut.gameOver = true;	
	}
}

function kingTrappedFromNorth(){
	if (tablut.board[tablut.kingIsAt.row][tablut.kingIsAt.column - 1] === "B") return true;
}

function kingTrappedFromEast(){
	if (tablut.board[tablut.kingIsAt.row + 1][tablut.kingIsAt.column] === "B") return true;
}

function kingTrappedFromSouth(){
	if (tablut.board[tablut.kingIsAt.row][tablut.kingIsAt.column + 1] === "B") return true;
}

function kingTrappedFromWest(){
	if (tablut.board[tablut.kingIsAt.row - 1][tablut.kingIsAt.column] === "B") return true;
}