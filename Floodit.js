var n_rows = 14;
var n_cols = 14;
var start_table = new Array (n_rows);
for (var row = 0; row < n_rows; row++) {
    start_table[row] = new Array (n_cols);
}
var colours = "blue red green yellow pink purple".split (/\s+/);

/* DOM functions. */

function create_node (type, parent)
{
    var new_node = document.createElement (type);
    parent.appendChild (new_node);
    return new_node;
}

function append_text (parent, text)
{
    var text_node = document.createTextNode (text);
    clear (parent);
    parent.appendChild(text_node);
}

function get_by_id (id)
{
    var element = document.getElementById (id);
    return element;
}

function clear (element)
{
    while (element.lastChild)
        element.removeChild (element.lastChild);
}

/* Flood fill game. */

var moves;
var max_moves = 35;
var finished;

/* Alter one element of the game table to be flooded. */

function flood_element (row, col, colour)
{
    game_table[row][col].colour = colour;
    game_table[row][col].element.className = "piece "+colour;
}

function test_colour_flood (row, col, colour)

{
    if (game_table[row][col].flooded)
        return;
    if (game_table[row][col].colour == colour) {
        game_table[row][col].flooded = true;
        /* Recurse to make sure that we get any connected neighbours. */
        flood_neighbours (row, col, colour);
    }
}

function flood_neighbours (row, col, colour)
{
    if (row < n_rows - 1)
        test_colour_flood (row + 1, col, colour);
    if (row > 0)
        test_colour_flood (row - 1, col, colour);
    if (col < n_cols - 1)
        test_colour_flood (row, col + 1, colour);
    if (col > 0)
        test_colour_flood (row, col - 1, colour);
}

function all_flooded ()
{
    for (var row = 0; row < n_rows; row++) {
        for (var col = 0; col < n_cols; col++) {
            if (! game_table[row][col].flooded) {
                return false;
            }
        }
    }
    return true;
}

function flood (colour, initial)
{
    if (finished)
        return;
    var old_colour = game_table[0][0].colour;
    if (! initial && colour == old_colour)
        return;
    moves++;
    append_text (get_by_id ("moves"), moves);
    /* Change the colour of all the flooded elements. */
    for (var row = 0; row < n_rows; row++) 
        for (var col = 0; col < n_cols; col++) 
            if (game_table[row][col].flooded)
                flood_element (row, col, colour);

    /* Set flooded = true for all the neighbouring boxes with the same
       colour. */
    for (var row = 0; row < n_rows; row++)
        for (var col = 0; col < n_cols; col++)
            if (game_table[row][col].flooded)
                flood_neighbours (row, col, colour);
    if (all_flooded ()) {
        finished = true;
        if (moves <= max_moves) {
            alert ("You win.");
        } else {
            alert ("Finished, at last!");
        }
    } else if (moves == max_moves) {
        alert ("You lost.");
    }
}

function help ()
{
    alert ("Press the circle buttons to flood fill the image\n"+
           "with the colour from the top left corner. Fill the\n"+
           "entire image with the same colour in twenty-five or\n"+
           "fewer flood fills. SolveGRD solves the board by \n"+
           "greedy approach and SolveGT solves the game by \n"+
           "gametree approach.");
}

/* Create a random colour for "create_table". */

function random_colour ()
{
    var colour_no = Math.floor (Math.random () * 6);
    return colours[colour_no];
}

/* The "state of play" is stored in game_table. */

var game_table = new Array (n_rows);
for (var row = 0; row < n_rows; row++) {
    game_table[row] = new Array (n_cols);
    for (var col = 0; col < n_cols; col++) {
        game_table[row][col] = new Object ();
    }
}

/* Create the initial random table. */

