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

        /** Binding Methods */
        this.randomInitTile = this.randomInitTile.bind(this);
        this.isOccupied = this.isOccupied.bind(this);
        this.start = this.start.bind(this);
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
                setTimeout(function() {
                    $(`.tile`).remove(`.${init}-${y}`)
                }, 200)
                
            } else {
                $(`.${init}-${y}`).removeClass(`${init}-${y}`).addClass(`${des}-${y}`)
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
                $(`.${x}-${init}`).css("transform", this.getTileCSSTransform(x, des))
                setTimeout(function() {
                    $(`.tile`).remove(`.${x}-${init}`)
                }, 200)
            } else {
                $(`.${x}-${init}`).removeClass(`${x}-${init}`).addClass(`${x}-${des}`)
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
            setTimeout(function() {
                this.board[y][init] = null;
            }.bind(this), 200)
            this.board[y][des] = 2 * temp
            this.double(des,y)
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
            setTimeout(function() {
                this.board[init][x] = null
            }.bind(this), 200)
            this.board[des][x] = 2 * temp
            this.double(des,x)
            $(`.${x}-${des}`).text(this.board[des][x])
        }
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
        console.log($(`.${x}-${y}`).val())
    }

    double(x,y) {
        $(`.${x}-${y}`).val($(`.${x}-${y}`).val() * 2)
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
}

/**
 * Runs the application,
 *  dynamically insert blocks to the canvas,
 *  apply event listeners to keys/btns etc
 */
function run() {
    renderGrid()
    bindKeys()
    let g = new Board()
    // g.start()
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
const bindKeys = () => {}

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