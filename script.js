const gameBoard = (function() {
    const _boardLayout = new Array(9);

    const makeMove = (field, player) => {
        const _square = document.querySelector(`.gameField[data-field="${field}"] p`);
        if (_boardLayout[field] === undefined) {
            // push to array
            _boardLayout[field] = player.getSign();
            // write to board
            _square.textContent = _boardLayout[field];
            _logBoard();
        } else {
            console.log("Already populated");
        }
    }

    const _logBoard = () => {
        for(let i = 0; i < _boardLayout.length; i = i + 3) {
            console.log(`${_boardLayout[i] || "_"}  ${_boardLayout[i+1] || "_"}  ${_boardLayout[i+2] || "_"}\n`);
        }
    }

    const getFields = () => {
        const freeFields = [];
        const usedFields = [];

        for (let i = 0; i < _boardLayout.length; i++) {
            if (_boardLayout[i]) {
                usedFields.push(i);
            } else {
                freeFields.push(i);
            }
        }
        return {freeFields, usedFields};
    }
    
    return {
        makeMove,
        getFields
    }

})();

const player = function(name, sign, human) {
    const getName = () => name;
    const getSign = () => sign;
    const isHuman = () => human;
    return {getName, getSign, isHuman};
}

const gameLogic = (function() {
    const player1 = player("Player 1", "X", true);
    const player2 = player("Player 2", "O", true);
    let playerTurn = player1;
    
    const userMakeMove = (e) => {
        if (!playerTurn.isHuman()) {
            console.log("Not your turn!");
            return;
        }   
        const turnToggle = () => {
            if (playerTurn === player1) {
                playerTurn = player2;
            } else {
                playerTurn = player1;
            }
        }
        const field = e.target.dataset.field;
        gameBoard.makeMove(field, e.target.user || player1);
        // Check for win/draw

        // Differences if player 2 is computer vs human
        if (!player2.isHuman()) {
            turnToggle();
            setTimeout(() => {
                computerMakeMove();
                turnToggle();
            }, 500);
        } else if (player2.isHuman()) {
            turnToggle();
            displayController.swapTurn(playerTurn);
        }
        
    }
    const computerMakeMove = () => {
        const _freeFields = gameBoard.getFields().freeFields;
        const _choice = Math.floor(Math.random() * _freeFields.length);
        gameBoard.makeMove(_freeFields[_choice], player2);
        // Check for win/draw
    }

    const checkForWin = () => {

    }


    return {
        userMakeMove
    }
    
})();

const displayController = (function() {
    // Event listeners etc
    const _boardFields = document.querySelectorAll(".gameField");

    _boardFields.forEach(field => {
        field.addEventListener("click", gameLogic.userMakeMove);
    });

    const swapTurn = (user) => {
        _boardFields.forEach(field => {
            field.user = user;
        });
    }

    // Info boxes with text

    return {
        swapTurn
    }
})();


