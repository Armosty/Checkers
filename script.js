// States:
// 0 - empty
// 1 - white
// 2 - black
// 3 - current player can attack
// 4 - current player can make step
// 10 - white mother
// 20 - black mother

function makeTable()
{
    var table = document.createElement("table");
    var tableFill = "<tbody>";
    for(var i = 0; i < TH; i++)
    {
        tableFill += "<tr>"
        for(var j = 0; j < TW; j++)
        {
            tableFill += "<td id='" + i + j + "'></td>";
        }
        tableFill += "</tr>";
    }
    tableFill += "</tbody>";
    table.innerHTML = tableFill;
    document.body.appendChild(table);
}

function makeConditionTable()
{
    if(document.getElementById("condDiv"))
        document.getElementById("condDiv").remove();

    var currPlayer = (step % 2) + 1;
    var currimage = currPlayer === 1 ? "white" : "black";
    var fillString;

    var div = document.createElement("div");
    //div.width = "200px";
    div.id = "condDiv";
    div.style.position = "absolute";
    div.style.left = (TW * 50 + 100) + "px";
    div.style.top = "5px";
    div.style.borderLeft = "1px solid black";
    div.style.backgroundColor = "#ececec";
    div.align = "center";
    fillString = "<p>Текущий ход:</p>";
    fillString += "<img src='" + directory + currimage + ".png' />";
    if(checkAllBattle(step))
        fillString += "<p>Бой<br>обязателен!</p>";
    div.innerHTML = fillString;
    document.body.appendChild(div);
}

function makeScoreBlock()
{
    if(document.getElementById('score'))
        document.getElementById('score').remove();

    var div = document.createElement("div");
    div.id = "score";
    div.align = "center";
    div.style.position = "absolute";
    div.style.left = (TW * 50 + 100) + "px";
    div.style.top = "200px";
    div.style.backgroundColor = "#ececec";
    div.innerHTML = "<figure><img src='" + directory + "white.png'><figcaption>" + white +"</figcaption></figure>";
    div.innerHTML += "<figure><img src='" + directory + "black.png'><figcaption>" + black +"</figcaption></figure>";
    document.body.appendChild(div);
}

function makeWinBlock(winString)
{
    var div = document.createElement("div");
    div.id = "winBlock";
    div.style.position = "absolute";
    div.style.left = (TW * 50 + 100) + "px";
    div.style.top = "300px";
    div.align = "center";
    div.innerHTML = "<p>" + winString + "</p>";
    var button = document.createElement("input");
    button.id = "reset";
    button.type = "button";
    button.value = "Новая игра";
    button.setAttribute('onclick', 'reset()');
    div.appendChild(button);
    document.body.appendChild(div);
}

function draw()
{
    for(var i = 0; i < arr.length; i++)
    {
        for(var j = 0; j < arr[i].length; j++)
        {
            var currentData = document.getElementById("" + i + j);
            currentData.style.opacity = "1";
            switch(arr[i][j])
            {
                case 0:
                    currentData.innerHTML = "";
                    if((i + j) % 2 === 1)
                        currentData.style.backgroundColor = BLACKCELLS;
                    else
                        currentData.style.backgroundColor = WHITECELLS;
                    break;
                case 1:
                    currentData.innerHTML = "<img src='" + directory + "white.png' />";
                    if((i + j) % 2 === 1)
                        currentData.style.backgroundColor = BLACKCELLS;
                    else
                        currentData.style.backgroundColor = WHITECELLS;
                    break;
                case 2:
                    currentData.innerHTML = "<img src='" + directory + "black.png' />";
                    if((i + j) % 2 === 1)
                        currentData.style.backgroundColor = BLACKCELLS;
                    else
                        currentData.style.backgroundColor = WHITECELLS;
                    break;
                case 3:
                    currentData.innerHTML = "";
                    currentData.style.backgroundColor = "red";
                    break;
                case 4:
                    currentData.innerHTML = "";
                    currentData.style.backgroundColor = "green";
                    break;
                case 10:
                    currentData.innerHTML = "<img src='" + directory + "whitequeen.png' />";
                    if((i + j) % 2 === 1)
                        currentData.style.backgroundColor = BLACKCELLS;
                    else
                        currentData.style.backgroundColor = WHITECELLS;
                    break;
                case 20:
                    currentData.innerHTML = "<img src='" + directory + "blackqueen.png' />";
                    if((i + j) % 2 === 1)
                        currentData.style.backgroundColor = BLACKCELLS;
                    else
                        currentData.style.backgroundColor = WHITECELLS;
                    break;

            }
        }
    }
    if(chasedChecker)
        document.getElementById(chasedChecker).style.opacity = "0.5";
}

