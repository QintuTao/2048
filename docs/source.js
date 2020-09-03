/** ====== Constants ====== */
const GRIDSIZE = 4;

class Board {
    /**
     * Constructs a board with 4*4 tiles 
     */
    constructor() {
        /**
         * The data of the game is abstracted into an 2D array,
         * each tile is either null for empty block, or
         * a value retpresenting the tile's value 
         */
        this.board = [];
        for (let i = 0; i < GRIDSIZE; ++i) {
            this.board.push(0)
        }
        this.board = this.board.map(x => {
            let arr = []
            for (let i = 0; i < GRIDSIZE; ++i) {
                arr.push(null);
            }
            return arr;
        })

        this.syncLock = false // true == ON, which means the class is locked and no key press should invoke any effects 

        /** Binding Methods */
        this.randomInitTile = this.randomInitTile.bind(this);
        this.isOccupied = this.isOccupied.bind(this);
        this.start = this.start.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
        this.farthestCellLeft = this.farthestCellLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.farthestCellRight = this.farthestCellRight.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.farthestCellUp = this.farthestCellUp.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.farthestCellDown = this.farthestCellDown.bind(this);
        this.double = this.double.bind(this);
        this.changeColor = this.changeColor.bind(this);
    }

    start() {this.randomInitTile()}

    /**
     * Creates a tile with value '2' at random position
     * @returns true if it is such position is not occupied by other tiles
     */
    randomInitTile() {
        let randX = this.getRandomInt()
        let randY = this.getRandomInt()
        while (this.isOccupied(randX, randY)) {
            randX = this.getRandomInt();
            randY = this.getRandomInt();
        }
        this.board[randY][randX] = 2;
        this.append(randX, randY);
    }

    /**
     * Given the moving direction, calc the next state
     * @param {string} dir 
     */
    nextBoard(dir) {

    }
    /** UI Methods */
    /**
     * Move a tile to destination position horizontally
     * @param {number} init initial x position
     * @param {number} des final x position
     * @param {number} y the fixed y position
     * @param {boolean} endLife if the moving block should be abandond
     */
    moveX(init, des, y, endLife) {
            this.board[y][des] = this.board[y][init]
            this.board[y][init] = null
            if (endLife) {
                $(`.${init}-${y}`).css("transform", this.getTileCSSTransform(des, y))
                $(`div`).remove(`.${init}-${y}`)
            } else {
                $(`.${init}-${y}`).addClass(`${des}-${y}`).removeClass(`${init}-${y}`)
                $(`.${des}-${y}`).css("transform", this.getTileCSSTransform(des, y))
            }
    }

    /**
     * Move a tile to destination position vertically
     * @param {number} init initial y position
     * @param {number} des final y position
     * @param {number} x the fixed x position
     * @param {boolean} endLife if the moving block should be abandond
     */
    moveY(init, des, x, endLife) {
            this.board[des][x] = this.board[init][x]
            this.board[init][x] = null
            if (endLife) {
                $(`div`).remove(`.${x}-${init}`)
            } else {
                $(`.${x}-${init}`).addClass(`${x}-${des}`).removeClass(`${x}-${init}`)
                $(`.${x}-${des}`).css("transform", this.getTileCSSTransform(x, des))
            }
    }

    /**
     * Merge two tiles horizontally
     * @param {number} init initial x position 
     * @param {number} des the x position that the current tile is going to merge into
     * @param {number} y the fixed y position
     */
    mergeX(init, des, y) {
        if (this.isOccupied(des,y) && this.board[y][des] === this.board[y][init]) {
            const temp = this.board[y][des]
            console.log(temp)
            this.moveX(init,des,y, true)
            this.board[y][des] = 2 * temp
            const val = this.double(des,y)
            this.changeColor(2 * temp, des, y)
            $(`.${des}-${y}`).text(this.board[y][des])
        }
    }

    /**
     * Merge two tiles vertically 
     * @param {number} init initial y position 
     * @param {number} des the y position that the current tile is going to merge into
     * @param {number} x the fixed x position
     */
    mergeY(init, des, x) {
        if (this.isOccupied(x,des) && this.board[des][x] === this.board[init][x]) {
            const temp = this.board[des][x]
            this.moveY(init,des,x, true)
            this.board[des][x] = 2 * temp
            const val = this.double(des,x)
            this.changeColor(2 * temp, x, des)
            $(`.${x}-${des}`).text(this.board[des][x])

        }
    }