function create_table ()
{
    moves = -1;
    finished = false;
    var game_table_element = get_by_id ("game-table-tbody");
    for (var row = 0; row < n_rows; row++) {
        var tr = create_node ("tr", game_table_element);
        for (var col = 0; col < n_cols; col++) {
            var td = create_node ("td", tr);
            var colour = random_colour ();
            td.className = "piece " + colour;
            game_table[row][col].colour = colour;
            start_table[row][col] = colour;
            game_table[row][col].element = td;
            game_table[row][col].flooded = false;
        }
    }
    /* Mark the first element of the table as flooded. */
    game_table[0][0].flooded = true;
    /* Initialize the adjacent elements with the same colour to be flooded
       from the outset. */
    flood (game_table[0][0].colour, true);
    append_text (get_by_id("max-moves"), max_moves);
}

function new_game ()
{
    clear (get_by_id ("game-table-tbody"));
    create_table ();
}

/**
 * Returns the neighbours of a block.
 * 
 * @param {Integer} i
 * @param {Integer} j 
 */
function neighbours(i,j){
    var ns = [];
    if (13 > i) 
        ns.push([i+1,j]);
    if(13 > j) 
        ns.push([i,j+1]);
    if(i > 0) 
        ns.push([i-1,j]);
    if(j > 0) 
        ns.push([i,j-1]);
    return ns;
}

/**
 * Finds the neighbours of flooded area by using BFS. Returns the count of 
 * specified colored neighbours.
 * 
 * @param {String} colour 
 */
function getNumNeighbours(colour){
    var visited = new Array(14);
    //Initialize visited by filling it false.
    for(var i = 0; i < 14; i++){
        visited[i] = new Array(14);
        for(var j = 0; j < 14; j++){
            visited[i][j] = false;
        }
    }
    visited[0][0] = true;
    var queue = [[0,0]];
    var numNeighbours = 0;
    while(queue.length > 0){
        var location = queue.shift();
        var ns = neighbours(location[0],location[1]);
        for(i = 0; i < ns.length; i++){
            var neighbour = ns[i];
            if(!visited[neighbour[0]][neighbour[1]] && (game_table[neighbour[0]][neighbour[1]].colour == game_table[location[0]][location[1]].colour || game_table[neighbour[0]][neighbour[1]].colour == colour)){
                visited[neighbour[0]][neighbour[1]] = true;
                queue.push(neighbour);
            }
            if(game_table[neighbour[0]][neighbour[1]].colour == colour && colour != game_table[0][0].colour){
                numNeighbours++;
            }
        }
    }
    return numNeighbours;
}

/**
 * Returns best greedy move. It is simply the most crowded neighbour colour.
 */
function getGreedyMove(){
    var bestMove = game_table[0][0].colour;
    var bestScore = 0;
    for(var i = 0; i < 6; i++){
        var score = getNumNeighbours(colours[i]);
        if(score > bestScore){
            bestScore = score;
            bestMove = colours[i];
        }
    }
    return bestMove;
}

/**
 * Solves the board by greedy approach.
 */
async function solveGreedy(){
    for(var i = 0; i < max_moves && !all_flooded(); i++){
        var move = getGreedyMove();
        console.log(move);
        switch(move){
            case "blue":
                document.getElementById("blue").click();
                break;
            case "red":
                document.getElementById("red").click();
                break;
            case "green":
                document.getElementById("green").click();
                break;
            case "yellow":
                document.getElementById("yellow").click();
                break;
            case "pink":
                document.getElementById("pink").click();
                break;
            case "purple":
                document.getElementById("purple").click();
                break;
        }
        await sleep(100); //Sleeping 100 ms every click so we can watch the magic.
    }
}

/**
 * Returns the next move for gametree approach. Tries all six colors and chooses the one
 * with most points.
 */
function getGametreeMove(){
    var move = game_table[0][0];
    var bestScore = 0;
    for(var i = 0; i < 6; i++){
        var score = tree(game_table, 0, 3, colours[i], 0);
        if(score > bestScore){
            bestScore = score;
            move = colours[i];
        }
    }
    return move;
}

