var gamedata = {'player': undefined, 'words': {}, 'clicked2dec': 0, 'stats': {'clicked': 0, 'wins': 0}};
var lzgamedata = '';

function compressDecimal(integer) {
    let digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let compressedString = '';
    while (integer > 0) {
        let digit = integer % digits.length;
        compressedString = digits[digit] + compressedString;
        integer = Math.floor(integer / digits.length);
    }
    return compressedString;
}

function liclick(element) {
    myhash = element.getAttribute('data-hash');
    let mytd = document.querySelectorAll("td[data-hash=\"" + myhash + "\"]")[0];
    mytd.click();
}

function tdclick() {
    let gps = [
            [0, 6],
            [4, 4],
            [0, 1],
            [5, 1],
            [10, 1],
            [15, 1],
            [20, 1],
            [0, 5],
            [1, 5],
            [2, 5],
            [3, 5],
            [4, 5]
        ],
        clicks = ['freecell', 'win', 'clicked'],
        cells = this.pTable.getElementsByTagName('td'),
        myhash = this.getAttribute('data-hash');
        let myli = document.querySelectorAll("li[data-hash=\"" + myhash + "\"]")[0];

    if (clicks.indexOf(this.className) > 0) {
        this.className = '';
        myli.classList.remove('clicked');
        gamedata['words'][myhash]['clicked'] = false;
        gamedata['stats']['clicked']--;
    } else {
        this.className = 'clicked';
        myli.classList.add('clicked');
        gamedata['words'][myhash]['clicked'] = true;
        gamedata['stats']['clicked']++;
    }


    wordindex = new Array();
    for (let key in gamedata['words']) {
        wordindex.push(gamedata['words'][key]['clicked']);
    }
    gamedata['clicked2dec'] = binArrToDec(wordindex);

    wins = [];
    for (let ol = 0; (g = gps[ol]); ol++) {
        let cnt = 0;
        for (let i = 0, cell; i < 5 && (cell = cells[g[0] + (i * g[1])]); i++) {
            id = clicks.indexOf(cell.className);
            if (id >= 0) {
                cnt++;
                if (id === 1) cell.className = 'clicked';
            }
        }
        if (cnt === 5) {
            wins.push(g)
        }
    }
    if (wins.length) {
        document.getElementsByTagName('table')[0].classList.add('win');
        for (let ol = 0; (g = wins[ol]); ol++) {
            for (let i = 0; i < 5; i++) {
                cells[g[0] + (i * g[1])].className = 'win';
            }
        }
    } else {
        document.getElementsByTagName('table')[0].classList.remove('win');
    }

    gamedata['stats']['wins'] = wins.length;

    if (wins.length > current_wins) {
        new Audio('/files/bingo.mp3').play();
    }
    current_wins = wins.length;
    document.getElementById("code").innerHTML = compressDecimal(gamedata['clicked2dec']);
}

function enable_clicks() {
    let tbls = document.getElementsByTagName('table');
    for (let t = 0, tbl; tbl = tbls[t]; t++) {
        if (tbl.className === 'card') {
            var tds = tbl.getElementsByTagName('td');
            for (var i = 0, td; (td = tds[i]); i++) {
                td.pTable = tbl;
                if (td.className !== 'freecell') {
                    td.onclick = tdclick;
                }
            }
        }
    }

    if (navigator.userAgent.includes('OBS')) {
        document.getElementsByTagName('body')[0].classList.add('obs');
    }
}

function loader(func) {
    if (document.addEventListener) {
        window.addEventListener("load", func, false);
    } else if (document.attachEvent) {
        window.attachEvent("onload", func);
    } else {
        if (!window._onload_queue) {
            window._onload_queue = [];
            if (window.onload) window._onload_queue.push(window.onload);
        }
        window._onload_queue.push(func);
    }
}

current_wins = 0;
loader(enable_clicks);
