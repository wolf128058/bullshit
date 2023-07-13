const urlParams = new URLSearchParams(window.location.search);
const size = 24;

function decompressDecimal(compressedString) {
    let digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    if (!compressedString) {
        throw new Error('Ungültiger komprimierter String');
    }

    let base = digits.length;
    let decompressedInteger = 0;

    for (let i = 0; i < compressedString.length; i++) {
        let char = compressedString.charAt(i);
        let digit = digits.indexOf(char);

        if (digit === -1) {
            throw new Error('Ungültiges Zeichen im komprimierten String');
        }
        decompressedInteger = decompressedInteger * base + digit;
    }
    return decompressedInteger;
}

let check = decompressDecimal(urlParams.get('check'));
let binary = '';

window.addEventListener("load", function () {
    let svgObject = document.getElementById('bingoboard');

    while (check > 0) {
        if (check & 1) {
            binary = "1" + binary;
        } else {
            binary = "0" + binary;
        }
        check = check >> 1;
    }
    binary = String(binary);
    while (binary.length < size) binary = "0" + binary;

    for (let i = 0; i < binary.length; i++) {
        mypos = binary.charAt(i);
        if (mypos == '1') {
            mycell = svgObject.getElementById('cell' + (i + 1));
            mycell.setAttribute('style', 'fill:#008080');
        }
    }
});
