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

function colorizeSvg(checkcode) {
    let check = decompressDecimal(checkcode);
    let svgObject = document.getElementById('bingoboard');

    let binary = '';
    binary = String(binary);

    while (check > 0) {
        if (check & 1) {
            binary = "1" + binary;
        } else {
            binary = "0" + binary;
        }
        check = check >> 1;
    }

    while (binary.length < size) binary = "0" + binary;

    for (let i = 0; i < binary.length; i++) {
        mypos = binary.charAt(i);
        mycell = svgObject.getElementById('cell' + (i + 1));
        if (mypos == '1') {
            mycell.setAttribute('style', 'fill:#008080');
        } else {
            mycell.setAttribute('style', 'fill:unset');
        }
    }
}

window.addEventListener("load", function () {

    let textbox = document.getElementById('checktext');
    if (urlParams.get('check')) {
        colorizeSvg(urlParams.get('check'));
        textbox.setAttribute('value', urlParams.get('check'));
    }

    document.getElementById("checktext").addEventListener("keyup", (event) => {
        if (event.isComposing || event.keyCode === 229) {
            return;
        }
        if (event.key !== undefined) {
            colorizeSvg(document.getElementById("checktext").value);
            let url = new URL(window.location.href);
            let params = new URLSearchParams(url.search);
            params.set("check", document.getElementById("checktext").value);
            url.search = params.toString();
            window.history.replaceState({}, '', url.href);
        }
    });
});
