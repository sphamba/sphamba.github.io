function updateDiagramCanvasSize() {
	$("diagram").width  = $("diagram").clientWidth  * window.devicePixelRatio;
	$("diagram").height = $("diagram").clientHeight * window.devicePixelRatio;
}

class Diagram {
	constructor() {
		this.ctx = $("diagram").getContext("2d");
		this.animFrameMax = 30;
		
		this.nodes = {
			S: new Node(0.28, 0.5, 0.1,  "S", S_COLOR, this),
			I: new Node(0.53, 0.5, 0.07, "I", I_COLOR, this),
			R: new Node(0.64, 0.2, 0.04, "R", R_COLOR, this),
			D: new Node(0.64, 0.8, 0.03, "D", D_COLOR, this),
			H: new Node(0.75, 0.5, 0.07, "H", H_COLOR, this),
		};
		
		this.arrows = {
			S_to_I: new Arrow(this.nodes.S, this.nodes.I, this),
			I_to_R: new Arrow(this.nodes.I, this.nodes.R, this),
			I_to_D: new Arrow(this.nodes.I, this.nodes.D, this),
			R_to_S: new Arrow(this.nodes.R, this.nodes.S, this),
			I_to_H: new Arrow(this.nodes.I, this.nodes.H, this),
			H_to_R: new Arrow(this.nodes.H, this.nodes.R, this),
			H_to_D: new Arrow(this.nodes.H, this.nodes.D, this),
		}
	}
	
	get width()  { return $("diagram").width; }
	get height() { return $("diagram").height; }
	
	
	draw() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		
		for (let i in this.nodes) {
			this.nodes[i].draw();
		}
		
		for (let i in this.arrows) {
			this.arrows[i].draw();
		}
	}
	
	
	show(name, callback=()=>0, inverse=false) {
		let animFrame = 0;
		let elem = {
			S: this.nodes.S,
			I: this.nodes.I,
			R: this.nodes.R,
			D: this.nodes.D,
			H: this.nodes.H,
			S_to_I: this.arrows.S_to_I,
			I_to_R: this.arrows.I_to_R,
			I_to_D: this.arrows.I_to_D,
			R_to_S: this.arrows.R_to_S,
			I_to_H: this.arrows.I_to_H,
			H_to_R: this.arrows.H_to_R,
			H_to_D: this.arrows.H_to_D,
		}[name];
		
		function updateAnimation() {
			elem.developped = ease(++animFrame / diagram.animFrameMax, !inverse ? 0 : 1, !inverse ? 1 : 0);
			diagram.draw();
		
			if (animFrame < diagram.animFrameMax) {
				requestAnimationFrame(updateAnimation);
			} else {
				callback();
			}
		}
		
		updateAnimation();
	}
	
	
	hide(name, callback=()=>0) {
		this.show(name, callback=()=>0, true);
	}
	
	
	reset() {
		for (let i in this.nodes) {
			this.nodes[i].developped = 0;
		}
		
		for (let i in this.arrows) {
			this.arrows[i].developped = 0;
		}
	}
}


class Node {
	constructor(x, y, r, text, color, diagram) {
		this._x = x;
		this._y = y;
		this._r = r;
		this.text = text;
		this.color = color;
		
		this.developped = 0;
		this.diagram = diagram;
	}
	
	get x() { return this._x * this.diagram.width; }
	get y() { return this._y * this.diagram.height; }
	get r() { return this._r * this.diagram.width; }
	
	
	draw() {
		if (this.developped == 0) return;
		this.diagram.ctx.fillStyle = this.color;
		this.diagram.ctx.beginPath();
		this.diagram.ctx.arc(this.x, this.y, this.r * this.developped, 0, 2 * Math.PI);
		this.diagram.ctx.fill();
		
		this.diagram.ctx.textAlign = "center";
		this.diagram.ctx.textBaseline = "middle";
		this.diagram.ctx.fillStyle = "#fff";
		this.diagram.ctx.font = this.developped * this.r + "px " + FONT_NAME;
		this.diagram.ctx.fillText(this.text, this.x, this.y + 0.05 * this.developped * this.r);
	}
}


class Arrow {
	constructor(n1, n2) {
		this.diagram = n1.diagram;
		
		// find anchor points
		let dx = n2.x - n1.x;
		let dy = n2.y - n1.y;
		let d = Math.sqrt(dx * dx + dy * dy);
		dx /= d;
		dy /= d;
		
		this._x1 = (n1.x + dx * n1.r) / this.diagram.width;
		this._y1 = (n1.y + dy * n1.r) / this.diagram.height;
		this._x2 = (n2.x - dx * n2.r) / this.diagram.width;
		this._y2 = (n2.y - dy * n2.r) / this.diagram.height;
		
		this.developped = 0;
	}
	
	get x1() { return this._x1 * this.diagram.width; }
	get y1() { return this._y1 * this.diagram.height; }
	get x2() { return this._x2 * this.diagram.width; }
	get y2() { return this._y2 * this.diagram.height; }
	get size() { return 0.02 * this.diagram.width; }
	
	
	draw() {
		if (this.developped == 0) return;
		
		let tx = this.x2 - this.x1;
		let ty = this.y2 - this.y1;
		let xe = this.x1 + this.developped * tx;
		let ye = this.y1 + this.developped * ty;
		
		this.diagram.ctx.strokeStyle = "#fff";
		this.diagram.ctx.beginPath();
		this.diagram.ctx.moveTo(this.x1, this.y1);
		this.diagram.ctx.lineTo(xe, ye);
		this.diagram.ctx.stroke();
		
		// draw arrow head
		let tr = Math.sqrt(tx*tx + ty*ty) / this.developped;
		tx /= tr; // normalized direction
		ty /= tr;
		
		this.diagram.ctx.fillStyle = "#fff";
		this.diagram.ctx.beginPath();
		this.diagram.ctx.moveTo(xe, ye);
		this.diagram.ctx.lineTo(xe + this.size * (-tx + 0.3 * ty), ye + this.size * (-ty - 0.3 * tx));
		this.diagram.ctx.lineTo(xe + this.size * (-tx - 0.3 * ty), ye + this.size * (-ty + 0.3 * tx));
		this.diagram.ctx.fill();
	}
}


var diagram = null;