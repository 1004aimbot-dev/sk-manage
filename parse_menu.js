const fs = require('fs');

const xml = fs.readFileSync('menu.xml', 'utf16le');
console.log("Read XML length:", xml.length);
console.log("Snippet:", xml.substring(0, 200));

// Relaxed regex to capture link as well
const regex = /name="([^"]+)"[^>]*link="([^"]+)"/g;
let match;
let count = 0;

function base64Utf8Decode(utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if ((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return string;
}

function base64Decode(input) {
    if (!input) return "";
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    }
    return base64Utf8Decode(output);
}

while ((match = regex.exec(xml)) !== null) {
    count++;
    try {
        const decodedName = base64Decode(decodeURIComponent(match[1]));
        const decodedLink = decodeURIComponent(match[2]);
        if (decodedName.includes("선교") || decodedName.includes("위원회") || decodedName.includes("전도회")) {
            console.log(`[${decodedName}] -> ${decodedLink}`);
        }
    } catch (e) {
        console.log(`Error decoding: ${e.message}`);
    }
    if (count > 100) break;
}
console.log("Total matches:", count);