function fillBoard()
{
    arr = [];
    for(var i = 0; i < TH; i++)
    {
        arr.push([]);
        for(var j = 0; j < TW; j++)
        {
            if(i < 3)
            {
                if((i + j) % 2 === 1)
                    arr[i].push(2);
                else
                    arr[i].push(0);
            }
            else if(i > TH - 4)
            {
                if((i + j) % 2 === 1)
                    arr[i].push(1);
                else
                    arr[i].push(0);
            }
            else
                arr[i].push(0);
        }
    }
}

function events()
{
    var tds = document.getElementsByTagName('td');
    for(var k = 0; k < tds.length; k++)
    {
        tds[k].onclick = function() {
            if(isGame)
            {
                var id = this.id;
                var i = +id[0];
                var j = +id[1];
                var currGamer = (step % 2) + 1;
                if (chasedChecker !== id && (arr[i][j] === currGamer || arr[i][j] === currGamer * 10)) {
                    chasedChecker = id;
                    clearBoard();
                }
                if ((!chasedChecker || chasedChecker === id) && (arr[i][j] === currGamer || arr[i][j] === currGamer * 10)) {
                    chasedChecker = id;
                    var isDanger = checkAllBattle(step);
                    if (isDanger) {
                        var battle = checkBattle(id);
                        fillBattles(battle);
                    }
                    else {
                        var steps = checkSteps(id);
                        fillSteps(steps);
                    }
                }
                if (chasedChecker && arr[i][j] === 3) {
                    chasedChecker = beatChecker(id);
                    var battleAgain = checkBattle(chasedChecker);
                    if (battleAgain === false) {
                        chasedChecker = "";
                        step++;
                    }
                    else {
                        fillBattles(battleAgain);
                    }
                }
                if (chasedChecker && arr[i][j] === 4) {
                    moveChecker(id);
                }
                var endGame;
                if (endGame = checkWin()) {
                    makeWinBlock(endGame);
                    isGame = false;
                }
                makeConditionTable();
                draw();
            }
        }
    }
}

function reset()
{
    document.getElementById("winBlock").remove();
    step = 0;
    chasedChecker = "";
    isGame = true;
    fillBoard();
    makeConditionTable();
    makeScoreBlock();
    draw();
    events();
}

function checkAllBattle(step)
{
    var currGamer = (step % 2) + 1;
    var opponent = currGamer === 1 ? 2 : 1;
    for(var i = 0; i < arr.length; i++)
    {
        for(var j = 0; j < arr[i].length; j++)
        {
            if(arr[i][j] === currGamer)
            {
                if(arr[i - 2] && (arr[i - 1][j - 1] === opponent || arr[i - 1][j - 1] === opponent * 10) && (arr[i - 2][j - 2] === 0 || arr[i - 2][j - 2] === 3)
                || arr[i - 2] && (arr[i - 1][j + 1] === opponent || arr[i - 1][j + 1] === opponent * 10) && (arr[i - 2][j + 2] === 0 || arr[i - 2][j + 2] === 3)
                || arr[i + 2] && (arr[i + 1][j - 1] === opponent || arr[i + 1][j - 1] === opponent * 10) && (arr[i + 2][j - 2] === 0 || arr[i + 2][j - 2] === 3)
                || arr[i + 2] && (arr[i + 1][j + 1] === opponent || arr[i + 1][j + 1] === opponent * 10) && (arr[i + 2][j + 2] === 0 || arr[i + 2][j + 2] === 3))
                    return true;
            }
            if(arr[i][j] === currGamer * 10)
            {
                var ii = i, jj = j;
                do
                {
                    if(arr[ii - 2]
                        && (arr[ii - 1][jj - 1] === opponent || arr[ii - 1][jj - 1] === opponent * 10)
                        && (arr[ii - 2][jj - 2] === 0 || arr[ii - 2][jj - 2] === 3))
                        return true;
                    ii--;
                    jj--;
                }
                while(arr[ii] && arr[ii][jj] === 0);
                ii = i, jj = j;
                do
                {
                    if(arr[ii - 2]
                        && (arr[ii - 1][jj + 1] === opponent || arr[ii - 1][jj + 1] === opponent * 10)
                        && (arr[ii - 2][jj + 2] === 0 || arr[ii - 2][jj + 2] === 3))
                        return true;
                    ii--;
                    jj++;
                }
                while(arr[ii] && arr[ii][jj] === 0);
                ii = i, jj = j;
                do
                {
                    if(arr[ii + 2]
                        && (arr[ii + 1][jj - 1] === opponent || arr[ii + 1][jj - 1] === opponent * 10)
                        && (arr[ii + 2][jj - 2] === 0 || arr[ii + 2][jj - 2] === 3))
                        return true;
                    ii++;
                    jj--;
                }
                while(arr[ii] && arr[ii][jj] === 0);
                ii = i, jj = j;
                do
                {
                    if(arr[ii + 2]
                        && (arr[ii + 1][jj + 1] === opponent || arr[ii + 1][jj + 1] === opponent * 10)
                        && (arr[ii + 2][jj + 2] === 0 || arr[ii + 2][jj + 2] === 3))
                        return true;
                    ii++;
                    jj++;
                }
                while(arr[ii] && arr[ii][jj] === 0);
            }
        }
    }
    return false;
}

