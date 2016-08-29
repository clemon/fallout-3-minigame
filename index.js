let prompt = require("prompt");
let fs = require("fs");

// config vars
let clusterSize = 3;
let answerVisible = false;
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

// preprocess data: dictionary where keys are length number
let lengthDict = {};
fs.readFileSync("words.txt").toString().split("\r\n").forEach((line) => {

    // dont record words outside of length requirement (4-15 letters)
    if(line.length < 4 || line.length > 15) { return; }

    if(lengthDict[line.length])
        lengthDict[line.length].push(line.toLowerCase());
    else
        lengthDict[line.length] = [line.toLowerCase()];

});

let diffProps = {
    name: "difficulty",
    pattern: /[1-5]/,
    description: "Difficulty (1-5)? ",
    required: true
};

// user prompt
prompt.start();
prompt.get([diffProps], (err, res) => {

    // grab potential values from difficulty dictionary
    let numLettersArr = diffDict[res.difficulty]["numLetters"];
    let numWordsArr = diffDict[res.difficulty]["numWords"];

    // randomly choose from the potential values
    let numLetters = randElem(numLettersArr);
    let numWords = randElem(numWordsArr);

    let chosenWords = [];
    let numClusters = parseInt(numWords/clusterSize);   // number of similar word clusters
    let remainder = numWords % clusterSize;             // number of extra words to meet length requirement
    let potentialWords = lengthDict[numLetters];        // all words of the chosen length

    // add clusters to the list
    for (let i = 0; i < numClusters; i++) {

        // pick random word to start the cluster
        let clusterStart = randElem(potentialWords);
        // find all similar words (have enough matching letters)
        let similarWords = potentialWords.filter((word) => {
            return numMatches(word, clusterStart) > res.difficulty;
        });
        chosenWords.push(clusterStart);             // push the start word
        for (let j = 0; j < clusterSize; j++) {     // loop clusterSize times
            // pick random word from the similar list and push
            let chosenWord = randElem(similarWords);
            chosenWords.push(chosenWord);
        }
    }
    // grab the remainder words randomly
    for(let i = 0; i < remainder; i++) {
        chosenWords.push(randElem(potentialWords));
    }

    let answer = randElem(chosenWords);  // pick the answer randomly
    if (answerVisible)
        console.log(`answer: ${answer}`);

    shuffle(chosenWords);
    console.log("\n");
    chosenWords.forEach((elm) => { console.log(`  ${elm.toUpperCase()}`); });
    console.log("\n");

    promptGuess(4, chosenWords, answer);
});


///////////////////// HELPER METHODS /////////////////////

/* randIntInRange(int min, int max)
 * returns random int within inclusive range: [min, max]
 */
let randIntInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min +1)) + min;
}

/* randElem(array)
 * returns a random element within array
 */
let randElem = (array) => {
    return array[randIntInRange(0, array.length-1)];
}

/* shuffle(array o)
 * shuffles an array in place
 */
let shuffle = (o) => {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

/* numMatches(string guess, string answer)
 * returns the number of indexes that have matching chars in the guess and answer
 */
let numMatches = (guess, answer) => {
    let sum = 0;
    answerArr = answer.split("");
    answerArr.forEach((elm, idx, arr) => {
        if (elm == guess.charAt(idx))
            sum++;
    });
    return sum;
};

/* promptGuess(int limit, array words, string answer)
 * recursively called. Prompts the user for a guess and displays results
 */
let promptGuess = (limit, words, answer) => {

    if (limit == 0) {               // if you run out of guesses, the game is over
        console.log("You lose :(");
        return;
    }

    let guessProps = {
        name: "guess",
        pattern: /([A-Z]|[a-z])/,
        description: `Guess (${limit} left)? `,
        required: true
    };

    prompt.get([guessProps], (err, res) => {    // prompt for a guess

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
