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
 * CollisionManager
 */
class CollisionManager {
	constructor (balls, container, timestamp) {
		this.balls = balls;
		this.container = container;
		this.timestamp = timestamp;
		this.collisionCards = [];
	}

	//resolve collisions.
		//Detect collision. 
		//Determine new velocities
		//Give ball new velocity.

		resolveCollisions = () => {
			//for each ball.
			//detect collision.
				//if true 
					//find first collision.
					//get velocities of each.
					//update velocities accordingly
			//create new array so I can pop off if true.
			this.balls.forEach((ball) => {
				this.detectCollision(ball, this.container, this.timestamp) // boolean says yes true.
				
			})
		}

	detectCollision = (ball, container, timestamp) => {
		//getting ball center location.
		//going through rest of balls.
		//But avoid double checking otherwise ball1 will resolve and then ball 4 will undo the resolve.
		//Wall collision first
		
		
		const {left, top, width, height} = ball.el.getBoundingClientRect()
		//Find the exact mid point of circle on both x and y plane
		const xMid = left + (0.5 * width)
		const yMid = top + (0.5 * height)
		//exact circle so radius = 1/2 diam which is 1/2 width (or height)
		const radius = 0.5 * width
		//wall is simple -> just radius vs wall x or y 
		
		const {left: wLeft, top: wTop, right: wRight, bottom: wBottom} = container.getBoundingClientRect()
		const bounds = container.getBoundingClientRect()
		
		console.log("wLeft")
		console.log(wLeft)
		//check each four walls.
		//create wallObj just in case of collision (not optimal but not big problem.)
		const wall = {mass: Infinity, xVel: 0, yVel: 0, }
		console.log("xMid");
		console.log(xMid)
		console.log(radius)
		console.log(left)
		if((xMid - radius) <= wLeft ) {
			//Need to add collision location.
			this.collisionCards.push(new CollisionCard(ball, wall, "x", wLeft));
			console.log(this.collisionCards)
			//ball.setXVel(-ball.xVel)
			//ball.xOrigin = wLeft;
			//ball.xStart = timestamp;
		}
		if((xMid + radius) > wRight) {
			this.collisionCards.push(new CollisionCard(ball, wall, "x", wRight));
		}
		if((yMid - radius) <= wTop) {
			this.collisionCards.push(new CollisionCard(ball, wall, "y", wTop));
		}
		if((yMid + radius) >= wBottom) {
			this.collisionCards.push(new CollisionCard(ball, wall, "y", wBottom));
		}
		console.log("Cards Length")
		console.log(this.collisionCards.length)
		if(this.collisionCards.length == 0) {
			console.log("No cards")
		}
		else {
			this.collisionCards.forEach((card) => this.updateVelocity(card))
		}
		
	}

	updateVelocity = (card) => {
		console.log("updateVel")
		const {obj1, obj2, collisionAxis: axis, location} = card
		if(axis == "x") {
			//console.log(`${obj1.el.id} x collision | vel before: ${obj1.getXVel()} | vel after: ${-obj1.getXVel()}`)
			obj1.setXVel(-obj1.getXVel());
			obj1.setXStart(this.timestamp);
			if(location < 100) {
				obj1.setXOrigin(location + obj1.radius + 5)
			}
			else {
				obj1.setXOrigin(location - obj1.radius - 5)
			}
				
			//obj1.setXOrigin(obj2.getXPos());
		}
		if(axis == "y") {
			//console.log(`${obj1.el.id} y collision | vel before: ${obj1.getYVel()} | vel after: ${-obj1.getYVel()}`)
			obj1.setYVel(-obj1.getYVel());
			obj1.setYStart(this.timestamp);
			obj1.setYOrigin(obj1.getYPos());
		}
	}


}

//interfect obj 1 and obj2 (mass, xVel, yVel)
//if mass is infinite then must be call.
class CollisionCard {
	constructor (obj1, obj2, collisionAxis, collisionLocation) {
		this.obj1 = obj1;
		this.obj2 = obj2;
		this.collisionAxis = collisionAxis;
		this.location = collisionLocation;
	}
	//Each object must have an element
	//For now we will just clash with wall.
	//Eventually use Collision Card to crash with other balls so need to include colliding object type.
}

