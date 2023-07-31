const cells = 24;
const d = new Date();
const maxwordquota = 0.75;

const simpleHash = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }
    return new Uint32Array([hash])[0].toString(36);
};

function binArrToDec(binaryArray) {
    if (binaryArray.length === 0) {
        return null;
    }

    const binaryString = binaryArray.map(value => (value ? '1' : '0')).join('');
    const decimalNumber = parseInt(binaryString, 2);

    return decimalNumber;
}

function arrayRotate(arr, times, reverse = false) {
    for (let i = 0; i < times; i++) {
        if (reverse) {
            arr.unshift(arr.pop());
        } else {
            arr.push(arr.shift());
        }
    }
    return arr;
}

function loadWords() {
    let minutes = parseInt(d.getMinutes());
    let bullshits = words
        .split('\n')
        .filter(word => word.length > 0)
        .map(word => word.trim());

    let maxwords = Math.max(Math.round(bullshits.length * maxwordquota), cells);
    let toomuch = bullshits.length - maxwords;
    let shift = minutes % toomuch;

    let smallarray = arrayRotate(bullshits, shift, false).slice(0, maxwords);

    let randomizedWords = randomize(smallarray);
    let sortedWords = [...randomizedWords].sort();
    let wordlist = document.getElementById('wordlist');

    bullshits = bullshits.sort();
    for (let i = 0; i < bullshits.length; i++) {
        let li = document.createElement('li');
        li.innerHTML = bullshits[i];
        if (sortedWords.indexOf(bullshits[i]) != -1) {
            li.setAttribute(
                'data-hash',
                simpleHash(bullshits[i].replace('&shy;', ''))
            );
            li.setAttribute('onclick', 'liclick(this)');
        } else {
            li.setAttribute('disabled', 'true');
        }
        wordlist.appendChild(li);
    }

    let counter = 0;
    while (counter < cells) {
        currentword = randomizedWords.pop();
        gamedata['words'][simpleHash(currentword.replace('&shy;', ''))] = {};
        gamedata['words'][simpleHash(currentword.replace('&shy;', ''))][
            'word'
        ] = currentword.replace('&shy;', '');
        gamedata['words'][simpleHash(currentword.replace('&shy;', ''))][
            'clicked'
        ] = false;
        document.getElementById('cell' + counter).innerHTML =
            '<span class="word" data-hash="' +
            simpleHash(currentword.replace('&shy;', '')) +
            '">' +
            currentword +
            '</span>';
        document
            .getElementById('cell' + counter)
            .setAttribute(
                'data-hash',
                simpleHash(currentword.replace('&shy;', ''))
            );
        counter++;
    }
}

function randomize(words) {
    let randomizedWords = [];
    let tempWords = words.slice();
    let allWords = words.slice().map(item => item.replace(/&shy;/g, ''));
    let decWordlist = [];

    for (let i = 0; i < cells; i++) {
        let wordCount = tempWords.length;
        let randomIndex = Math.floor(Math.random() * wordCount);
        let randomWord = tempWords[randomIndex];

        decWordlist.push(allWords.indexOf(randomWord.replace(/&shy;/g, '')));
        gamedata['clicked2dec'] = 0;

        randomizedWords.push(randomWord);
        tempWords.splice(randomIndex, 1);

        if (tempWords.length === 0) {
            tempWords = words.slice();
        }
    }
    decWordlist = LZString.compressToEncodedURIComponent(
        JSON.stringify(decWordlist)
    );
    gamedata['wordlist'] = decWordlist;

    // decoWordlist = LZString.decompressFromEncodedURIComponent(decWordlist);
    // decoWordlist = JSON.parse(decoWordlist);
    // decoWordlist = decoWordlist.reverse();

    return randomizedWords;
}