    /**
     * Shifts all cells to the left if possible
     */
    moveLeft(){
        var moved = false;
        for (let row = 0; row < GRIDSIZE; row++) {
            let hasMerged = false
            for (let column = 0; column < GRIDSIZE; column++) {
                const cell = this.board[row][column];
                if(cell!==null){
                    var desCell = this.farthestCellLeft(row,column-1)
                    if (desCell < 0) {
                        if (column !== 0) {
                            this.moveX(column, 0, row)
                            moved = true
                        }
                    } else {
                        var nextCell = this.board[row][desCell];
                        if(cell === nextCell && !hasMerged) {
                            this.mergeX(column,desCell,row);
                            moved = true;
                            hasMerged = true
                        } else if(desCell+1 !== column){
                            this.moveX(column,desCell+1,row,false);
                            moved = true;
                            hasMerged = false
                        }
                    }
                }
            }
        }
        if(moved)this.randomInitTile();  
        for (let index = 0; index < this.board.length; index++) {
            const element = this.board[index];
            console.log(element)
        } 
    }

/**
 * Finds the leftmost position that the current cell can shift to
 * @param {number} currRow 
 * @param {number} currCol 
 */
farthestCellLeft(currRow,currCol){
    while(currCol>=0 && this.board[currRow][currCol]===null){
        currCol --;
    }
    return currCol;
}

    /**
     * Shifts all cells to the right if possible
     */
    moveRight(){
        var moved = false;
        for (let row = 0; row < GRIDSIZE; row++) {
            let hasMerged = false
            for (let column = GRIDSIZE-1; column >= 0; column--) {
                
                const cell = this.board[row][column];
                if(cell!==null) {
                var desCell = this.farthestCellRight(row,column+1);
                if (desCell == GRIDSIZE) {
                    if (column !== GRIDSIZE-1) {
                        this.moveX(column, GRIDSIZE-1, row)
                        moved = true
                        hasMerged = false
                    }
                } else {
                    var nextCell = this.board[row][desCell];
                    if(cell === nextCell && !hasMerged) {
                        this.mergeX(column,desCell,row);
                        moved = true;
                        hasMerged = true
                    } else if(desCell-1 !== column){
                        this.moveX(column,desCell-1,row,false);
                        moved = true;
                        hasMerged = false 
                        }
                    } 
                }
            }
        }
        console.log(this.board)
        if(moved)this.randomInitTile();   
        for (let index = 0; index < this.board.length; index++) {
            const element = this.board[index];
            console.log(element)
        } 
    }

    /**
    * Finds the rightmost position that the current cell can shift to
    * @param {number} currRow 
    * @param {number} currCol 
    */
    farthestCellRight(currRow,currCol){
    while(currCol<=GRIDSIZE-1 && this.board[currRow][currCol]===null){
        currCol ++;
    }
    return currCol;
    }

    /**
     * Shifts all cells up if possible
     */
    moveUp(){
        var moved = false;
        for (let column = 0; column < GRIDSIZE; column++) {
            let hasMerged = false
            for (let row = 0; row < GRIDSIZE; row++) {
                const cell = this.board[row][column];
                if(cell!==null){
                    var desCell = this.farthestCellUp(row-1,column);
                    if(desCell < 0){
                        if (row !== 0) {
                            this.moveY(row, 0, column, false)
                            moved = true
                            hasMerged = false
                        }
                    } else {
                        var nextCell = this.board[desCell][column];
                        if(cell === nextCell && !hasMerged) {
                            this.mergeY(row,desCell,column);
                            moved = true;
                            hasMerged = true
                        } else if(desCell+1 !== row){
                            this.moveY(row,desCell+1,column,false);
                            moved = true;
                            hasMerged = false
                        }
                    }
                    
                }
            }
        }
        if(moved)this.randomInitTile();   
        for (let index = 0; index < this.board.length; index++) {
            const element = this.board[index];
            console.log(element)
        } 
    }

    /**
    * Finds the upmost position that the current cell can shift to
    * @param {number} currRow 
    * @param {number} currCol 
    */
    farthestCellUp(currRow,currCol){
    while(currRow>=0 && this.board[currRow][currCol]===null){
        currRow --;
    }
    return currRow;
    }

