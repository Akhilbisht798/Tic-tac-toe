// let DispayBoard = document.querySelector(".Board");

const Board = (() => {
    const _board = [" ", " ", " ", " ", " ", " "," " ," ", " "];

    const getIndex = (i) => {
        return _board[i];
    }

    const Reset = () => {
        for (let i = 0; i < 9; i++) {
            _board[i] = " ";
        }
    }

    const PrintBoard = () => {
        for (let i = 0; i < 9; i++) {
            console.log(_board[i]);
        }
    }
    return { _board, getIndex, Reset, PrintBoard };

})();


const Player = (name) => {
    const sign = name;

    const getPlayer = () => {
        return name;
    }

    const turn = (i) => {
        if (Board._board[i] == " ") {
            Board._board[i] = sign;
        }
    }
    return { turn, getPlayer };
}


const DisplayController = (() => {
    let feild = document.querySelectorAll(".feild");
    let OutroScreen = document.getElementById("OutroScreen");
    let replay = document.getElementById("replay");

    const UpdateBoard = () => {
        for (let i = 0; i < feild.length; i++) {
            feild[i].innerHTML = Board._board[i];
        }
    }

    const GameLoop = () => {
        let round = 0;
        let name = "X";
        let i;
        feild.forEach(f  => {
            f.addEventListener("click" , (e) => {
                if (e.target) {
                    i = e.target.dataset.index - 1;
                    console.log(i);
                    if (Board._board[i] === " ") {
                        round++;
                    }
                }
                if (round === 9) {
                    console.log ("Tie!");
                    GameOver();
                }
                if (round % 2 == 0) {
                    name = "O";
                }
                else {
                    name = "X";
                }
                ChangeAndUpdate(i, name);
                if (winCondition(name)) {
                    console.log(name + " Win the Game");
                    GameOver();
                }
            })

        })
    }

    //Change and update gameboard
    const ChangeAndUpdate = (index, name) => {
        Player(name).turn(index);
        UpdateBoard();
    }

    //Win Condition and AI is left.
    const winCondition = (player) => {
        const win = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        let HasWin;
        for (let i = 0; i < win.length; i++) {
            HasWin = false;
            let j;
            for (j = 0; j < win[i].length; j++) {
                let index = win[i][j];
                if (Board._board[index] === player) {
                    continue;
                }
                break;
            }
            if (j === win[i].length) {
                HasWin = true;
                break;
            }
        }
        return HasWin;
    }

    const GameOver = (text) => {
        OutroScreen.classList.add("active");
        replay.classList.add("active");
    }

    return { UpdateBoard, GameLoop , ChangeAndUpdate, winCondition };

})();

DisplayController.GameLoop();