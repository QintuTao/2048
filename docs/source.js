/**
 * ===== ===== Constants ===== =====
 */
const GRIDSIZE = 4;

/**
 *  ===== ===== Functions ===== =====
 */

/**
 * Runs the application,
 *  dynamically insert blocks to the canvas,
 *  apply event listeners to keys/btns etc
 */
function run() {
    console.log(2)
    renderGrid()
    bindKeys()
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
    return `<div class="row-${row} col-${col} block" style="${rowStyle}; ${colStyle}"> 0 </div>`
}


$(document).ready(run)/** starts everything */