function checkBattle(id)
{
    var currGamer = (step % 2) + 1;
    var opponent = currGamer === 1 ? 2 : 1;
    var battles = [];
    var i = +id[0];
    var j = +id[1];
    currGamer = arr[i][j];
    if(currGamer < 10) {
        if (arr[i - 2] && (arr[i - 1][j - 1] === opponent || arr[i - 1][j - 1] === opponent * 10) && arr[i - 2][j - 2] === 0)
            battles.push("" + (i - 2) + (j - 2));
        if (arr[i - 2] && (arr[i - 1][j + 1] === opponent || arr[i - 1][j + 1] === opponent * 10) && arr[i - 2][j + 2] === 0)
            battles.push("" + (i - 2) + (j + 2));
        if (arr[i + 2] && (arr[i + 1][j - 1] === opponent || arr[i + 1][j - 1] === opponent * 10) && arr[i + 2][j - 2] === 0)
            battles.push("" + (i + 2) + (j - 2));
        if (arr[i + 2] && (arr[i + 1][j + 1] === opponent || arr[i + 1][j + 1] === opponent * 10) && arr[i + 2][j + 2] === 0)
            battles.push("" + (i + 2) + (j + 2));
    }
    else
    {
        var ii = i, jj = j;
        var battle = false;
        do
        {
            if(arr[ii - 2]
                && (arr[ii - 1][jj - 1] === opponent || arr[ii - 1][jj - 1] === opponent * 10)
                && (arr[ii - 2][jj - 2] === 0 || arr[ii - 2][jj - 2] === 3))
            {
                battles.push("" + (ii - 2) + (jj - 2));
                ii = ii - 3, jj = jj - 3;
                battle = true;
            }
            if(battle && arr[ii] &&  arr[ii][jj] === 0)
                battles.push("" + ii + jj);
            else if(battle && arr[ii] && arr[ii][jj] !== 0)
                break;
            ii--;
            jj--;
        }
        while(arr[ii] && arr[ii][jj] === 0);
        ii = i, jj = j;
        battle = false;
        do
        {
            if(arr[ii - 2]
                && (arr[ii - 1][jj + 1] === opponent || arr[ii - 1][jj + 1] === opponent * 10)
                && (arr[ii - 2][jj + 2] === 0 || arr[ii - 2][jj + 2] === 3))
            {
                battles.push("" + (ii - 2) + (jj + 2));
                ii = ii - 3, jj = jj + 3;
                battle = true;
            }
            if(battle && arr[ii] &&  arr[ii][jj] === 0)
                battles.push("" + ii + jj);
            else if(battle && arr[ii] && arr[ii][jj] !== 0)
                break;
            ii--;
            jj++;
        }
        while(arr[ii] && arr[ii][jj] === 0);
        ii = i, jj = j;
        battle = false;
        do
        {
            if(arr[ii + 2]
                && (arr[ii + 1][jj - 1] === opponent || arr[ii + 1][jj - 1] === opponent * 10)
                && (arr[ii + 2][jj - 2] === 0 || arr[ii + 2][jj - 2] === 3))
            {
                battles.push("" + (ii + 2) + (jj - 2));
                ii = ii + 3, jj = jj - 3;
                battle = true;
            }
            if(battle && arr[ii] &&  arr[ii][jj] === 0)
                battles.push("" + ii + jj);
            else if(battle && arr[ii] && arr[ii][jj] !== 0)
                break;
            ii++;
            jj--;
        }
        while(arr[ii] && arr[ii][jj] === 0);
        ii = i, jj = j;
        battle = false;
        do
        {
            if(arr[ii + 2]
                && (arr[ii + 1][jj + 1] === opponent || arr[ii + 1][jj + 1] === opponent * 10)
                && (arr[ii + 2][jj + 2] === 0 || arr[ii + 2][jj + 2] === 3))
            {
                battles.push("" + (ii + 2) + (jj + 2));
                ii = ii + 3, jj = jj + 3;
                battle = true;
            }
            if(battle && arr[ii] && arr[ii][jj] === 0)
                battles.push("" + ii + jj);
            else if(battle && arr[ii] && arr[ii][jj] !== 0)
                break;
            ii++;
            jj++;
        }
        while(arr[ii] && arr[ii][jj] === 0);
    }
    return battles.length > 0 ? battles : false;
}
function fillBattles(battle)
{
    for(var k = 0; k < battle.length; k++)
    {
        var i = +battle[k][0];
        var j = +battle[k][1];
        arr[i][j] = 3;
    }
}

