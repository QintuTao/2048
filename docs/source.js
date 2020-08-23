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
            this.board.push(null)
        }
        this.board.map(x => {
            let arr = []
            for (let i = 0; i < GRIDSIZE; ++i) {
                arr.push(null);
            }
            return arr;
        })

        /** Binding Methods */
        this.randomInitTile = this.randomInitTile.bind(this);
        /**
         * Randomly put a number to the board to start the game 
         */
        this.randomInitTile();
    }

    /**
     * Creates a tile with value '2' at random position
     * @returns true if it is such position is not occupied by other tiles
     */
    randomInitTile() {
        
    }

    /**
     * Given the moving direction, calc the next state
     * @param {string} dir 
     */
    nextBoard(dir) {

    }
    /** UI Methods */
    move(init, des) {}

    merge(first, second, des) {}

    append(pos) {}

    double(pos) {}
}

/**
 * Runs the application,
 *  dynamically insert blocks to the canvas,
 *  apply event listeners to keys/btns etc
 */
function run() {
    console.log(2)
    renderGrid()
    bindKeys()
    let k = new Board();
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
    return `<div class="row-${row} col-${col} cell" style="${rowStyle}; ${colStyle}"> 0 </div>`
}


$(document).ready(run)/** starts everything */