    /**
     * Shifts all cells down if possible
     */
    moveDown(){
        var moved = false;
        for (let column = 0; column < GRIDSIZE; column++) {
            let hasMerged = false
            for (let row = GRIDSIZE-1; row >= 0; row--) {
                const cell = this.board[row][column];
                if(cell!==null){
                    var desCell = this.farthestCellDown(row+1,column);
                    if(desCell >= GRIDSIZE){
                        if (row != GRIDSIZE-1) {
                            this.moveY(row, GRIDSIZE-1, column, false)
                            moved = true
                            hasMerged = false
                        }
                    } else {
                        var nextCell = this.board[desCell][column];
                        if (cell === nextCell) {
                            this.mergeY(row,desCell,column);
                            moved = true;
                            hasMerged = true
                        } else if(desCell-1 !== row){
                            this.moveY(row,desCell-1,column,false);
                            moved = true;
                            hasMerged = false
                        }
                    }
                    
    }
        }
    }
        if(moved)this.randomInitTile();   
    }

    /**
    * Finds the downmost position that the current cell can shift to
    * @param {number} currRow 
    * @param {number} currCol 
    */
    farthestCellDown(currRow,currCol){
    while(currRow<=GRIDSIZE-1 && this.board[currRow][currCol]===null){
        currRow ++;
    }
    return currRow;
    }

    /**
     * Insert a block to the board 
     * @param {number} x x pos
     * @param {number} y y pos
     */
    append(x, y) {
        const tile = `<div class=\"tile ${x}-${y}\"> 2 </div>`
        $(".canvas").append(tile)
        $(`.${x}-${y}`).css("transform", this.getTileCSSTransform(x,y)).val(2)
        this.changeColor(2, x, y)
    }

    double(x,y) {
        const value = $(`.${x}-${y}`).val()
        $(`.${x}-${y}`).val(value * 2);
        return value * 2
    }    

    changeColor(value, x, y) {
        var backgroundColor = "#eee4da";
            switch (value) {
                case 4:
                    backgroundColor = "#ede0c8";
                    break;
                case 8:
                    backgroundColor = "#f2b179";
                    break;
                case 16:
                    backgroundColor = "#f59563";
                    break;
                case 32:
                    backgroundColor= "#f67c5f";
                    break;
                case 64:
                    backgroundColor =  "#f65e3b";
                    break;
                case 128:
                    backgroundColor =  "#edcf72";
                    break;
                case 256:
                    backgroundColor =  "#edcc61";
                    break;
                case 512:
                    backgroundColor =  "#edc850";   
                    break;
                case 1024:
                    backgroundColor =  "#edc53f"; 
                    break;
                case 2048:
                    backgroundColor =  "#edc22e";    
                    break;
                default:
                    backgroundColor = "#eee4da";
                    break;
            }
            $(`.${x}-${y}`).css({'background': backgroundColor});
            
    }

    // Helpers
    getRandomInt() {
        return Math.floor(Math.random() * GRIDSIZE)
    }

    isOccupied(x, y) {
        return this.board[y][x] !== null 
    }

    getTileCSSTransform(x, y) {
        return `translate(${x * 100 + (x+1)*10}px, ${y * 100 + (y+1)*10}px)`
    }

    delay() {
        let due = new Date().getTime() + 100
        while (new Date().getTime() < due) {}
    }
}

/**
 * Runs the application,
 *  dynamically insert blocks to the canvas,
 *  apply event listeners to keys/btns etc
 */
function run() {
    renderGrid()
    let g = new Board()
    bindKeys(g)
    g.start()
}

/**
 * Renders grid system according to GRIDSIZE
 *  a GRIDSIZE * GRIDSIZE number of blocks will be appended to canvas,
 *  with proper classnames corresponding to the grid 
 */
const renderGrid = () => {
    for (let row = 0; row < GRIDSIZE; ++row) {
        for (let col = 0; col < GRIDSIZE; ++col) {
            const block = renderBlock(row, col)
            $(".canvas").append(block)
        }
    }
}

/**
 * Add Event Handling to the app,
 *  events will include pause, moving etc
 */
const bindKeys = (board) => {
    window.addEventListener('keydown', function(evt){
        if (evt.keyCode === 37) {
            console.log("left key pressed");
            board.moveLeft();
         } else if (evt.keyCode === 39) {
            console.log("right key pressed");
            board.moveRight();
         } else if (evt.keyCode === 38){
            console.log("up key pressed");
            board.moveUp();
         } else if (evt.keyCode === 40){
            console.log("down key pressed");
            board.moveDown();
         }
    });
}

/**
 * Renders a block based on row and col given
 * @param {number} row curr row
 * @param {number} col curr columne
 * @returns a string html of that block
 */
const renderBlock = (row, col) => {
    const rowStyle = `grid-row: ${row+1} / ${row+2}`
    const colStyle = `grid-column: ${col+1} / ${col+2}`
    return `<div class="row-${row} col-${col} cell" style="${rowStyle}; ${colStyle}"></div>`
}


$(document).ready(run)/** starts everything */