function checkSteps(id, currGamer)
{
    var steps = [];
    currGamer = currGamer || (step % 2) + 1;
    var i = +id[0];
    var j = +id[1];
    if(arr[i][j] === currGamer * 10)
    {
        var ii = i - 1, jj = j - 1;
        while (arr[ii] && (arr[ii][jj] === 0 || arr[ii][jj] === 4))
        {
            steps.push("" + ii + jj);
            ii--;
            jj--;
        }
        ii = i - 1, jj = j + 1;
        while (arr[ii] && (arr[ii][jj] === 0 || arr[ii][jj] === 4))
        {
            steps.push("" + ii + jj);
            ii--;
            jj++;
        }
        ii = i + 1, jj = j - 1;
        while (arr[ii] && (arr[ii][jj] === 0 || arr[ii][jj] === 4))
        {
            steps.push("" + ii + jj);
            ii++;
            jj--;
        }
        ii = i + 1, jj = j + 1;
        while (arr[ii] && (arr[ii][jj] === 0 || arr[ii][jj] === 4))
        {
            steps.push("" + ii + jj);
            ii++;
            jj++;
        }
    }
    else {
        if (currGamer === 1) {
            if (arr[i - 1] && (arr[i - 1][j - 1] === 0 || arr[i - 1][j - 1] === 4))
                steps.push("" + (i - 1) + (j - 1));
            if (arr[i - 1] && (arr[i - 1][j + 1] === 0 || arr[i - 1][j + 1] === 4))
                steps.push("" + (i - 1) + (j + 1));
        }
        else {
            if (arr[i + 1] && (arr[i + 1][j - 1] === 0 || arr[i + 1][j - 1] === 4))
                steps.push("" + (i + 1) + (j - 1));
            if (arr[i + 1] && (arr[i + 1][j + 1] === 0 || arr[i + 1][j + 1] === 4))
                steps.push("" + (i + 1) + (j + 1));
        }
    }
    return steps.length > 0 ? steps : false;
}
function fillSteps(steps)
{
    for(var k = 0; k < steps.length; k++)
    {
        var i = +steps[k][0];
        var j = +steps[k][1];
        arr[i][j] = 4;
    }
}

function moveChecker(id)
{
    var i = +id[0];
    var j = +id[1];
    var chasedi = +chasedChecker[0];
    var chasedj = +chasedChecker[1];
    var currentPlayer = arr[chasedi][chasedj];
    if(currentPlayer === 1 && i === 0)
        currentPlayer = 10;
    if(currentPlayer === 2 && i === TH - 1)
        currentPlayer = 20;
    arr[chasedi][chasedj] = 0;
    arr[i][j] = currentPlayer;
    for(i = 0; i < arr.length; i++)
    {
        for(j = 0; j < arr[i].length; j++)
        {
            if(arr[i][j] === 4)
                arr[i][j] = 0;
        }
    }
    chasedChecker = "";
    step++;
}

