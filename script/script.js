const letters = ["a", "b", "c", "d", "e"];
let prevSqrs = [];
let allSqrs = [];
let possibleNexts = allSqrs;
let undoes = [];
let n = 0;

const clickAudio = new Audio("audio/click.wav");
const clickErrAudio = new Audio("audio/clickErr.wav");
const evilaughAudio = new Audio("audio/eviLaugh.mp3");

document.querySelectorAll(".sqr").forEach((sqr) => {
    sqr.addEventListener("click", sqrClick);
    allSqrs.push(sqr.id);
});
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("undo").addEventListener("click", undo);
document.getElementById("redo").addEventListener("click", redo);

// the called function when a sqr is clicked

function getPossibleNexts(id) {
    function pusher(num, letter, order) {
        let jump;
        if (order == "st") {
            jump = 2;
        } else {
            jump = 1;
        }
        const up = num + jump;
        const down = num - jump;
        switch (true) {
            case num == 3 || (num % 2 == 0 && order == "nd"):
                possibleNexts.push(letter + up, letter + down);
                break;
            case num == 2 && order == "st":
                possibleNexts.push(letter + up);
                break;
            case num == 4 && order == "st":
                possibleNexts.push(letter + down);
                break;
            case num == 1:
                possibleNexts.push(letter + up);
                break;
            case num == 5:
                possibleNexts.push(letter + down);
                break;
        }
    }
    const index = letters.indexOf(id[0]);
    const num = parseInt(id[1], 10); // you can also use the function "Number" as `const num = Number(id[1]);`
    let stNxtLetter, ndNxtLetter, stPrvLetter, ndPrvLetter;
    let possibleNexts = [];
    if (index < 4) {
        stNxtLetter = letters[index + 1];
        pusher(num, stNxtLetter, "st");
    }
    if (index < 3) {
        ndNxtLetter = letters[index + 2];
        pusher(num, ndNxtLetter, "nd");
    }
    if (index > 0) {
        stPrvLetter = letters[index - 1];
        pusher(num, stPrvLetter, "st");
    }
    if (index > 1) {
        ndPrvLetter = letters[index - 2];
        pusher(num, ndPrvLetter, "nd");
    }
    const purePossibleNexts = possibleNexts.filter(
        (element) => !prevSqrs.includes(element)
    );
    return purePossibleNexts;
}
function sqrClick(event) {
    const id = event.target.id;
    const element = document.getElementById(id);
    if (possibleNexts.includes(id)) {
        clickAudio.play();
        n++;
        element.innerHTML = n;
        prevSqrs.push(id);
        possibleNexts = getPossibleNexts(id);
        if (n == 25) {
            // win animation
            // console.log("you won!");
        } else if (possibleNexts.length === 0) {
            //lose animation
            evilaughAudio.play();
            // console.log("you lost!");
        }
    } else {
        //refused animation
        clickErrAudio.play();
        // console.log("refused!");
    }
    // the following is to remove past 'undoes' when the event object is real not 'fakeEvent' from 'redo' function cuz the real event from 'addEventListener' has a 'isTrusted' property which has the vlaue True
    if (event.isTrusted) {
        undoes = [];
    }
}

function reset() {
    prevSqrs.forEach((sqr) => {
        document.getElementById(sqr).innerHTML = "";
    });
    prevSqrs = [];
    possibleNexts = allSqrs;
    n = 0;
}

function undo() {
    if (n > 0) {
        const lastSqr = prevSqrs.pop();
        document.getElementById(lastSqr).innerHTML = "";
        if (n != 1) {
            const prelastSqr = prevSqrs[prevSqrs.length - 1];
            possibleNexts = getPossibleNexts(prelastSqr);
        } else {
            possibleNexts = allSqrs;
        }
        n--;
        undoes.push(lastSqr);
    } else {
        //refused
        console.log("nothing to undo");
    }
}

function redo() {
    if (undoes.length > 0) {
        const todo = undoes.pop();
        const fakeEvent = { target: { id: todo } };
        sqrClick(fakeEvent);
    } else {
        //refused
        console.log("nothing to redo");
    }
}
