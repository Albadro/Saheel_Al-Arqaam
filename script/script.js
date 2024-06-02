const letters = ["a", "b", "c", "d", "e"];
let prevElements = [];
let allElements = [];
document.querySelectorAll(".sqr").forEach((element) => {
    element.addEventListener("click", handleClick);
    allElements.push(element.id);
});
let possibleNexts = allElements;
let n = 1;

const clickAudio = new Audio("audio/click.wav");
const clickErrAudio = new Audio("audio/clickErr.wav");
const evilaughAudio = new Audio("audio/eviLaugh.mp3");

// the called function when a sqr is clicked
function handleClick(event) {
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
            (element) => !prevElements.includes(element)
        );
        return purePossibleNexts;
    }
    const id = event.target.id;
    const element = document.getElementById(id);
    if (possibleNexts.includes(id)) {
        clickAudio.play();
        element.innerHTML = n;
        n++;
        prevElements.push(id);
        possibleNexts = getPossibleNexts(id);
        if (n == 26) {
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
        console.log("refused!");
    }
}
