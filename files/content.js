const cells = 24;

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

    const binaryString = binaryArray.map((value) => value ? '1' : '0').join('');
    const decimalNumber = parseInt(binaryString, 2);

    return decimalNumber;
}

function loadWords() {
    let bullshits = words.split("\n")
        .filter(word => word.length > 0)
        .map(word => word.trim());

    let randomizedWords = randomize(bullshits);
    let sortedWords = [...randomizedWords].sort();
    let wordlist = document.getElementById("wordlist");


    for (let i = 0; i < sortedWords.length; i++) {
        let li = document.createElement("li");
        li.innerHTML = sortedWords[i];
        li.setAttribute('data-hash', simpleHash(sortedWords[i]));
        li.setAttribute('onclick', 'liclick(this)');
        wordlist.appendChild(li);
    }


    let counter = 0;
    while (counter < cells) {
        currentword = randomizedWords.pop();
        document.getElementById('cell' + counter).innerHTML = '<span class="word" data-hash="' + simpleHash(currentword) + '">' + currentword + '</span>';
        document.getElementById('cell' + counter).setAttribute('data-hash', simpleHash(currentword));
        counter++;
    }
}

function randomize(words) {
    let randomizedWords = [];
    let tempWords = words.slice();

    for (let i = 0; i < cells; i++) {
        let wordCount = tempWords.length;
        let randomIndex = Math.floor(Math.random() * wordCount);
        let randomWord = tempWords[randomIndex];
        randomizedWords.push(randomWord);
        tempWords.splice(randomIndex, 1);

        if (tempWords.length === 0) {
            tempWords = words.slice();
        }
    }

    return randomizedWords;
}