/**
 * Ball Handler has balls. Moves Balls. 
 * Ball container -> hmm who should have that. Needs to be some connection between balls and ball container. 
 * For now -> Detect collisions and knows the boundary -> refactor when necessary.
 */
class BallHandler {
	constructor () {
		this.balls = [];
		this.ballContainer = ballContainer;
		this.flag = false;
	}

	addBall = (ball) => {
		this.balls.push(ball)
		if(this.balls.length == 1 ) this.startMoving();
	}

	resolveCollisions = (timestamp) => {
		console.log(this.ballContainer)
		const collisionManager = new CollisionManager(this.balls, this.ballContainer, timestamp);
		collisionManager.resolveCollisions();
	}

	moveBalls = (timestamp) => {
		 
		this.balls.forEach((ball) => {
			ball.move(timestamp)
		})
		this.resolveCollisions(timestamp);
		if(!this.flag) requestAnimationFrame(this.moveBalls)
	
	}

	startMoving = () => {
		requestAnimationFrame(this.moveBalls)
	}

	containerBounds = () => {
		return this.ballContainer.getBoundingClientRect();
	}

	newBall = () => {
		const {top, right, left, bottom} = this.containerBounds();
		console.log(this.containerBounds())
		//Create new div and set tags.
		const newDiv = document.createElement("div")
		const numBalls = this.balls.length;
		const newId = `ball-${numBalls}`;
		newDiv.setAttribute("class", "moving-ball")
		newDiv.setAttribute("id", newId)
		//Set positioning
		newDiv.style.left = left + 400 + "px";
		newDiv.style.top = top + 400 + "px";
		//add Div and Ball to their homes (html and js)
		this.ballContainer.appendChild(newDiv)
		this.addBall(new MovingBall(newDiv))
		//if(this.balls.length == 1) this.startMoving();
	}


	//should ballHandler be the one moving the ball or just tell the ball to move. 
	
}
/**
 * lastMove
 */
class MovingBall {
	constructor (el) {
		this.start = null;
		this.el = el
		this.xPos = this.el.getBoundingClientRect().x
		this.yPos = this.el.getBoundingClientRect().y
		this.xVel =  this.initialVel();
		this.yVel =  this.initialVel();
		this.xOrigin = this.el.getBoundingClientRect().x
		this.yOrigin = this.el.getBoundingClientRect().y
		this.xStart;
		this.yStart;
		this.mass = 1;
		this.radius = this.el.getBoundingClientRect().width * 0.5
	}
	
	setXVel = (xVel) => {
		this.xVel = xVel;
	}

	setXOrigin = (xOrigin) =>{
		this.xOrigin = xOrigin;
	}

	setXStart = (xStart) => {
		this.xStart = xStart;
	}

	setYOrigin = (yOrigin) => {
		this.yOrigin = yOrigin;
	}

	setYStart = (yStart) => {
		this.yStart = yStart;
	}

	setYVel = (yVel) => {
		this.yVel = yVel;
	}

	getVelocity = () => {
		return {xVel: this.xVel, yVel: this.yVel};
	}

	getXVel = () => {
		return this.xVel;
	}

	getYVel = () => {
		return this.yVel;
	}

	getXPos = () => {
		return this.xPos;
	}

	getYPos = () => {
		return this.yPos;
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
		//Update prevMove to timestamp at end of cycle.
		console.log(this)
		console.log("xPos")
		console.log(this.xPos)
		this.el.style.left = newXPos + "px";
		this.el.style.top = newYPos + "px"
		this.xPos = newXPos;
		this.yPos = newYPos;

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
		//requestAnimationFrame(this.move);
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
			ballHandler.newBall();
			break;
		case "stop":
			
			stopBalls();
			break;
	}
};

function stopBalls(){
	ballHandler.flag = true;
}



// Event Listeners
document.getElementById("start-button").addEventListener("click", (event) => {
	handleClick(event, "start");
});
document.getElementById("stop-button").addEventListener("click", (event) => {
	handleClick(event, "stop")
})

const updateTargetPosition = (x, y) => {
	const xVal = `${x}px`;
	const yVal = `${y - 100}px`;
	const target = document.getElementById("target-dot");
	target.style.left = xVal;
	target.style.top = yVal;
};




