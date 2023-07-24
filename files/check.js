const urlParams = new URLSearchParams(window.location.search);
const size = 24;

function decompressDecimal(compressedString) {
    let digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let forbidden = ['12cpD', 'q2Ht', 'EddE', 'QoAY'];

    if (!compressedString) {
        document.getElementById('checktext').setAttribute('style', 'color: #ff0000');
        throw new Error('Ungültiger komprimierter String');
    }

    if (forbidden.includes(compressedString)) {
        document.getElementById('checktext').setAttribute('style', 'color: #ff0000');
        throw new Error('Verbotener String');
    }

    let base = digits.length;
    let decompressedInteger = 0;

    for (let i = 0; i < compressedString.length; i++) {
        let char = compressedString.charAt(i);
        let digit = digits.indexOf(char);

        if (digit === -1) {
            document.getElementById('checktext').setAttribute('style', 'color: #ff0000');
            throw new Error('Ungültiges Zeichen im komprimierten String');
        }
        decompressedInteger = decompressedInteger * base + digit;
    }
    document.getElementById('checktext').setAttribute('style', 'color: #000000');
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

        if (mycell == null) {
            document.getElementById('checktext').setAttribute('style', 'color: #ff0000');
            throw new Error('Zellcode zu lang!');
        } else {
            document.getElementById('checktext').setAttribute('style', 'color: #000000');
        }

        if (mypos == '1') {
            mycell.setAttribute('style', 'fill:#008080');
        } else {
            mycell.setAttribute('style', 'fill:unset');
        }
    }
}

window.addEventListener("load", function () {

    if (urlParams.get('check')) {
        colorizeSvg(urlParams.get('check'));
        document.getElementById('checktext').setAttribute('value', urlParams.get('check'));
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
