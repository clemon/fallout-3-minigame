let prompt = require("prompt");

let diffProps = {
    name: "difficulty",
    pattern: /[1-5]/,
    description: "Difficulty (1-5)? ",
    required: true
};

// preprocess data: dictionary where keys are length number
let lengthDict = {};
require("fs").readFileSync("words.txt").toString().split("\r\n").forEach((line) => {

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

    // grab potential values from difficulty dictionary
    let numLettersArr = diffDict[res.difficulty]["numLetters"];
    let numWordsArr = diffDict[res.difficulty]["numWords"];

    // randomly choose from the potential values
    let numLetters = numLettersArr[randIntInRange(0, numLettersArr.length-1)];
    let numWords = numWordsArr[randIntInRange(0, numWordsArr.length-1)];

    // choose words from the length dictionary
    let chosenWords = [];
    for(let i = 0; i < numWords; i++) {
        let potentialWords = lengthDict[numLetters]
        chosenWords.push(potentialWords[randIntInRange(0, potentialWords.length)]);
    }
    console.log(chosenWords);
    promptGuess(4, chosenWords, chosenWords[0]);
});

// Method returns the number of positions matching in the guess and answer
let numMatches = (guess, answer) => {
    let sum = 0;
    answerArr = answer.split("");
    answerArr.forEach((elm, idx, arr) => {
        if (elm == guess.charAt(idx))
            sum++;
    });
    return sum;
};


let promptGuess = (limit, words, answer) => {

    if (limit == 0) {
        console.log("You lose :(");
        return;
    }

    let guessProps = {
        name: "guess",
        pattern: /([A-Z]|[a-z])/,
        description: `Guess (${limit} left)? `,
        required: true
    };

    prompt.get([guessProps], (err, res) => {

        // if correct, present win dialogue
        if (res.guess == answer) {
            console.log(`  ${answer.length}/${answer.length} correct`);
            console.log("You win!");
            return;
        }

        // if incorrect, present num letters correct, make recursive call
        else {
            let numCorrect = numMatches(res.guess, answer);
            console.log(`  ${numCorrect}/${answer.length} correct`);
            promptGuess(limit-1, words, answer);
        }
    });
}


//TODO: vvv all this shit vvv
// shuffle the words before displaying
// pick words less randomly. find words that are more similar to the answer
    // pick answer randomly, then find words that are similar,
    // then find words that are not similar. % of words similar depends on diff
// make sure case is normalized
// make it look prettier
// make the code less of a clusterfuck
