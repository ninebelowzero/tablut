$(function(){
	listenForClicks();
})


var board = {
	blackToMove: true,
	highlighted: false,
	movingFrom: null,
	pieceSelected: {
		row: null,
		column: null,
		letter: null
	},
	movingTo: {
		row: null,
		column: null
	},
	kingMoved: false
};


function legalMove(square){
	if (square.text() === "B" && board.blackToMove) return true;
	if (square.text() === "W" && !board.blackToMove) return true;
	if (square.text() === "K" && !board.blackToMove){
		board.kingMoved = true;
		return true;
	}
}


function newMove() {
	board.movingFrom.text("");
	board.movingFrom.toggleClass("highlighted");
	board.highlighted = null;
	board.movingFrom = null;
	board.pieceSelected.row = null;
	board.pieceSelected.column = null;
	board.pieceSelected.letter = null;
	board.movingTo.row = null;
	board.movingTo.column = null;
	board.blackToMove = !board.blackToMove;
	if (board.blackToMove) {
		$(".status-text").text("Black to move.");
	} else {
		$(".status-text").text("White to move.");					
	}
	board.kingMoved = false;
}


function listenForClicks(){
	$("td").on("click", function(){
		var square = $(this);
		if (!board.highlighted){
			if (legalMove(square)){
				highlight(square);
			}
		} else if (board.highlighted){
			if (board.pieceSelected.row === square.attr("data-row") && board.pieceSelected.column === square.attr("data-column")) {
				square.toggleClass("highlighted");
				board.highlighted = false;
			} else if (square.text()){
				console.log("Square occupied");
			} else {
				movePieceTo(square);
				newMove();
			}
		}
	})
}


function highlight(square){
	board.pieceSelected.row = square.attr("data-row");
	board.pieceSelected.column = square.attr("data-column");
	board.pieceSelected.letter = square.text();
	square.toggleClass("highlighted");
	board.highlighted = true;
	console.log("Selected " + board.pieceSelected.letter + " at " + board.pieceSelected.row + ", " + board.pieceSelected.column);
	board.movingFrom = square;	
}


function movePieceTo(square){
	board.movingTo.row = square.attr("data-row");
	board.movingTo.column = square.attr("data-column");
	console.log("Moving to: " + board.movingTo.row + ", " + board.movingTo.column);
	square.text(board.pieceSelected.letter);
	// Would like to highlight destination square - but needs a timer.
	// square.toggleClass("highlighted");
}

