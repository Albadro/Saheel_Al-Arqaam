const rows = ["a", "b", "c", "d", "e"];
let prevSqrs = [];
let allSqrs = [];
document.querySelectorAll("main .sqr").forEach((sqr) => {
    sqr.addEventListener("click", sqrClick);
    allSqrs.push(sqr.id);
});
let possibleNexts = allSqrs;
let undoes = [];
let n = 0;

const clickAudio = new Audio("audio/click.wav");
const clickErrAudio = new Audio("audio/clickErr.wav");
const evilaughAudio = new Audio("audio/eviLaugh.mp3");
const ohhh = new Audio("audio/ohhh.mp3");

document.getElementById("reset").addEventListener("click", reset);
document.getElementById("undo").addEventListener("click", undo);
document.getElementById("redo").addEventListener("click", redo);
document.getElementById("closeLose").addEventListener("click", () => {
    closeOverlay("lose");
});
document.getElementById("tryAgain").addEventListener("click", tryAgain);
document.getElementById("closewin").addEventListener("click", () => {
    // doubled to solve an unkown-reason-problem
    closeOverlay("win");
    closeOverlay("win");
    const main = document.querySelector("main");
    const codeArticle = document.getElementById("codeArticle");
    main.appendChild(codeArticle);
});
document.getElementById("codeArticle").addEventListener("click", copyCodeText);

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
    const index = rows.indexOf(id[0]);
    const num = parseInt(id[1], 10); // you can also use the function "Number" as `const num = Number(id[1]);`
    let stNxtLetter, ndNxtLetter, stPrvLetter, ndPrvLetter;
    let possibleNexts = [];
    if (index < 4) {
        stNxtLetter = rows[index + 1];
        pusher(num, stNxtLetter, "st");
    }
    if (index < 3) {
        ndNxtLetter = rows[index + 2];
        pusher(num, ndNxtLetter, "nd");
    }
    if (index > 0) {
        stPrvLetter = rows[index - 1];
        pusher(num, stPrvLetter, "st");
    }
    if (index > 1) {
        ndPrvLetter = rows[index - 2];
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
        n++;
        if (n != 25) {
            clickAudio.play();
        }
        element.innerText = n;
        prevSqrs.push(id);
        possibleNexts = getPossibleNexts(id);
        if (n == 25) {
            let Ts = 0;
            function displayDT(element) {
                const now = new Date(),
                    year = String(now.getFullYear()).slice(-2),
                    month = String(now.getMonth() + 1).padStart(2, "0"),
                    day = String(now.getDate()).padStart(2, "0"),
                    hours = String(now.getHours()).padStart(2, "0"),
                    minutes = String(now.getMinutes()).padStart(2, "0"),
                    seconds = String(now.getSeconds()).padStart(2, "0"),
                    milliseconds = String(now.getMilliseconds()).padStart(
                        3,
                        "0"
                    ),
                    DT = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
                element.innerText = DT;
                Ts = now.getTime();
            }
            function secode() {
                let primSum = 0;
                let txTs = `${Ts}`;
                function primeCheck(num) {
                    let prime = true;
                    if (num > 1) {
                        let numSquareroot = Math.sqrt(num);
                        for (
                            let factor = 2;
                            factor < numSquareroot + 2;
                            factor++
                        ) {
                            if (num % factor == 0 && factor != num) {
                                prime = false;
                                break;
                            }
                        }
                    } else {
                        prime = false;
                    }
                    return prime;
                }
                for (let digit of txTs) {
                    intDigit = parseInt(digit);
                    if (primeCheck(intDigit)) {
                        primSum += intDigit;
                    }
                }
                return Ts * primSum;
            }
            function imageGame() {
                allSqrs.forEach((sqrId) => {
                    document.getElementById("GI" + sqrId).innerText =
                        document.getElementById(sqrId).innerText;
                });
            }
            document.head.appendChild(
                Object.assign(document.createElement("link"), {
                    rel: "stylesheet",
                    href: "style/win.css",
                })
            ); // load win.css
            ohhh.play();
            displayDT(document.getElementById("DT"));
            document.getElementById("code").innerText = secode();
            imageGame();
        } else if (possibleNexts.length === 0) {
            document.head.appendChild(
                Object.assign(document.createElement("link"), {
                    rel: "stylesheet",
                    href: "style/lose.css",
                })
            );
            evilaughAudio.play();
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
        document.getElementById(sqr).innerText = "";
    });
    prevSqrs = [];
    possibleNexts = allSqrs;
    n = 0;
}

function undo() {
    if (n > 0) {
        const lastSqr = prevSqrs.pop();
        document.getElementById(lastSqr).innerText = "";
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
function closeOverlay(file) {
    document.querySelector(`link[href="style/${file}.css"]`).remove();
}
function tryAgain() {
    closeOverlay();
    reset();
}
function copyCodeText(event) {
    const article = event.currentTarget;
    const textToCopy = Array.from(article.querySelectorAll("p"))
        .map((p) => p.textContent)
        .join("\n");
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = textToCopy;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
}
