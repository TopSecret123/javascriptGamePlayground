//get the element
const mouseBox = document.getElementById("mouse-details");

const windowOuterW = window.outerWidth;
const windowInnerW = window.innerWidth;
const counterDisplay = document.getElementById("counter-display");
const ballContainer = document.getElementById("ball-container");
const ballArray = [];
let x = 0;
let y = 0;

let intervalId = "";

/**
 * Ball Handler has balls. Moves Balls. 
 * Ball container -> hmm who should have that. Needs to be some connection between balls and ball container. 
 * For now -> Detect collisions and knows the boundary -> refactor when necessary.
 */
class BallHandler {
	constructor () {
		this.balls = [];
		this.ballContainer = null;
	}

	addBall = (ball) => {
		this.balls.push(ball)
		ball.startMoving();
	}


	//should ballHandler be the one moving the ball or just tell the ball to move. 
	
}
/**
 * lastMove
 */
class movingBallC {
	constructor (el) {
		this.start = null;
		this.el = el
		this.xPos = this.el.getBoundingClientRect().x
		this.yPos = this.el.getBoundingClientRect().y
		this.xVel = this.initialVel();
		this.yVel = this.initialVel();
		this.xOrigin = this.el.getBoundingClientRect().x
		this.yOrigin = this.el.getBoundingClientRect().y
		this.xStart;
		this.yStart;
	}

	startMoving = () => {
		console.log("start moving")
		console.log(this)
		requestAnimationFrame(this.move)
		//requestAnimationFrame(this.move.bind(this))
	}

	initialVel = () => {
		const speed = 80 + (Math.random() * 200);
		const vel = Math.random() < 0.5 ? speed : - speed ;
		return vel;
	}

	handleCollisionAxis = (collisionPos) => {
		const {x: xPos, y: yPos} = collisionPos

		let axis;
		axis = xPos <= 0 || xPos > windowOuterW - 32 ? "x" : "y"
		switch (axis) {
			case "x":
				this.xVel = - this.xVel;
				break;
			case "y":
				this.yVel = -this.yVel;
				break;
		}
	}

	handleCollision = (surface, collisionPos) => {
		//surface options: wall
		switch (surface) {
			case "wall":
			this.handleCollisionAxis(collisionPos);
			break;
		}
		//location = object xPos yPos
	}

	determineNewPos = (axis, timestamp) => {
		const {pos, vel, start, origin} = axis;
		let elapsed = (timestamp - start) /1000
		let newPos = origin + (vel * elapsed)
		return newPos;
	}

	updatePos

	move = (timestamp) => {
		if(!this.xStart) this.xStart = timestamp;
		if(!this.yStart) this.yStart = timestamp;
		const newXPos = this.determineNewPos({pos: this.xPos, vel: this.xVel, start: this.xStart, origin: this.xOrigin}, timestamp);
		const newYPos = this.determineNewPos({pos: this.yPos, vel: this.yVel, start: this.yStart, origin: this.yOrigin}, timestamp);
		console.log(newXPos);
		console.log(newYPos);
		//Update prevMove to timestamp at end of cycle.

		this.el.style.left = newXPos + "px";
		this.el.style.top = newYPos + "px"

		/*
		if(!this.start) this.start = timestamp;
		let elapsed = (timestamp - this.start) / 1000;
		let x = elapsed * this.xVel;
		let y = elapsed * this.yVel;	
		
		//const element = document.getElementById(this.elementId)

		//the elements position - this works as expected
		const pos = this.el.getBoundingClientRect()
		const {x: xPos, y: yPos} = pos;
		
		this.el.style.transform = `translate(${x}px, ${y}px)`
		//this.el.style.transform = `translateY(${y}px)`
		if ( xPos >= 0 && xPos < window.outerWidth - 32 || 
			yPos >= 0 && yPos < window.outerHeight - 32
		) {this.handleCollision("wall", pos)}
		*/
		requestAnimationFrame(this.move);
	}

}


//console.log(window)
//console.log(document)
const updateMouseBox = (x, y) => {
	mouseBox.textContent = `window out: ${window.outerWidth} window in: ${window.innerWidth} \n\nx: ${x}  y: ${y} \n`;
};

const movingBall = document.getElementById("moving-ball")


const handleMouseMove = (event) => {
	x = event.x;
	y = event.y;
	updateMouseBox(x, y);
	//updateTargetPosition(x, y);
};


//Get the mouse coordinates.



document.addEventListener("mousemove", (event) => {
	handleMouseMove(event);
});

// Buttons - timer flashbox

const ballHandler = new BallHandler();
console.log(ballHandler)

function newBall () {
	const newDiv = document.createElement("div")
	const numChildren = ballContainer.children.length;
	newDiv.setAttribute("class", "moving-ball")
	newId = `ball-${numChildren}`;
	newDiv.setAttribute("id", newId)
	newDiv.style.left = "200px";
	newDiv.style.top = "200px";
	ballContainer.appendChild(newDiv)
	const newBallObj = new movingBallC(newDiv);
	ballHandler.addBall(newBallObj)
}


function startTimer(counterDisplay) {
	intervalId = setInterval(changeColour, 1000);
}

function stopTimer(){
	clearInterval(intervalId);
}

const changeColour = () => {
	console.log(counterDisplay);
	console.log(counterDisplay.style.backgroundColor);
	counterDisplay.style.backgroundColor =
		counterDisplay.style.backgroundColor == "red" ? "green" : "red";
};

const handleClick = (event, source) => {
	switch (source) {
		case "start":
			//startTimer(counterDisplay);
			newBall();
			break;
		case "stop":
			stopTimer(intervalId);
			break;
	}
};


const updateTargetPosition = (x, y) => {
	const xVal = `${x}px`;
	const yVal = `${y - 100}px`;
	const target = document.getElementById("target-dot");
	target.style.left = xVal;
	target.style.top = yVal;
};


// Event Listeners
document.getElementById("button").addEventListener("click", (event) => {
	handleClick(event, "start");
});
document.getElementById("stop-button").addEventListener("click", (event) => {
	handleClick(event, "stop")
})

//position = position + 2
const zero = document.timeline.currentTime;
let position = 0;
const speed = 2;
requestAnimationFrame(animate);
function animate(timestamp) {
	const value = (timestamp - zero) / duration;
}

let start;

function step(timestamp) {
	if(start == undefined) {
		start = timestamp;
	}
	const elapsed = timestamp - start;

	const shift = Math.min(0.1 * elapsed, 200);
	movingBall.style.transform = `translateX(${shift}px)`;
	if (shift < 200) {
		requestAnimationFrame(step);
	}
}
requestAnimationFrame(step);