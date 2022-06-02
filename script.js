const gameBoard = (function() {
    let _boardLayout = new Array(9);
    const board = document.querySelector(".gameBoard");

    const makeMove = (field, player) => {
        const _square = board.querySelector(`.gameField[data-field="${field}"] p`);
        if (_boardLayout[field] === undefined) {
            // push to array
            _boardLayout[field] = player.getSign();
            // write to board
            _square.textContent = _boardLayout[field];
            _logBoard();
        } else {
            console.log("Already populated");
            return false;
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
        return {freeFields, usedFields, all: _boardLayout};
    }

    const restart = () => {
        _boardLayout = new Array(9);
        board.querySelectorAll(".gameField p").forEach(field => {
            field.textContent = "";
        });
    }
    
    return {
        makeMove,
        getFields,
        restart
    }

})();

const player = function(name, sign, human) {
    const getName = () => name;
    const getSign = () => sign;
    const isHuman = () => human;
    return {getName, getSign, isHuman};
}

const gameLogic = (function() {
    // Define players/names in browser
    let player1;
    let player2;
    let playerTurn;

    const addPlayers = (player1_name, player2_name, ai) => {
        player1 = player(player1_name, "X", true);
        player2 = player(player2_name, "O", ai);
        playerTurn = player1;
        displayController.swapTurn(playerTurn);
    }
    
    const userMakeMove = (e) => {
        if (!playerTurn) {
            console.log("Add players first!");
            return;
        }
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
        const _freeFields = gameBoard.getFields().freeFields;
        // Check if field is empty, else return
        if (!_freeFields.includes(+field)) return;
        gameBoard.makeMove(field, e.target.user || player1);
        const winner = _checkForWin();
        if (winner) {
            console.log("There was a winner: " + winner.getName());
            displayController.displayResult("win", winner);
            return;
        } else if (_checkForDraw()) {
            console.log("Draw");
            displayController.displayResult("draw", null);
            return;
        }

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
        _checkForWin();
    }

    const _checkForWin = () => {

        const _checkRows = () => {
            for (let i = 0; i < 3; i++) {
                const row = [];
                for (let j = 3 * i; j < 3 * i + 3; j++) {
                    row.push(gameBoard.getFields().all[j]);
                }
                const winner = _findWinner(row);
                if (winner) return winner;
            }
        }

        const _checkColumns = () => {
            for (let i = 0; i < 3; i++) {
                const column = [];
                for (let j = i; j < i + 7; j = j + 3) {
                    column.push(gameBoard.getFields().all[j]);
                }
                const winner = _findWinner(column);
                if (winner) return winner;
            }
        }

        const _checkDiagonal = () => {
            for (let i = 0; i < 3; i = i + 2) {
                const diagonal = [];
                if (i === 0) {
                    for (let j = i; j < 9; j = j + 4) {
                        diagonal.push(gameBoard.getFields().all[j]);
                    } 
                } else if (i === 2) {
                    for (let j = i; j < 7; j = j + 2) {
                        diagonal.push(gameBoard.getFields().all[j]);
                    }
                }
                const winner = _findWinner(diagonal);
                if (winner) return winner;
            }
        }

        const _findWinner = (line) => {
            if (line.every(field => field === player1.getSign())) {
                return player1;
            } else if (line.every(field => field === player2.getSign())) {
                return player2;
            }
        }

        return _checkRows() || _checkColumns() || _checkDiagonal();

    }

    const _checkForDraw = () => {
        if (gameBoard.getFields().freeFields.length < 1) {
            return true;
        } else return false;
    }


    return {
        userMakeMove,
        addPlayers
    }
    
})();

const displayController = (function() {
    // Event listeners etc
    const _boardFields = document.querySelectorAll(".gameField");
    const _inputs = document.querySelector(".players");
    const _startbutton = document.querySelector("#startGame");

    const _init = () => {
        _boardFields.forEach(field => {
            field.addEventListener("click", gameLogic.userMakeMove);
        });
    }

    const swapTurn = (user) => {
        _boardFields.forEach(field => {
            field.user = user;
        });
    }

    const _addPlayers = () => {
        const _player1_name = _inputs.querySelector("#player-1-name").value || "Player 1";
        const _player2_name = _inputs.querySelector("#player-2-name").value || "Player 2";
        const _player2_ai = !_inputs.querySelector("#player-2-ai").checked;
        gameLogic.addPlayers(_player1_name, _player2_name, _player2_ai);
        gameBoard.restart();
        console.log("Players added");
    }

    const displayResult = (result, winner) => {
        // Show overlay displaying result
    }

    _startbutton.addEventListener("click", _addPlayers);

    // Info boxes with text

    _init();

    return {
        swapTurn,
        displayResult
    }
})();