/**
 * Creates a tree with all possible colors. Checks its neighbour count then returns the best score.
 * 
 * @param {Array} table 
 * @param {Integer} depth 
 * @param {Integer} targetDepth 
 * @param {String} colour 
 * @param {Integer} score 
 */
function tree(table, depth, targetDepth, colour, score){
    var board = JSON.parse(JSON.stringify(table));
    if(depth == targetDepth || all_flooded()){
        return score;
    }else {
        score += getNumNeighbours(colour);
        score--;
        floodTable(board, colour);
        return Math.max(tree(board, depth+1,targetDepth,"blue",score),tree(board, depth+1, targetDepth, "red" ,score),tree(board, depth+1, targetDepth, "green" ,score),tree(board, depth+1, targetDepth, "yellow" ,score),tree(board, depth+1, targetDepth, "purple" ,score),tree(board, depth+1, targetDepth, "pink" ,score));
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Solves the game by gametree approach.
 */
async function solveGameTree(){
    while(!all_flooded()){
        var move = getGametreeMove();
        console.log(move);
        switch(move){
        case "blue":
            document.getElementById("blue").click();
            break;
        case "red":
            document.getElementById("red").click();
            break;
        case "green":
            document.getElementById("green").click();
            break;
        case "yellow":
            document.getElementById("yellow").click();
            break;
        case "pink":
            document.getElementById("pink").click();
            break;
        case "purple":
            document.getElementById("purple").click();
            break;
        }
        await sleep(10);
    }
}

/**
 * Solves the game by naive approach, clicking numbers sequentially.
 */
async function solveNaive(){
    for(var i = 0; !all_flooded();i++){
        var move = colours[i % 6]
        console.log(move);
        switch(move){
        case "blue":
            document.getElementById("blue").click();
            break;
        case "red":
            document.getElementById("red").click();
            break;
        case "green":
            document.getElementById("green").click();
            break;
        case "yellow":
            document.getElementById("yellow").click();
            break;
        case "pink":
            document.getElementById("pink").click();
            break;
        case "purple":
            document.getElementById("purple").click();
            break;
        }
        await sleep(100);
    }
}

/**
 * Below functions are the same as the ones created by original author of the game.
 * However I needed pure functions to implement gametree so I modified them.
 * Only difference is they dont modify global game_table, they use what they imported for it.
 */
function floodTable (table, colour, initial)
{
    if (finished)
        return;
    var old_colour = table[0][0].colour;
    if (! initial && colour == old_colour)
        return;
    /* Change the colour of all the flooded elements. */
    for (var row = 0; row < n_rows; row++) 
        for (var col = 0; col < n_cols; col++) 
            if (table[row][col].flooded)
                flood_table_element (row, col, colour,table);

    /* Set flooded = true for all the neighbouring boxes with the same
       colour. */
    for (var row = 0; row < n_rows; row++)
        for (var col = 0; col < n_cols; col++)
            if (table[row][col].flooded)
                flood_table_neighbours (row, col, colour,table);
}

function flood_table_element (row, col, colour, table)
{
    table[row][col].colour = colour;
    table[row][col].element.className = "piece "+colour;
}

function test_colour_table_flood (row, col, colour, table)

{
    if (table[row][col].flooded)
        return;
    if (table[row][col].colour == colour) {
        table[row][col].flooded = true;
        /* Recurse to make sure that we get any connected neighbours. */
        flood_table_neighbours (row, col, colour,table);
    }
}

function flood_table_neighbours (row, col, colour,table)
{
    if (row < n_rows - 1)
        test_colour_table_flood (row + 1, col, colour,table);
    if (row > 0)
        test_colour_table_flood (row - 1, col, colour,table);
    if (col < n_cols - 1)
        test_colour_table_flood (row, col + 1, colour,table);
    if (col > 0)
        test_colour_table_flood (row, col - 1, colour,table);
}

