// ##############################################################################
'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputString += inputStdin;
});

process.stdin.on('end', _ => {
    inputString = inputString.trim().split('\n').map(string => {
        return string.trim();
    });

    main();
});

// this function will help in taking input
function readline() {
    return inputString[currentLine++];
}
// ##############################################################################
// Make a Snippet for the code above this and then write your logic in main();

function main() {
    // remember in our platform for a test case a input is given as a single line
    // hence readline() will give whole input in a space seperated string
    /** @type {Array} - num is an array of integers */
    const num = readline().split(" ").map(int => parseInt(int));
    let currentInt = 0;
    const getNextInt = () => num[currentInt++];

    const n = getNextInt();
    const arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(getNextInt());
    }
    const k = getNextInt();
    const ans = binarySearch(arr, 0, n - 1, k);
    console.log(ans);
}

function binarySearch(arr, first, last, key) {
    let mid = Math.floor((first + last) / 2);
    while (first <= last) {
        if (arr[mid] < key) {
            first = mid + 1;
        } else if (arr[mid] == key) {
            return mid;
        } else {
            last = mid - 1;
        }
        mid = Math.floor((first + last) / 2);
    }
    return -1;
}
