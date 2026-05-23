//Get the mouse coordinates.

document.addEventListener('mousemove', (event) =>{
    handleMouseMove(event);
})

document.getElementById("button").addEventListener('click', (event) =>{
    handleClick(event)
})

const counterDisplay = document.getElementById("counter-display")

function startTimer(counterDisplay) {
    setInterval(changeColour, 1000)
}

const changeColour = () => {
    console.log(counterDisplay)
    console.log(counterDisplay.style.backgroundColor)
    counterDisplay.style.backgroundColor = counterDisplay.style.backgroundColor == "red" ? "green" : "red";
}

const handleClick = (event) => {
    console.log(event)
    startTimer(counterDisplay)
}

let x = 0;
let y = 0;
const handleMouseMove = (event) => {
    x = event.x;
    y = event.y;
    updateMouseBox(x, y)
    updateTargetPosition(x, y)
}

//get the element
const mouseBox = document.getElementById("mouse-details")

const windowOuterW = window.outerWidth;
const windowInnerW = window.innerWidth;
//console.log(window)
//console.log(document)
const updateMouseBox = (x, y) => {
    mouseBox.textContent=`window out: ${window.outerWidth} window in: ${window.innerWidth} \n\nx: ${x}  y: ${y} \n`;
}

const updateTargetPosition = (x, y) => {
    const xVal = `${x}px`
    const yVal = `${y-100}px`
    const target = document.getElementById("target-dot");
    target.style.left = xVal;
    target.style.top = yVal;
    target.style.y = y;
}