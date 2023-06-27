function click() {
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
        wins = [];
    if (clicks.indexOf(this.className) > 0) {
        this.title = 'Klicken um die Zelle zu markieren';
        this.className = '';
    } else {
        this.title = 'Klicken um Zellenmarkierung zu entfernen.';
        this.className = 'clicked';
    }

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
        for (let ol = 0; (g = wins[ol]); ol++) {
            for (let i = 0; i < 5; i++) {
                cells[g[0] + (i * g[1])].className = 'win';
            }
        }
    }
    if (wins.length > current_wins) {
        new Audio('/files/bingo.mp3').play();
    }
    current_wins = wins.length;
}

function enable_clicks() {
    let tbls = document.getElementsByTagName('table');
    for (let t = 0, tbl; tbl = tbls[t]; t++) {
        if (tbl.className === 'card') {
            var tds = tbl.getElementsByTagName('td');
            for (var i = 0, td; (td = tds[i]); i++) {
                td.pTable = tbl;
                if (td.className !== 'freecell') {
                    td.title = 'Klicken um die Zelle zu markieren';
                    td.onclick = click;
                }
            }
        }
    }

    if(navigator.userAgent.includes('OBS')) {
        document.getElementById('card0').style.margin = 0;
        document.getElementById('card0').style.height = '100vh';
        document.getElementById('card0').style.width = '100vw';
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
