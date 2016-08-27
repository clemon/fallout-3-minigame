let prompt = require("prompt");

let diffProps = {
    name: "difficulty",
    pattern: /[1-5]/,
    description: "Difficulty (1-5)? ",
    required: true
};

// preprocess data: dictionary where keys are length number
let lengthDict = {};
require("fs").readFileSync("words.txt").toString().split("\n")
.forEach((line) => {
    // dont record words outside of length requirement (4-15 letters)
    if(line.length < 4 || line.length > 15) { return; }

    if(lengthDict[line.length])
        lengthDict[line.length].push(line);
    else {
        lengthDict[line.length] = [line];
    }
});

// method returns random int within inclusive range: [min, max]
let randIntInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min +1)) + min;
}

// user prompt
prompt.start();
prompt.get([diffProps], (err, res) => {

    let diffDict = {
        1: { numLetters: [4,5],
             numWords: [5,6] },
        2: { numLetters: [6,7],
             numWords: [7,8] },
        3: { numLetters: [8,9,10],
             numWords: [9,10,11] },
        4: { numLetters: [11,12,13],
             numWords: [12,13] },
        5: { numLetters: [14,15],
             numWords: [14,15] }
    };




    // rng to pick from dict
    // more promptssss
});
