const gameBoard = (() => {

    let playerOneSelections = [];
    let playerTwoSelections = [];

    function resetPlayers() {
        this.playerOneSelections = [];
        this.playerTwoSelections = [];
    };

    return {
        playerOneSelections,
        playerTwoSelections,
        resetPlayers,
    };
})();



/////////////////////////////////////////////




const Player = (name, mark) => {

    
    return {
        name,
        mark,
    };
};

const player1 = Player('Player 1', 'X');
const player2 = Player('Player 2', 'O');



//////////////////////////////////////



const game = (() => {
    
    const playerTurn = document.getElementById('player-turn');
    const gameTimer = document.getElementById('game-timer');
    playerTurn.style.display = "none";
    let x_turn = true;
    let roundCount = 0;
    let player1name;
    let player2name;
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const cellElements = document.querySelectorAll('[data-cell]');
    let cellArray = Array.from(cellElements);



    // create module to control display
    const displayController = (() => {

        // select for "home screen" buttons
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', resetDisplay);
        restartBtn.style.display = 'none';
        restartBtn.addEventListener('click', resetDisplay);
            function resetDisplay () {
                playerTurn.innerText = '';
                playerTurn.style.display = 'none';
                playerOneNameInput.style.display = 'inline';
                playerTwoNameInput.style.display = 'inline';
                startGame.style.display = 'inline';
                startBtn.style.display = 'inline';
                restartBtn.style.display = 'none';
                cellElements.forEach(cell => {
                    cell.innerText = '';
                    cell.setAttribute('id', '');
                    cell.setAttribute('class', 'cell');
                });
            }

        const startGame = document.forms['start-game-form'];
        startGame.addEventListener('submit', startFunction);
        const playerOneNameInput = startGame.querySelector('[data-player-1-input]')
        const playerTwoNameInput = startGame.querySelector('[data-player-2-input]')


        const startBtn = document.getElementById('start-game-btn');
    
        // create function to hide home screen and start game
        function startFunction(e) {
            e.preventDefault();
            activateCells();
            startTimer();
            let playerOneNameInputVal = startGame.querySelector('[data-player-1-input]').value;
            let playerTwoNameInputVal = startGame.querySelector('[data-player-2-input]').value;
            player1name = playerOneNameInputVal;
            player2name = playerTwoNameInputVal;
       
            playerOneNameInput.style.display = 'none';
            playerTwoNameInput.style.display = 'none';
            startGame.style.display = 'none';
            startBtn.style.display = 'none';
            playerTurn.innerText =`${playerOneNameInputVal}'s turn`;
            playerTurn.style.display = 'inline';
        };


        return {
            restartBtn,
            startFunction,
            resetDisplay,
        }
    })();

    // create array from cells in order to grab index # of cell
    function activateCells () {
        cellElements.forEach(cell => {
            cell.addEventListener('click', addToBoard, { once: true });
        });
    };

    // create function to update board with player moves (x's and o's) upon click event
    function addToBoard(e) {
        let cell = e.target;
        let selectedCell = cellArray.indexOf(cell);
        cell.setAttribute('id', selectedCell);

        if(x_turn) {
            cell.innerText = player1.mark;
            gameBoard.playerOneSelections.push(selectedCell);
            x_turn = false;
            playerTurn.innerText = `${player2name}'s turn`;
            roundCount++
            checkWin();
            console.log(roundCount);

        } else if (!x_turn) {
            cell.innerText = player2.mark;
            gameBoard.playerTwoSelections.push(selectedCell);
            x_turn = true;
            playerTurn.innerText = `${player1name}'s turn`;
            roundCount++
            checkWin();
            console.log(roundCount);
        };
    };

    function checkWin() {

        let playerOneWin = false;
        let playerTwoWin = false;
        let winningLine;

        function flatten(arr) {
            let flatArray = [];

            arr.forEach(element => {
                if (Array.isArray(element)) {
                    flatArray = flatArray.concat(flatten(element));
                }
                else {
                    flatArray.push(element);
                }
            });
            return flatArray;
        };

        const checkPlayerOneWin = (() => {
            for (let i = 0; i < winningCombinations.length; i++) {
                let newArray = flatten(winningCombinations[i]);
                if(gameBoard.playerOneSelections.indexOf(newArray[0]) !== -1) {
                    if(gameBoard.playerOneSelections.indexOf(newArray[1]) !== -1) {
                        if(gameBoard.playerOneSelections.indexOf(newArray[2]) !== -1) {
                            winningLine = winningCombinations[i];
                            for (let i = 0; i < winningLine.length; i++) {
                                document.getElementById(winningLine[i]).classList.toggle('winningLine');
                            };
                            playerOneWin = true;
                            return;
                        };
                    };
                } else {
                    playerOneWin = false;
                };
            };
            return;
        })();

        const checkPlayerTwoWin = (() => {
            for (let i = 0; i < winningCombinations.length; i++) {
                let newArray = flatten(winningCombinations[i]);
                if(gameBoard.playerTwoSelections.indexOf(newArray[0]) !== -1) {
                    if(gameBoard.playerTwoSelections.indexOf(newArray[1]) !== -1) {
                        if(gameBoard.playerTwoSelections.indexOf(newArray[2]) !== -1) {
                            winningLine = winningCombinations[i];
                            for (let i = 0; i < winningLine.length; i++) {
                                document.getElementById(winningLine[i]).classList.toggle('winningLine');
                            };
                            playerTwoWin = true;
                            return;
                        };
                    };
                } else {
                    playerTwoWin = false;
                };
            };
            return;
        })();
        
        if (playerOneWin === true) {
            console.log('player 1 wins');
            playerTurn.innerText = `${player1name} wins!`;
            stopTimer();
            resetBoard();
            gameBoard.resetPlayers();
        } else if (playerTwoWin === true) {
            console.log('player 2 wins');
            playerTurn.innerText = `${player2name} wins!`;
            stopTimer();
            resetBoard();
            gameBoard.resetPlayers();
        } else if (!playerOneWin && !playerTwoWin) {
            console.log(`roundCount: ${roundCount}`);
            if(roundCount === 9) {
                console.log('Draw');
                playerTurn.innerText = 'It\'s a draw!';
                stopTimer();
                resetBoard();
                gameBoard.resetPlayers();
            }
        } else {
            return;
        }

        return {
            playerOneWin,
            playerTwoWin,
            flatten,
            checkPlayerOneWin,
            checkPlayerTwoWin,
            resetBoard,
        };
    };

    function resetBoard() {
        cellElements.forEach(cell => {
            cell.removeEventListener('click', addToBoard, { once: true });
        });
        roundCount = 0;
        x_turn = true;
        displayController.restartBtn.style.display = 'inline';
    };

    function startTimer() {
        gameTimer.style.display = '';
        gameTimer.innerText = 'Time elapsed : 00:00:00';
        let seconds = 0;
        timer = setInterval(function() {
            seconds++;
            let secondCount = seconds % 60;
            let minuteCount = parseInt(seconds / 60);
            let hourCount = parseInt(minuteCount / 60);
            if (secondCount < 10) {
                
            }
            timerDisplay = `${hourCount < 10 ? '0' : ''}${hourCount}:${minuteCount < 10 ? '0' : ''}${minuteCount}:${secondCount < 10 ? '0' : ''}${secondCount}`;
            gameTimer.innerText = `Time elapsed : ${timerDisplay}`;
        }, 1000)
    }

    function stopTimer() {
        clearInterval(timer);
        gameTimer.style.display = 'none';
    }


    return {
        roundCount,
        displayController,
        playerTurn,
        checkWin,
        resetBoard,
    };
})();



















