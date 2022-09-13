const Board = (() => {
    let feild = document.querySelectorAll(".feild");

    const _board = [ 
                0,1,2,
                3,4,5,
                6,7,8
            ];

    const Turn = (player, index) => {
        if (_board[index] != "X" && _board[index] != "O") {
            _board[index] = player;
        }
    }

    const UpdateBoard = () => {
        for (let i = 0; i < feild.length; i++) {
            if (Board._board[i] === "X" || Board._board[i] === "O") {
                feild[i].innerHTML = Board._board[i];
            }
        }
    }

    const winningCondition = (board, player) => {
        if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
        ) {
        return true;
        } else {
        return false;
        }
    }

    return { _board, Turn, winningCondition ,UpdateBoard };

})();

const Player = (() => {
    let player1 = "X";
    
    const Secondplayer = () => {
        let player2; 
        let r = confirm("Do you want to play with Computer?");
        if (r) {
            player2 = AI();
        } else {
            player2 = "O";
        }
        return player2;
    }
    return { Secondplayer , player1 };
})();

const GameLogic = (player2, AIorNot, level) => {

    let feild = document.querySelectorAll(".feild");
    let OutroScreen = document.getElementById("OutroScreen");
    let replay = document.getElementById("replay");


    const GameLoop = () => {
        let round = 0; 
        let i;
        feild.forEach(f => {
            f.addEventListener("click", (e) => {
                if (e.target) {
                    i = e.target.dataset.index - 1;
                    console.log("index clicked : " + i);
                    if (Board._board[i] != "X" && Board._board[i] != "O") {
                        round++;
                    }
                }
                if (round === 9) {
                    console.log ("Tie!");
                }
                if (round % 2 !== 0) {
                    Board.Turn("X" , i)
                    if (Board.winningCondition(Board._board, "X")) {
                        console.log("Winner is " + "X");
                        GameOver();
                    }
                    if (AIorNot) {
                        let move = player2.bestSpot(level);
                        console.log("Best Move for AI: " + move);
                        Board.Turn("O", move);
                        round++;
                        if (Board.winningCondition(Board._board, "O")) {
                            console.log("Winner is " + "O");
                            GameOver();
                        }
                    }
                } else {
                    Board.Turn("O" , i);
                    if (Board.winningCondition(Board._board, "O")) {
                        console.log("Winner is " + "O");
                        GameOver();
                    }
                }
                Board.UpdateBoard();
            })
        })
    }

    const GameOver = () => {
        OutroScreen.classList.add("active");
        replay.classList.add("active");
    }

    return {GameLoop};
};


const AI = () => {
    const huPlayer = "X";
    const aiPlayer = "O";

    const EmptyIndex = (board) => {
        return board.filter( s => s != "O" && s != "X");
    }

    const winning = (board, player) => {
        if (
        (board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player)
        ) {
        return true;
        } else {
        return false;
        }
    }

    const randomSpot = () => {
        const arr = EmptyIndex(Board._board);
        return arr[Math.floor(Math.random()*arr.length)];
    }

    const bestSpot = (level) => {
        if (level === 1) {
            return randomSpot();
        } else {
            return MinMax(Board._board, aiPlayer).index;
        }
    }

    //Diffcult level AI.
    const MinMax = (newBoard, player) => {

        //avilable free index in board.
        let availSpot = EmptyIndex(newBoard);

        //base Condition.
        if (winning(newBoard, huPlayer) ) {
            return {score: -10};
        } else if (winning(newBoard, aiPlayer) ) {
            return {score:10};
        } else if (availSpot.length === 0) {
            return {score: 0};
        }

        let Move = [];

        for (let i = 0; i < availSpot.length; i++ ) {
            let moves = {};
            moves.index = newBoard[availSpot[i]];

            //Putting Value.
            newBoard[availSpot[i]] = player;

            /**
             * collecting value of different index.
             */
            if (player == aiPlayer) {
                let rscore = MinMax(newBoard, huPlayer);
                moves.score = rscore.score;
            }
            else if (player == huPlayer) {
                let rscore = MinMax(newBoard, aiPlayer);
                moves.score = rscore.score;
            }

            // backtrack.
            newBoard[availSpot[i]] = moves.index;

            Move.push(moves);
        }

        let BestMove; 
        if (player == aiPlayer) {
            let bestScore = -10000; 
            for (let i = 0; i < Move.length; i++) {
                if (Move[i].score > bestScore) {
                    bestScore = Move[i].score; 
                    BestMove = i;
                }
            }
        } else {
            let bestScore = 10000; 
            for (let i = 0; i < Move.length; i++) {
                if (Move[i].score < bestScore) {
                    bestScore = Move[i].score; 
                    BestMove = i;
                }
            }
        }
        return Move[BestMove];
    }

    return {bestSpot};
};

let player2 = Player.Secondplayer();
let isAI = false;
let level = 1;
if (confirm("Please Confirm again")) {
    isAI = true;
    if(confirm("Do you want difficult level")) {
        level = 2;
    }
}

let main = GameLogic( player2, isAI, level);
main.GameLoop();
