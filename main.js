const gameBoard = (() => {

    let playerOneSelections = [];
    let playerTwoSelections = [];
    let computerSelections = [];

    function resetPlayers() {
        
        this.playerOneSelections = [];
        this.playerTwoSelections = [];
        this.computerSelections = [];
    };

    return {
        playerOneSelections,
        playerTwoSelections,
        computerSelections,
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
const compPlayer = Player('Computer', 'O');



//////////////////////////////////////



const game = (() => {
    
    const playerTurn = document.getElementById('player-turn');
    const gameTimer = document.getElementById('game-timer');
    playerTurn.style.display = "none";
    let x_turn = true;
    let roundCount = 0;
    let player1name;
    let player2name;
    let computerGame = false;
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

    const gameSelect = document.getElementById('game-select');
    const humanBtn = document.getElementById('human');
    humanBtn.addEventListener('click', startHumanGame);
    const cellElements = document.querySelectorAll('[data-cell]');
    const startGame = document.forms['start-game-form'];
    startGame.style.display = 'none';
    let cellArray = Array.from(cellElements);
    let computerCaption = document.getElementById('computer-caption');
   
    function startHumanGame () {
        console.log('start human game fired')
        gameSelect.style.display = 'none'
        startGame.style.display = 'flex';
    };


    // create module to control display
    const displayController = (() => {

        // select for "home screen" buttons
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', resetDisplay);
        restartBtn.style.display = 'none';
        restartBtn.addEventListener('click', resetDisplay);
            function resetDisplay () {
                computerGame = false;
                gameSelect.style.display = '';
                startBtn.style.display = '';
                playerOneNameInput.style.display = '';
                playerTwoNameInput.style.display = '';
                startGame.style.display = 'none';
                playerTurn.innerText = '';
                playerTurn.style.display = 'none';
                restartBtn.style.display = 'none';
                cellElements.forEach(cell => {
                    cell.innerText = '';
                    cell.setAttribute('id', '');
                    cell.setAttribute('class', 'cell');
                });
            }
    
        humanBtn.addEventListener('click', startHumanGame);
        const compBtn = document.getElementById('computer');
        compBtn.addEventListener('click', startCompGame);
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
           

        } else if (!x_turn) {
            cell.innerText = player2.mark;
            gameBoard.playerTwoSelections.push(selectedCell);
            x_turn = true;
            playerTurn.innerText = `${player1name}'s turn`;
            roundCount++
            checkWin();
            
        };
    };

    function checkWin() {

        checkAllWins();

        
        
        if (playerOneWin === true) {
            if (computerGame === true) {
                playerTurn.style.display = '';
                playerTurn.innerText = 'You win!';
            } else {
                playerTurn.innerText = `${player1name} wins!`;
            }
            
            stopTimer();
            resetBoard();
            gameBoard.resetPlayers();
        } else if (playerTwoWin === true) {
            
            playerTurn.innerText = `${player2name} wins!`;
            stopTimer();
            resetBoard();
            gameBoard.resetPlayers();
        } else if (computerWin === true) {
            playerTurn.style.display = '';
            playerTurn.innerText = `Computer wins!`;
            stopTimer();
            resetBoard();
            gameBoard.resetPlayers();
        } else if (!playerOneWin && !playerTwoWin || !playerOneWin && !computerWin ) {
            
            if(roundCount === 9) {
                if (computerGame === true) {
                    playerTurn.style.display = '';
                }
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
            computerWin,
        };
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

    function startCompGame() {
        gameSelect.style.display = 'none';
        computerGame = true;
        startGame.style.display = 'none';
        computerCaption.style.display = 'flex';
        computerCaption.textContent = 'Your move';
        // const cellElements = document.querySelectorAll('[data-cell]');
        // let cellArray = Array.from(cellElements);
        // x_turn = true;
        startTimer();
        // CREATE ARRAY FROM BOARD CELLS ///////////////////////////////////////////////////////////
        activateCellsComp();
         function activateCellsComp () {
             
             cellElements.forEach(cell => {
                 cell.addEventListener('click', addToBoardComp, { once: true });
             });
         };
 
        // activateCellsComp();
    
        // CREATE LOGIC TO UPDATE BOARD WITH X's and O's //////////////////////////////////////////////////////
    
    

             // AI to make its turn
            

            
    
    }
    function addToBoardComp(e) {
        console.log('comp add board firing');
        let cell = e.target;    // when player clicks on cell
        let selectedCell = cellArray.indexOf(cell);   // create a variable set to the unique index # of that cell (to keep track of it)
        cell.setAttribute('id', selectedCell);  // create a unique id set to that cell's index #
        
       
        cell.innerText = player1.mark;  // make the selected cell display an x
        gameBoard.playerOneSelections.push(selectedCell); // add index to array of player'selections (to compare with winning combos)
        roundCount++ 
        computerCaption.style.display = 'none';
        checkWin(); // check for win
        computerMove();
    } 

    function computerMove() {
        

        getCell();
        function getCell() {
            let cellChoice = Math.floor(Math.random() * Math.floor(9));
            let cell = cellArray[cellChoice];
            let cellId = cellArray.indexOf(cell);
            if (!playerOneWin && !computerWin) {
                if (roundCount < 9) {
                    if (!gameBoard.playerOneSelections.includes(cellId) && !gameBoard.computerSelections.includes(cellId)) {
                        computerCaption.style.display = 'flex';
                        computerCaption.textContent = 'Computer thinking...'
                        setTimeout(function() {
                            gameBoard.computerSelections.push(cellId); 
                            cell.setAttribute('id', cellId);
                            cell.innerText = compPlayer.mark;
                            cell.removeEventListener('click', addToBoardComp, { once: true});
                            x_turn = true;
                            roundCount++;
                            computerCaption.textContent = 'Your move';
                            checkWin();
                            }, 1200)
                        
                        
                    } else {
                        return getCell();
                    }
                }
            }
        }
    }

    function checkAllWins () {
        let playerwin;
        checkPlayerWin(gameBoard.playerOneSelections);
        playerOneWin = playerwin;
        checkPlayerWin(gameBoard.playerTwoSelections);
        playerTwoWin = playerwin;
        checkPlayerWin(gameBoard.computerSelections);
        computerWin = playerwin;
        
    
            function checkPlayerWin(playerselections) {
                for (let i = 0; i < winningCombinations.length; i++) {
                    let newArray = flatten(winningCombinations[i]);
                    if(playerselections.indexOf(newArray[0]) !== -1) {
                        if(playerselections.indexOf(newArray[1]) !== -1) {
                            if(playerselections.indexOf(newArray[2]) !== -1) {
                                let winningLine = winningCombinations[i];
                            
                                for (let i = 0; i < winningLine.length; i++) {
                                    document.getElementById(winningLine[i]).classList.toggle('winningLine');
                                }
                                playerwin = true;
                                return;
                            }
                        }
                    } else {
                    playerwin = false;
                    }
                }
                return;
            };
    
            function flatten(arr) {
                let flatArray = [];
    
                arr.forEach(element => {
                    if (Array.isArray(element)) {
                        flatArray = flatArray.concat(flatten(element));
                    }
                    else {
                        flatArray.push(element);
                    }
                })
                return flatArray;
            };
        };

        function resetBoard() {
            if (computerGame === true) {
                cellElements.forEach(cell => {
                    cell.removeEventListener('click', addToBoardComp, { once: true});
                    
                })
            } 
            else {
                console.log('else i guess')
                cellElements.forEach(cell => {
                    cell.removeEventListener('click', addToBoard, { once: true });
                })
            };
            roundCount = 0;
            x_turn = true;
            displayController.restartBtn.style.display = 'inline';
        };

    return {
        roundCount,
        displayController,
        playerTurn,
        checkWin,
        resetBoard,
    };

})();



















