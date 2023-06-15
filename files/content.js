const cells = 24;

function loadWords() {
    let bullshits = words.split("\n")
						 .filter(word => word.length > 0)
						 .map(word => word.trim());

    let randomizedWords = randomize(bullshits);
    let counter = 0;
	while (counter<cells) {
		document.getElementById('cell' + counter++).innerHTML = '<span class="word">' + randomizedWords.pop() + '</span>';
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
		tempWords.splice(randomIndex,1);

		if (tempWords.length==0) {
			tempWords = words.slice();
		}

	}

	return randomizedWords;
}