function beatChecker(id)
{
    var i = +id[0];
    var j = +id[1];
    var chasedi = +chasedChecker[0];
    var chasedj = +chasedChecker[1];
    var currentPlayer = arr[chasedi][chasedj];
    if(currentPlayer === 1 && i === 0)
        currentPlayer = 10;
    if(currentPlayer === 2 && i === TH - 1)
        currentPlayer = 20;
    arr[i][j] = currentPlayer;
    arr[chasedi][chasedj] = 0;
    var deletei, deletej;
    if(currentPlayer < 10) {
        deletei = (chasedi + i) / 2;
        deletej = (chasedj + j) / 2;
    }
    else
    {
        if(i < chasedi && j < chasedj)
        {
            var ii = chasedi, jj = chasedj;
            while(ii !== i)
            {
                if(arr[ii][jj] !== 0) {
                    deletei = ii, deletej = jj;
                    break;
                }
                ii--;
                jj--;
            }
        }
        if(i < chasedi && j > chasedj)
        {
            ii = chasedi, jj = chasedj;
            while(ii !== i)
            {
                if(arr[ii][jj] !== 0) {
                    deletei = ii, deletej = jj;
                    break;
                }
                ii--;
                jj++;
            }
        }
        if(i > chasedi && j < chasedj)
        {
            ii = chasedi, jj = chasedj;
            while(ii !== i)
            {
                if(arr[ii][jj] !== 0) {
                    deletei = ii, deletej = jj;
                    break;
                }
                ii++;
                jj--;
            }
        }
        if(i > chasedi && j > chasedj)
        {
            ii = chasedi, jj = chasedj;
            while(ii !== i)
            {
                if(arr[ii][jj] !== 0) {
                    deletei = ii, deletej = jj;
                    break;
                }
                ii++;
                jj++;
            }
        }
    }
    arr[deletei][deletej] = 0;
    for(var m = 0; m < arr.length; m++)
    {
        for(var n = 0; n < arr[m].length; n++)
        {
            if(arr[m][n] === 3)
                arr[m][n] = 0;
        }
    }
    return "" + i + j;
}

function clearBoard()
{
    for(var i = 0; i < arr.length; i++)
    {
        for(var j = 0; j < arr[i].length; j++)
        {
            if(arr[i][j] === 3 || arr[i][j] === 4)
                arr[i][j] = 0;
        }
    }
}

function checkWin()
{
    if(checkAllBattle(step))
        return false;
    if(checkAllBattle(step + 1))
        return false;
    var obj = {
        white: [0, 0],
        black: [0, 0]
    };
    for(var i = 0; i < arr.length; i++)
    {
        for(var j = 0; j < arr[i].length; j++)
        {
            if(arr[i][j] === 1 || arr[i][j] === 10)
            {
                obj.white[0]++;
                if(checkSteps("" + i + j, 1))
                    obj.white[1]++;
            }
            if(arr[i][j] === 2 || arr[i][j] === 20)
            {
                obj.black[0]++;
                if(checkSteps("" + i + j, 2))
                    obj.black[1]++;
            }
        }
    }
    if(obj.white[0] === 0)
    {
        black++;
        return "Черные выиграли!";
    }
    if(obj.black[0] === 0)
    {
        white++;
        return "Белые выиграли!";
    }
    if(obj.white[1] === 0 && obj.black[1] === 0)
    {
        if(obj.white[0] > obj.black[0]) {
            white++;
            return "Белые выиграли!";
        }
        else if(obj.white[0] < obj.black[0]) {
            black++;
            return "Черные выиграли!";
        }
        else {
            return "Ничья!";
        }
    }
    var currPlayer = (step % 2) + 1;
    if((currPlayer === 1 || currPlayer === 10) && obj.white[1] === 0)
        step++;
    if((currPlayer === 2 || currPlayer === 20) && obj.black[1] === 0)
        step++;
    return false;
}

//Themes object
// [0] - way to theme, [1] - white cell color, [2] - black cells color

var theme = {
      common: ["common", "#ffe577", "#bd6400"],
      pink: ["pink", "#ffd2ec", "#ff7cd4"]
};
var currTheme = "common";
var directory = theme[currTheme][0] + "/";

var TW = 8;
var TH = 8;
var WHITECELLS = theme[currTheme][1];
var BLACKCELLS = theme[currTheme][2];
var step = 0;
var chasedChecker = "";
var isGame = true;
var white = 0, black = 0;
makeTable();
var arr = [];
fillBoard();
makeConditionTable();
makeScoreBlock();
draw();
events();