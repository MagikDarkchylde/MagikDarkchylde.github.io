class DisplayObject {
	constructor() {
		//The sprite's position and size
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		//Rotation, alpha, visible, and scale properties
		this.rotation = 0;
		this.alpha = 1;
		this.visible = true;
		this.scaleX = 1;
		this.scaleY = 1;
		//`pivotX` and `pivotY` let you set the sprite's axis of rotation
		//(0.5 represents the sprite's center point)
		this.pivotX = 0.5;
		this.pivotY = 0.5;
		//Add `vx` and `vy` (velocity) variables that will help you move the sprite
		this.vx = 0;
		this.vy = 0;
		//A "private" `_layer` property
		this._layer = 0;
		//A `children` array on the sprite that will contain all the
		//child sprites in the container
		this.children = [];
		//The sprite's `parent` property
		this.parent = undefined;
		//Optional drop shadow properties.
		//Set `shadow` to `true` if you want the sprite to display a shadow
		this.shadow = false;
		this.shadowColor = "rgba(100, 100, 100, 0.5)";
		this.shadowOffsetX = 3;
		this.shadowOffsetY = 3;
		this.shadowBlur = 3;
		//Optional blend mode property
		this.blendMode = undefined;

		//Properties for advance features:

		//Image state and animation
		this.frames = [];
		this.loop = true;
		this._currentFrame = 0;
		this.playing = false;
		//Can the sprite be dragged?
		this._draggable = undefined;
		//Is the sprite circular? If it is, it will be given a `radius`
		//and `diameter`
		this._circular = false;
		//Is the sprite `interactive`? If it is, it can be clickable
		//or touchable
		this._interactive = false;
	}

	/* Essentials */

	//Global position
	get gx() {
		if (this.parent) {
			//The sprite's global x position is a combination of
			//its locaL X value and its parent's global x value
			return this.x + this.parent.gx;
		} else {
			return this.x;
		}
	}
	get gy() {
		if (this.parent) {
			return this.y + this.parent.y;
		} else {
			return this.y;
		}
	}

	//Depth layer
	get layer() {
		return this._layer;
	}
	set layer(value) {
		this._layer = value;
		if (this.parent) {
			this.parent.children.sort((a, b) => a.layer - b.layer);
		}
	}
	//The `addChild` method lets you add sprites to his container
	addChild(sprite) {
		if (sprite.parent) {
			sprite.parent.removeChild(sprite);
		}
		sprite.parent = this;
		this.children.push(sprite);
	}

	removeChild (sprite) {
		if (sprite.parent == this) {
			this.children.splice(this.children.indexOf(sprite), 1);
		}	else {
			throw new Error(sprite + "is not a child of " + this);
		}
	}

	//Getters that return useful points on the sprite
	get halfWidth() {
		return this.width / 2;
	}
	get halfHeight() {
		return this.height / 2;
	}
	get centerX() {
		return this.x + this.halfWidth;
	}
	get centerY() {
		return this.y + this.halfHeight;
	}

	/* Conveniences */

	//A `position` getter. It returns an object width x and y properties
	get position() {
		return {x: this.x, y: this.y};
	}
	//A `setPosition` method to quickly set the sprite's x and y values
	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}
	//The `localBounds` and `globalBounds` methods return an object
	//width `x`, `y`, `width`, and `height` properties that define
	//the dimensions and position of the sprite. This is a convenience
	//to help you set or test boundaries without having to know
	//these numbers or request them specifically in your code.
	get localBounds() {
		return {
			x:0,
			y:0,
			width: this.width,
			height: this.height
		};
	}
	get globalBounds() {
		return {
			x: this.gx,
			y: this.gy,
			width: this.gx + this.width,
			height: this.gy + this.height
		};
	}
	//`empty` is a convenience property that will return `true` or
	//`false` depending on whether this sprite's `children`
	//array is empty
	get empty() {
		if (this.children.length === 0) {
			return true;
		} else {
			return false;
		}
	}
	//The following "put" methods help you position
	//another sprite in and around this sprite. You can position
	//sprites relative to this sprite's center, top, right, bottom or
	//left sides. The `xOffset` and `yOffset`
	//arguments determine by how much the other sprite's position
	//should be offset from this position.
	//In all these methods, `b` is the second sprite that is being
	//positioned relative to the first sprite (this one), `a`

	//Center `b` inside `a`
	putCenter(b, xOffset = 0, yOffset = 0) {
		let a = this;
		b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
		b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;
	}
	//Position `b` above `a`
	putTop(b, xOffset = 0, yOffset = 0) {
		let a = this;
		b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
		b.y = (a.y - b.height) + yOffset;
	}
	//Position `b` to the right of `a`
	putRight(b, xOffset = 0, yOffset = 0) {
		let a = this;
		b.x = (a.x + a.width) + xOffset;
		b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;
	}
	//Position `b` below `a`
	putBottom(b, xOffset = 0, yOffset = 0) {
		let a = this;
		b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
		b.y = (a.y + a.height) + yOffset;
	}
	//Position `b` to the left of `a`
	putLeft(b, xOffset = 0, yOffset = 0) {
		let a = this;
		b.x = (a.x - b.width) + xOffset;
		b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;
	}

	//Some extra conveniences for working with child sprites

	//Swap the depth layer positions of two child sprites
	swapChildren(child1, child2) {
		let index1 = this.children.indexOf(child1),
			index2 = this.children.indexOf(child2);
		if (index1 !== -1 && index2 !== -1) {
			//Swap the indexes 
			child1.childIndex = index2;
			child2.childIndex = index1;
			//Swap the array positions
			this.children[index1] = child2;
			this.children[index2] = child1;
		} else {
			throw new Error(`Both objects must be a child of the caller ${this}`);
		}
	}
	//`add` and `remove` let you add  and remove  many sprites at the same time
	add(...spritesToAdd) {
		spritesToAdd.forEach(sprite => this.addChild(sprite));
	}
	remove(...spritesToRemove) {
		spritesToRemove.forEach(sprite => this.removeChild(sprite));
	}

	/* Advance features */

	//if the sprite has more than one frame, return the
	//value of `_currentFrame`
	get currentFrame() {
		return this._currentFrame;
	}

	//The `circular` property lets you define whether a sprite
	//should be interpreted as a circular object. If you set
	//`circular` to `true`, the sprite is given `radius` and `diameter`
	//properties. If you set `circular` to `false`, the `radius`
	//and `diameter` properties are deleted from the sprite
	get circular() {
		return this._circular;
	}
	set circular (value) {
		//Give the sprite `diameter` and `radius` properties
		//if `circular` is `true`
		if (value === true && this._circular === false) {
			Object.defineProperties(this, {
				diameter: {
					get () {
						return this.width;
					},
					set (value) {
						this.width = value;
						this.height = value;
					},
					enumerable: true, configurable: true
				},
				radius: {
					get() {
						return this.halfWidth;
					},
					set(value) {
						this.width = value * 2;
						this.height = value * 2;
					},
					enumerable: true, configurable: true
				}
			});

			//Set this sprite's `diameter` and `radius` properties
			//if `circular` is `false`
			this._circular = true;
		}

		//Remove the sprite's `diameter` and `radius` properties
		//if `circular` is `false`
		if (value === false && this._circular === true) {
			delete this.diameter;
			delete this.radius;
			this._circular = false;
		}
	}

	//Is the sprite draggable by the pointer? If `draggable` is set
	//to `true`, the sprite is added to a `draggableSprites`
	//array. All the sprites in `draggableSprites` are updated each
	//frame to check whether they're being dragged.
	//(You’ll learn how to implement this in Chapter 6.)
	get draggable() {
		return this._draggable;
	}
	set draggable(value) {
		if (value === true) {
			draggableSprites.push(this);
			this._draggable = true;
		}

		//If it's `false`, remove it from the `draggableSprites` array
		if (value === false) {
			draggableSprites.splice(draggableSprites.indexOf(this), 1);
		}
	}

	//Is the sprite interactive? If `interactive` is set to `true`,
	//the sprite is run through the `makeInteractive` function.
	//`makeInteractive` makes the sprite sensitive to pointer
	//actions. It also adds the sprite to the `buttons` array,
	//which is updated each frame.
	//(You’ll learn how to implement this in Chapter 6.)
	get interactive() {
		return this._interactive;
	}
	set interactive(value) {
		if (value === true) {
			//Add interactive properties to the sprite
			//so that it can act like button
			makeInteractive(this);
			//Add the sprite to the global button's array so
			//it can  be updated each frame
			buttons.push(this);
			//Set this sprite's private `_interactive` property to `true`
			this._interactive = true;
		}
		if (value === false) {
			//Remove the sprite's reference from the
			//`buttons` array so that it's no longer affected
			//by mouse and touch interactivity
			buttons.splice(buttons.indexOf(this), 1);
			this._interactive = false;
		}
	}
}

export let stage = new DisplayObject();

export function makeCanvas(
  width = 256, height = 256, 
  border = "1px dashed black", 
  backgroundColor = "white"
) {

  //Make the canvas element and add it to the DOM
  let canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = border;
  canvas.style.backgroundColor = backgroundColor;
  document.body.appendChild(canvas);

  //Create the context as a property of the canvas
  canvas.ctx = canvas.getContext("2d");

  //Return the canvas
  return canvas;
}

export function remove(...spritesToRemove) {
	spritesToRemove.forEach(sprite => {
		sprite.parent.removeChild(sprite);
	});
}

export function render(canvas) {
	let ctx = canvas.ctx;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Loop through each sprite object in the stage's `children` array
	stage.children.forEach(sprite => {
		displaySprite(sprite);
	});

	function displaySprite(sprite) {
		//only display the sprite if it's visible
		//and within the area of the canvas
		if (sprite.visible
			&& sprite.gx < canvas.width + sprite.width && sprite.gx + sprite.width >= -sprite.width
			&& sprite.gy < canvas.height + sprite.height && sprite.gy + sprite.height >= -sprite.height
			) {

			ctx.save();
			ctx.translate(sprite.x + (sprite.width * sprite.pivotX), sprite.y + (sprite.height * sprite.pivotY));
			ctx.rotate(sprite.rotation);
			ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
			ctx.scale(sprite.scaleX, sprite.scaleY);

			if (sprite.shadow) {
				ctx.shadowColor = sprite.shadowColor;
				ctx.shadowOffsetX = sprite.shadowOffsetX;
				ctx.shadowOffsetY = sprite.shadowOffsetY;
				ctx.shadowBlur = sprite.shadowBlur;
			}

			if (sprite.blendMode) ctx.globalCompositeOperation = sprite.blendMode;
			if (sprite.render) sprite.render(ctx);
			if (sprite.children && sprite.children.length > 0) {
				//Reset the context back to the parent sprite's top-left corner,
				//relative to the pivot point
				ctx.translate(-sprite.width * sprite.pivotX, -sprite.height * sprite.pivotY);
				//Loop through the parent sprite's children
				sprite.children.forEach(child => {
					displaySprite(child);
				});
			}

			ctx.restore();
		}
	}
}


class Rectangle extends DisplayObject {
	constructor(width = 32, height = 32, fillStyle = "gray", strokeStyle = "none", lineWidth = 0, x = 0, y = 0) {
		super();
		//Assign the argument values to this sprite
		Object.assign(this, {width, height, fillStyle, strokeStyle, lineWidth, x, y});
		//Add a `mask` property to enable optional masking
		this.mask = false;
	}

	render(ctx) {
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillStyle;
		ctx.beginPath();
		//Draw the sprite around its `pivotX` and `pivotY` point
		ctx.rect(-this.width * this.pivotX, -this.height * this.pivotY, this.width, this.height);
		if (this.strokeStyle !== "none") ctx.stroke();
		if (this.fillStyle !== "none") ctx.fill();
		if (this.mask && this.mask === true) ctx.clip();
	}

}

//A higher-level wrapper for the rectangle sprite
export function rectangle(width, height, fillStyle, strokeStyle, lineWidth, x, y) {
	let sprite = new Rectangle(width, height, fillStyle, strokeStyle, lineWidth, x, y);
	stage.addChild(sprite);
	return sprite;
}

class RoundedRect extends DisplayObject {
	constructor(width = 32, height = 32, radius = 5, fillStyle = "gray", strokeStyle = "none", lineWidth = 0, x = 0, y = 0) {
		super();
		//Assign the argument values to this sprite
		Object.assign(this, {width, height, radius, fillStyle, strokeStyle, lineWidth, x, y});
		//Add a `mask` property to enable optional masking
		this.mask = false;
	}

	render(ctx) {
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillStyle;
		ctx.beginPath();
		//Draw the sprite around its `pivotX` and `pivotY` point
		//ctx.rect(-this.width * this.pivotX, -this.height * this.pivotY, this.width, this.height);
		let newX = -this.width * this.pivotX;
		let newY = -this.height * this.pivotY;
		ctx.moveTo(newX + this.radius, newY);
		ctx.lineTo(newX + this.width - this.radius, newY);
		ctx.quadraticCurveTo(newX + this.width, newY, newX + this.width, newY + this.radius);
		ctx.lineTo(newX + this.width, newY + this.height - this.radius);
		ctx.quadraticCurveTo(newX + this.width, newY + this.height, newX + this.width - this.radius, newY + this.height);
		ctx.lineTo(newX + this.radius, newY + this.height);
		ctx.quadraticCurveTo(newX, newY + this.height, newX, newY + this.height - this.radius);
		ctx.lineTo(newX, newY + this.radius);
		ctx.quadraticCurveTo(newX, newY, newX + this.radius, newY);
		ctx.closePath();
		if (this.strokeStyle !== "none") ctx.stroke();
		if (this.fillStyle !== "none") ctx.fill();
		if (this.mask && this.mask === true) ctx.clip();
	}

}
export function roundRect(width, height, radius, fillStyle, strokeStyle, lineWidth, x, y) {
	let sprite = new RoundedRect(width, height, radius, fillStyle, strokeStyle, lineWidth, x, y);
	stage.addChild(sprite);
	return sprite;
}

class Circle extends DisplayObject {
	constructor(
		diameter = 32,
		fillStyle = "gray",
		strokeStyle = "none",
		lineWidth = 0,
		x = 0,
		y = 0
	) {
		super();
		//Enable `radius` and `diameter` props
		this.circular = true;
		//Assign the argument values to this sprite
		Object.assign(this, {diameter, fillStyle, strokeStyle, lineWidth, x, y});
		//Add mask prop to enable optional masking
		this.mask = false;
	}

	render(ctx) {
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillStyle;
		ctx.beginPath();
		ctx.arc(
			this.radius + (-this.diameter * this.pivotX),
			this.radius + (-this.diameter * this.pivotY),
			this.radius,
			0, 2 * Math.PI,
			false
		);
		if (this.strokeStyle !== "none") ctx.stroke();
		if (this.fillStyle !== "none") ctx.fill();
		if (this.mask && this.mask === true) ctx.clip();
	}
}

export function circle(diameter, fillStyle, strokeStyle, lineWidth, x, y) {
	let sprite = new Circle(diameter, fillStyle, strokeStyle, lineWidth, x, y);
	stage.addChild(sprite);
	return sprite;
}

class Line extends DisplayObject {
	constructor(
		strokeStyle = "none",
		lineWidth = 0,
		ax = 0,
		ay = 0,
		bx = 32,
		by = 32
	) {
		super();
		Object.assign(this, {strokeStyle, lineWidth, ax, ay, bx, by});
		//The `lineJoin` style.
		//Options are "round", "mitre" and "bevel".
		this.lineJoin = "round";
	}

	render(ctx) {
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.lineJoin = this.lineJoin;
		ctx.beginPath();
		ctx.moveTo(this.ax, this.ay);
		ctx.lineTo(this.bx, this.by);
		if (this.strokeStyle !== "none") ctx.stroke();
	}
}

export function line(strokeStyle, lineWidth, ax, ay, bx, by) {
	let sprite = new Line(strokeStyle, lineWidth, ax, ay, bx, by);
	stage.addChild(sprite);
	return sprite;
}

class Text extends DisplayObject {
	constructor(
		content = "Hello!",
		font = "12px sans-serif",
		fillStyle = "red",
		x = 0,
		y = 0
	) {
		super();
		Object.assign(this, { content, font, fillStyle, x, y });
		//Set the default text baseline to "top"
		this.textBaseLine = "top";
		this.strokeText = "none";
	}

	render(ctx) {
		ctx.font = this.font;
		ctx.strokeStyle = this.strokeStyle;
		ctx.lineWidth = this.lineWidth;
		ctx.fillStyle = this.fillStyle;

		//Measure the width and height of the text
		if (this.width === 0) this.width = ctx.measureText(this.content).width;
		if (this.height === 0) this.height = ctx.measureText("M").width;

		ctx.translate(-this.width * this.pivotX, -this.height * this.pivotY);
		ctx.textBaseLine = this.textBaseLine;
		ctx.fillText(this.content, 0, 0);
		if (this.strokeText !== "none") ctx.strokeText();
	}
}

export function text(content, font, fillStyle, x, y) {
	let sprite = new Text(content, font, fillStyle, x, y);
	stage.addChild(sprite);
	return sprite;
}

class Group extends DisplayObject {
	constructor(...spritesToGroup){
		super();
		//Group all the sprites listed in the constructor arguments
		spritesToGroup.forEach(sprite => this.addChild(sprite));
	}
	//Groups have custom `addChild` and `removeChild` methods that call
	//a `calculateSize` method when any sprites are added or removed
	//from the group
	addChild(sprite) {
		if (sprite.parent) {
			sprite.parent.removeChild(sprite);
		}
		sprite.parent = this;
		this.children.push(sprite);
		//Figure out the new size of the group
		this.calculateSize();
	}

	removeChild(sprite) {
		if (sprite.parent === this) {
			this.children.splice(this.children.indexOf(sprite), 1);
			//Figure out the new size of the group
			this.calculateSize();
		} else {
			throw new Error(`${sprite} is not a child of ${this}`);
		}
	}

	calculateSize() {
		//Calculate the width based on the size of the largest child
		//that this sprite contains
		if (this.children.length > 0) {
			//Some temporary private variables to help track the new
			//calculated width and height
			this._newWidth = 0;
			this._newHeight = 0;
			//Find the width and height of the child sprites furthest
			//from the top left corner of the group
			this.children.forEach(child => {
				//Find child sprites that combined x value and width
				//that's greater than the current value of `_newWidth`
				if (child.x + child.width > this._newWidth) {
					//The new width is a combination of the child's
					//x position and its width
					this._newWidth = child.x + child.width;
				}
				if (child.y + child.height > this._newHeight) {
					this._newHeight = child.y + child.height;
				}
			});

			//Apply the `_newWidth` and `_newHeight` to this sprite's width
			//and height
			this.width = this._newWidth;
			this.height = this._newHeight;
		}
	}
}

export function group(...spritesToGroup) {
	let sprite = new Group(...spritesToGroup);
	stage.addChild(sprite);
	return sprite;
}

class Sprite extends DisplayObject {
	constructor(source, x = 0, y = 0) {
		super();
		Object.assign(this, {x, y});
		//We need to figure out what the source is, and then use
		//that source data to display the sprite image correctly

		//Is the source a js image object
		if (source instanceof Image) {
			this.createFromImage(source);
		}

		//Is the source a tileset from a texture atlas?
		//(It is if it has a `frame` property)
		else if (source.frame) {
			this.createFromAtlas(source);
		}

		//If the source contains an `image` subproperty, this must
		//be a `frame` object that's defining the rectangular area of a inner subimage.
		//Use that subimage to make the sprite. If it doesn't contain a
		//`data` property, then it must be a single frame.
		else if (source.image && !source.data) {
			this.createFromTileset(source);
		}

		//If the source contains an `image` subproperty
		//and a `data` property, then it contains multiple frames
		else if (source.image && source.data) {
			this.createFromTilesetFrames(source);
		}

		//Is the source an array? If so, what kind of array?
		else if (source instanceof Array) {
			if (source[0] && source[0].source) {
				//The source is an array of frames on a texture atlas tileset
				this.createFromAtlasFrames(source);
			}

			//It must be an array of image objects
			else if (source[0] instanceof Image) {
				this.createFromImages(source);
			}

			//throw an error if the sources in the array aren't recognized
			else {
				throw new Error(`The image sources in ${source} are not recognized`);
			}
		}
		//Throw an error if the source is something we can't interpret
		else {
			throw new Error(`The image source ${source} is not recognized`);
		}
	}

	createFromImage(source) {
		//Throw an error if the source is not an Image object
		if (!(source instanceof Image)) {
			throw new Error(`${source} is not an image object`);
		}

		//Otherwise, create the sprite using an Image
		else {
			this.source = source;
			this.sourceX = 0;
			this.sourceY = 0;
			this.width = source.width;
			this.height = source.height;
			this.sourceWidth = source.width;
			this.sourceHeight = source.height;
		}
	}

	createFromAtlas(source) {
		this.tilesetFrame = source;
		this.source = this.tilesetFrame.source;
		this.sourceX = this.tilesetFrame.frame.x;
		this.sourceY = this.tilesetFrame.frame.y;
		this.width = this.tilesetFrame.frame.w;
		this.height = this.tilesetFrame.frame.h;
		this.sourceWidth = this.tilesetFrame.frame.w;
		this.sourceHeight = this.tilesetFrame.frame.h;
	}

	createFromTileset(source) {
		if (!(source.image instanceof Image)) {
			throw new Error(`${source.image} is not an image object`);
		} else {
			this.source = source.image;
			this.sourceX = source.x;
			this.sourceY = source.y;
			this.width = source.width;
			this.height = source.height;
			this.sourceWidth = source.width;
			this.sourceHeight = source.height;
		}
	}

	createFromTilesetFrames(source) {
		if (!(source.image instanceof Image)) {
			throw new Error(`${source.image} is not an image object`);
		} else {
			this.source = source.image;
			this.frames = source.data;

			//Set the sprite to the first frame
			this.sourceX = this.frames[0][0];
			this.sourceY = this.frames[0][1];
			this.width = source.width;
			this.height = source.height;
			this.sourceWidth = source.width;
			this.sourceHeight = source.height;
		}
	}

	createFromAtlasFrames(source) {
		this.frames = source;
		this.source = source[0].source;
		this.sourceX = source[0].frame.x;
		this.sourceY = source[0].frame.y;
		this.width = source[0].frame.w;
		this.height = source[0].frame.h;
		this.sourceWidth = source[0].frame.w;
		this.sourceHeight = source[0].frame.h;
	}

	createFromImages(source) {
		this.frames = source;
		this.source = source[0];
		this.sourceX = 0;
		this.sourceY = 0;
		this.width = source[0].width;
		this.height = source[0].height;
		this.sourceWidth = source[0].width;
		this.sourceHeight = source[0].height;
	}

	//Add a `gotoAndStop` method to go to a specific frame
	gotoAndStop(frameNumber) {
		if (this.frames.length > 0 && frameNumber < this.frames.length) {
			//a. Frames made from tileset subimages.
			//If each frame is an array, then the frames were made from an
			//ordinary Image object using the `frames` method
			if (this.frames[0] instanceof Array) {
				this.sourceX = this.frames[frameNumber][0];
				this.sourceY = this.frames[frameNumber][1];
			}
			//b. Frames made from texture atlas frames.
			//If each frame isn't an array, and it has a subobject called `frame`,
			//then the frame must be a texture atlas ID name.
			//In that case, get the source position from atla's `frame` object
			else if (this.frames[frameNumber].frame) {
				this.sourceX = this.frames[frameNumber].frame.x;
				this.sourceY = this.frames[frameNumber].frame.y;
				this.sourceWidth = this.frames[frameNumber].frame.w;
				this.sourceHeight = this.frames[frameNumber].frame.h;
				this.width = this.frames[frameNumber].frame.w;
				this.height = this.frames[frameNumber].frame.h;
			}

			//c. Frames made from individual Image objects.
			//If neither of the above is true, then each frame must be
			//an individual image object
			else {
				this.source = this.frames[frameNumber];
				this.sourceX = 0;
				this.sourceY = 0;
				this.width = this.source.width;
				this.height = this.source.height;
				this.sourceWidth = this.source.width;
				this.sourceHeight = this.source.height;
			}

			//Set the `_currentFrame` value to the chosen frame
			this._currentFrame = frameNumber;
		} else {
			throw new Error(`Frame number ${frameNumber} does not exist`);
		}
	}

	render(ctx) {
		ctx.drawImage(
			this.source,						// image file
			this.sourceX, this.sourceY,			// The source x and y position
			this.sourceWidth, this.sourceHeight,// The source height and width
			-this.width * this.pivotX,			// The destination x position
			-this.height * this.pivotY,			// The destination y position
			this.width, this.height
		);
	}
}

export function sprite(source, x, y) {
	let sprite = new Sprite(source, x, y);
	if (sprite.frames.length > 0) addStatePlayer(sprite);
	stage.addChild(sprite);
	return sprite;
}

export function frame(source, x, y, width, height) {
	var o = {};
	o.image = source;
	o.x = x;
	o.y = y;
	o.width = width;
	o.height = height;
	return o;
}

export function frames(source, arrayOfPositions, width, height) {
	var o = {};
	o.image = source;
	o.data = arrayOfPositions;
	o.width = width;
	o.height = height;
	return o;
}

export function renderWithInterpolation(canvas, lagOffset) {

  //Get a reference to the context
  let ctx = canvas.ctx;

  //Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Loop through each sprite object in the stage's `children` array
  stage.children.forEach(sprite => {
    //Display a sprite 
    displaySprite(sprite);
  });

  function displaySprite(sprite) {
    //Only display the sprite if it's visible
    //and within the area of the canvas
    if (
      sprite.visible
      && sprite.gx < canvas.width + sprite.width
      && sprite.gx + sprite.width > -sprite.width
      && sprite.gy < canvas.height + sprite.height
      && sprite.gy + sprite.height > -sprite.height
    ) {

      //Save the canvas's present state
      ctx.save();

      //Interpolation
      if (sprite.previousX !== undefined) {
        sprite.renderX = (sprite.x - sprite.previousX) * lagOffset + sprite.previousX;
      } else {
        sprite.renderX = sprite.x;
      }
      if (sprite.previousY !== undefined) {
        sprite.renderY = (sprite.y - sprite.previousY) * lagOffset + sprite.previousY;
      } else {
        sprite.renderY = sprite.y;
      }
      
      //Draw the sprite at its interpolated position
      ctx.translate(
        sprite.renderX + (sprite.width * sprite.pivotX),
        sprite.renderY + (sprite.height * sprite.pivotY)
      );

      //Set the sprite's `rotation`, `alpha` and `scale`
      ctx.rotate(sprite.rotation);
      ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
      ctx.scale(sprite.scaleX, sprite.scaleY);

      //Display the sprite's optional drop shadow
      if(sprite.shadow) {
        ctx.shadowColor = sprite.shadowColor;
        ctx.shadowOffsetX = sprite.shadowOffsetX;
        ctx.shadowOffsetY = sprite.shadowOffsetY;
        ctx.shadowBlur = sprite.shadowBlur;
      }

      //Display the optional blend mode
      if (sprite.blendMode) ctx.globalCompositeOperation = sprite.blendMode;

      //Use the sprite's own `render` method to draw the sprite
      if (sprite.render) sprite.render(ctx);

      //If the sprite contains child sprites in its
      //`children` array, display them by recursively calling this very same
      //`displaySprite` function again

      if (sprite.children && sprite.children.length > 0) {
        //Reset the context back to the parent sprite's top left corner,
        //relative to the pivot point
        ctx.translate(-sprite.width * sprite.pivotX , -sprite.height * sprite.pivotY);
        //Loop through the parent sprite's children
        sprite.children.forEach(child => {
          //display the child
          displaySprite(child);
        });
      }

      //Restore the canvas to its previous state
      ctx.restore();
    }
  }
}

export let buttons = [];

class Button extends Sprite {
	constructor(source, x = 0, y = 0) {
		super(source, x, y);
		this.interactive = true;
	}
}

export function button(source, x, y) {
	let sprite = new Button(source, x, y);
	stage.addChild(sprite);
	return sprite;
}

function makeInteractive(o) {
	//The `press`, `release`, `over`, `out`, and `tap` methods.
	//They're `undefined` for now
	o.press = o.press || undefined;
	o.over = o.over || undefined;
	o.release = o.release || undefined;
	o.out = o.out || undefined;
	o.tap = o.tap || undefined;
	//The `state` property tells you the button's current state.
	//Set it initial state to `up`
	o.state = "up";
	//The `action` property tells you whether 
	//it's being pressed or released
	o.action = "";
	//The `pressed` and `hoverOver` Booleans are mainly for internal
	//use in this code to help figure out the correct state.
	//`pressed` is a boolean that helps track whether
	//the sprite has been pressed down
	o.pressed = false;
	//`hoverOver` is a boolean that checks whether the pointer
	//has hovered over the sprite
	o.hoverOver = false;
	//The `update` method will be called each frame
	//inside the game loop
	o.update = (pointer, canvas) => {
		//Figure out if the pointer is touching the sprite
		let hit = pointer.hitTestSprite(o);
		//1. Figure out the current state
		if (pointer.isUp) {
			//Up state
			o.state = "up";
			//Show the first image state frame, if this is a `Button` sprite
			if (o instanceof Button) o.gotoAndStop(0);
		}
		//If the pointer is touching the sprite, figure out
		//if the over or down state should be displayed
		if (hit) {
			//Over state
			o.state = "over";
			//Show the second image state frame if this sprite has
			//3 frames and it's a `Button` sprite
			if (o.frames && o.frames.length === 3 && o instanceof Button) {
				o.gotoAndStop(1);
			}
			//Down state
			if (pointer.isDown) {
				o.state = "down";
				//Show the third frame if this is a `Button` sprite
				//and it has only three frames, or show the second frame
				//if it has only two frames
				if (o instanceof Button) {
					if (o.frames.length === 3) {
						o.gotoAndStop(2);
					} else {
						o.gotoAndStop(1);
					}
				}
			}
		}
		//Perform the correct interactive action

		//a. Run the `press` method if the sprite state is "down"
		//and the sprite hasn't already been pressed
		if (o.state === "down") {
			if (!o.pressed) {
				if (o.press)  o.press();
				o.pressed = true;
				o.action = "pressed";
			}
		}
		//b. Run the `release` method if the sprite state is "over" and
		//the sprite has been pressed
		if (o.state === "over") {
			if (o.pressed) {
				if (o.release) o.release();
				o.pressed = false;
				o.action = "released";
				//If the `pointer` was tapped and the user assigned a `tap`
				//method, call the `tap` method
				if (pointer.tapped && o.tap) o.tap();
			}
			//Run the `over` method if it has been assigned
			if (!o.hoverOver) {
				if (o.over) o.over();
				o.hoverOver = true;
			}
		}
		//c. Check whether the pointer has been released outside
		//the sprite's area. If the button state is "up" and it has
		//already been pressed, then run the `release` method
		if (o.state === "up") {
			if (o.pressed) {
				if (o.release) o.release();
				o.pressed = false;
				o.action = "released";
			}
			//Run the `out` method if it has been assigned
			if (o.hoverOver) {
				if (o.out) o.out();
				o.hoverOver = false; 
			}
		}
	};
}

export let draggableSprites = [];

export function grid(
		columns = 0, rows = 0, cellWidth = 32, cellHeight = 32,
		centerCell = false, xOffset = 0, yOffset = 0,
		makeSprite = undefined, extra = undefined
	) {
	//Create an empty group called `container`. This `container`
	//group is what the function returns to the main program
	//All the sprites in the grid cells will be added
	//as children to this container
	let container = group();
	//The `create` method plots the grid
	let createGrid = () => {
		//Figure out the number of cells in the grid
		let length = columns * rows;
		//Create a sprite for each cell
		for (let i = 0; i < length; i++) {
			//Figure out the sprite's x/y placement in the grid
			let x = (i % columns) * cellWidth,
				y = Math.floor(i / columns) * cellHeight;
			//Use the `makeSprite` function supplied in the constructor
			//to make a sprite for the grid cell
			let sprite = makeSprite();
			//Add the sprite to the `container`
			container.addChild(sprite);
			//Should the sprite be centered in the cell?
			//No, it shouldn't be centered
			if (!centerCell) {
				sprite.x = x + xOffset;
				sprite.y = y + yOffset;
			}
			//Yes, it should be centered
			else {
				sprite.x = x + (cellWidth / 2) - sprite.halfWidth + xOffset;
				sprite.y = y + (cellHeight / 2) - sprite.halfHeight + yOffset;
			}
			//Run any optional extra code. This calls the
			//`extra` function supplied by the constructor
			if (extra) extra(sprite); 
		}
	};

	//Run the `createGrid` method
	createGrid();
	//Return the `container` group back to the main program
	return container;
}

export function addStatePlayer(sprite) {
	let frameCounter = 0,
		numberOfFrames = 0,
		startFrame = 0,
		endFrame = 0,
		timerInterval = undefined;
	//The `show` function (to display static states)
	function show(frameNumber) {
		//Reset any possible previous animations
		reset();
		//Find the new state on the sprite
		sprite.gotoAndStop(frameNumber);
	}
	//The `play` function plays all the sprite's frames
	function play() {
		if (!sprite.playing) {
			playSequence([0, sprite.frames.length - 1]);
		}
	}
	//The `stop` function stops the animation at the current frame
	function stop() {
		if (sprite.playing) {
			reset();
			sprite.gotoAndStop(sprite.currentFrame);
		}
	}
	//The `playSequence` function, to play a sequence of frames
	function playSequence(sequenceArray, rewind = false) {
		//Reset any possible previous animations
		reset();
		//Figure out how many frames there are in the range
		startFrame = sequenceArray[0];
		endFrame = sequenceArray[1];
		numberOfFrames = endFrame - startFrame;
		if (rewind) {
			numberOfFrames = startFrame - endFrame;
		}
		//Compensate for two edge cases:
		//1. If the `startFrame` happens to be `0`
		if (startFrame === 0) {
			numberOfFrames += 1;
			frameCounter += 1;
		}
		//2. If only two-frame sequence was provided
		if (numberOfFrames === 1) {
			numberOfFrames = 2;
			frameCounter += 1;
		}
		//Calculate the frame rate. Set the default fps to 12
		if (!sprite.fps) sprite.fps = 12;
		let frameRate = 1000 / sprite.fps;
		//Set the sprite to the starting frame
		sprite.gotoAndStop(startFrame);
		//If the state isn't already `playing`, start it
		if (!sprite.playing) {
			timerInterval = setInterval(advanceFrame.bind(this, rewind), frameRate);
			sprite.playing = true;
		}
	}
	//`advanceFrame` is called by `setInterval` to display the next frame
	//in the sequence based on the `frameRate`. When the frame sequence
	//reaches the end, it will either stop or loop
	function advanceFrame(rewind = false) {
		if (rewind) {
			if (frameCounter < numberOfFrames) {
				//Advance the frame
				sprite.gotoAndStop(sprite.currentFrame - 1);
				//Update the frame counter
				frameCounter += 1;
			} else {
				if (sprite.loop) {
					sprite.gotoAndStop(startFrame);
					frameCounter = 1;
				}
			}
		} else {
			//Advance the frame if `frameCounter` is less than
			//the state's total frames
			if (frameCounter < numberOfFrames) {
				//Advance the frame
				sprite.gotoAndStop(sprite.currentFrame + 1);
				//Update the frame counter
				frameCounter += 1;
			//If we've reached the last frame and `loop`
			//is `true`, then start from the first frame again
			} else {
				if (sprite.loop) {
					sprite.gotoAndStop(startFrame);
					frameCounter = 1;
				}
			}
		}
	}
	//Reset `sprite.playing` to `false`, set the `frameCounter` to 0,
	//and clear the `timerInterval`
	function reset() {
		if (timerInterval !== undefined && sprite.playing === true) {
			sprite.playing = false;
			frameCounter = 0;
			startFrame = 0;
			endFrame = 0;
			numberOfFrames = 0;
			clearInterval(timerInterval);
		}
	}
	//Add the `show`, `play`, `stop`, and `playSequence` methods to the sprite
	sprite.show = show;
	sprite.play = play;
	sprite.stop = stop;
	sprite.playSequence = playSequence;
}

export function filmstrip(image, frameWidth, frameHeight, spacing = 0) {
	//An array to store the x and y positions of each frame
	let positions = [];
	//Find out how many columns and rows there are in the image
	let columns = image.width / frameWidth,
		rows = image.height / frameHeight;
	//Find the total number of frames
	let numberOfFrames = columns * rows;
	//find position x, y
	for (let i = 0; i < numberOfFrames; i++) {
		//Find the correct row and column for each frame
		//and figure out its x and y position
		let x = (i % columns) * frameWidth,
			y = Math.floor(i / columns) * frameHeight;
		//Compensate for any optional spacing (padding) around the frames if
		//there is any. This bit of code accumulates the spacing offsets from the
		//left side of the tileset and adds them to the current tile's position
		if (spacing && spacing > 0) {
			x += spacing + (spacing * i % columns);
			y += spacing + (spacing * Math.floor(i / columns));
		}
		//Add the x and y value of each frame to the `positions` array
		positions.push([x, y]);
	}
	//Create and return the animation frames using the `frames` method
	return frames(image, positions, frameWidth, frameHeight);
}

export function sorting(objectArray) {
	//check y position and sort
	objectArray.sort((a, b) => (a.y - b.y));
	objectArray.forEach((child, index) => {
		child.layer = index + 1;
	});
}

export let particles = [];

export function particleEffect(
	x = 0, y = 0, 
	spriteFunction = () => circle(10, "red"),
	numberOfParticles = 10, 
	gravity = 0, 
	randomSpacing = true, 
	minAngle = 0, maxAngle = 6.28,
	minSize = 4, maxSize = 16, 
	minSpeed = 0.1, maxSpeed = 1, 
	minScaleSpeed = 0.01, maxScaleSpeed = 0.05,
	minAlphaSpeed = 0.02, maxAlphaSpeed = 0.02, 
	minRotationSpeed = 0.01, maxRotationSpeed = 0.03
) {
	//`randomFloat` and `randomInt` helper functions
	let randomFloat = (min, max) => min + Math.random() * (max - min),
		randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

	//An array to store the angles
	let angles = [];

	//A variable to store the current particle's angle
	let angle;

	//Figure out by how many radians each particle should be separated
	let spacing = (maxAngle - minAngle) / (numberOfParticles - 1);

	//Create an angle value for each particle and push that
	//value into the `angles` array
	for (let i = 0; i < numberOfParticles; i++) {
		//If `randomSpacing` is `true`, give the particle any angle
		//value between `minAngle` and `maxAngle`
		if (randomSpacing) {
			angle = randomFloat(minAngle, maxAngle);
			angles.push(angle);
		}
		//If `randomSpacing` is `false`, space each particle evenly,
		//starting with the `minAngle` and ending with the `maxAngle`
		else {
			if (angle === undefined) angle = minAngle;
			angles.push(angle);
			angle += spacing;
		}
	}

	//Make a particle for each angle
	angles.forEach(angle => makeParticle(angle));

	//Make the particle
	function makeParticle(angle) {
		//Create the particle using the supplied sprite function
		let particle = spriteFunction();
		//Display a random frame if the particle has more than 1 frame
		if (particle.frames.length > 0) {
			particle.gotoAndStop(randomInt(0, particle.frames.length -1));
		}
		//set the x and y position
		particle.x = x - particle.halfWidth;
		particle.y = y - particle.halfHeight;
		//set the random width and height
		let size = randomInt(minSize, maxSize);
		particle.width = size;
		particle.height = size;
		//set a random speed to change the scale, alpha and rotation
		particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
		particle.alphaSpeed = randomFloat(minAlphaSpeed, maxAlphaSpeed);
		particle.rotationSpeed = randomFloat(minRotationSpeed, maxRotationSpeed);
		//set a random velocity at which the particle should move 
		let speed = randomFloat(minSpeed, maxSpeed);
		particle.vx = speed * Math.cos(angle);
		particle.vy = speed * Math.sin(angle);
		//The particle's `update` method is called  
		//on each frame of the game loop
		particle.update = () => {
			//Add gravity
			particle.vy += gravity;
			//Move the particle
			particle.x += particle.vx;
			particle.y += particle.vy;
			//change the particle's `scale`
			if (particle.scaleX - particle.scaleSpeed > 0) {
				particle.scaleX -= particle.scaleSpeed;
			}
			if (particle.scaleY - particle.scaleSpeed > 0) {
				particle.scaleY -= particle.scaleSpeed;
			}
			//Change the particle's rotation 
			particle.rotation += particle.rotationSpeed;
			//Change the particle's `alpha`
			particle.alpha -= particle.alphaSpeed;
			//Remove the particle if its `alpha` reaches zero
			if (particle.alpha <= 0) {
				remove(particle);
				particles.splice(particles.indexOf(particle), 1);
			}
		};
		//Push the particle into the `particles` array.
		//The `particles` array needs to be updated by the game loop each frame
		particles.push(particle);
	}
}

export function emitter(interval, particleFunction) {
	let emitter = {},
		timerInterval = undefined;

	emitter.playing = false;

	function play() {
		if (!emitter.playing) {
			particleFunction();
			timerInterval = setInterval(emitParticle.bind(this), interval);
			emitter.playing = true;
		}
	}
	function stop() {
		if (emitter.playing) {
			clearInterval(timerInterval);
			emitter.playing = false;
		}
	}
	function emitParticle() {
		particleFunction();
	}
	emitter.play = play;
	emitter.stop = stop;
	return emitter;
}

export function tilingSprite(width, height, source, x = 0, y = 0) {
	//Figure out the tile's width and height
	let tileWidth, tileHeight;
	//If the source is a texture atlas frame, use its
	//`frame.w` and `frame.h` properties
	if (source.frame) {
		tileWidth = source.frame.w;
		tileHeight = source.frame.h;
	}
	//If its an image, use the image's
	//`width` and `height` properties
	else {
		tileWidth = source.width;
		tileHeight = source.height;
	}
	//The number of rows and columns should always be
	//one greater than the total number of tiles
	//that can fit into the rectangle.
	let columns, rows;
	//1. Columns
	//If the width of the rectangle is greater than the width of the tile,
	//calculate the number of tile columns
	if (width >= tileWidth) {
		columns = Math.round(width / tileWidth) + 1;
	}
	//If the rectangle's width is less than the width of the
	//tile, set the columns to 2, which is the minimun
	else {
		columns = 2;
	}
	//2. Rows
	//Calculate the tile rows in the same way
	if (height >= tileHeight) {
		rows = Math.round(height / tileHeight) + 1;
	} else {
		rows = 2;
	}
	//Create a grid of sprites that's just one sprite larger
	//than the `totalWidth` and `totalHeight`
	let tileGrid = grid(columns, rows, tileWidth, tileHeight, false, 0, 0,
		() => {
			//Make a sprite from the supplied `source`
			let tile = sprite(source);
			return tile;
		});
	//Declare the grid's private properties that we'll use to
	//help scroll the tiling background
	tileGrid._tileX = 0;
	tileGrid._tileY = 0;
	//Create an empty rectangle sprite without a fill or stroke color.
	//set it to the supplied `width` and `height`
	let container = rectangle(width, height, "none", "none");
	container.x = x;
	container.y = y;
	//Set the rectangle's `mask` property to `true`. This switches on `ctx.clip()`
	//In the rectangle sprite's `render` method
	container.mask = true;
	//Add the tile grid to the rectangle container
	container.addChild(tileGrid);
	//Define the `tileX` and `tileY` properties on the parent container
	//so that you can scroll the tiling background
	Object.defineProperties(container, {
		tileX: {
			get() {
				return tileGrid._tileX;
			},
			set(value) {
				//Loop through all of the grid's child sprites
				tileGrid.children.forEach(child => {
					//Figure out the difference between the new position
					//and the previous position
					let difference = value - tileGrid._tileX;
					//Offset the child sprite by the difference
					child.x += difference;
					//If the x position of the sprite exceeds the total width
					//of the visible columns, reposition it to just in front of the
					//left edge of the container. This creates the wrapping
					//effect
					if (child.x > (columns - 1) * tileWidth) {
						child.x = 0 - tileWidth + difference;
					}
					//Use the same procedure to wrap sprites that
					//exceed the left boundary
					if (child.x < 0 - tileWidth - difference) {
						child.x = (columns - 1) * tileWidth;
					}
				});
				//Set the private `_tileX` property to the new value
				tileGrid._tileX = value;
			},
			enumerable: true, configurable: true
		},
		tileY: {
			get() {
				return tileGrid._tileY;
			},
			set(value) {
				tileGrid.children.forEach(child => {
					let difference = value - tileGrid._tileY;
					child.y += difference;
					if (child.y > (rows - 1) * tileHeight) child.y = 0 - tileHeight + difference;
					if (child.y < 0 - tileHeight - difference) child.y = (rows - 1) * tileHeight;
				});
				tileGrid._tileY = value;
			},
			enumerable: true, configurable: true
		}
	});
	//Return the rectangular container
	return container;
}

export let progressBar = {
	maxWidth: 0,
	height: 0,
	backgroundColor: "gray",
	foregroundColor: "cyan",
	backBar: null,
	frontBar: null,
	percentage: null,
	assets: null,
	initialized: false,
	//Use the `create` method to create the progress bar
	create(canvas, assets) {
		if (!this.initialized) {
			//Store a reference to the `assets` object
			this.assets = assets;
			//Set the maximum width to half the width of the canvas
			this.maxWidth = canvas.width / 2;
			//Build the progress bar using two rectangle sprites and
			//one text sprite:
			//1. Create the background bar's gray background
			this.backBar = rectangle(this.maxWidth, 32, this.backgroundColor);
			this.backBar.x = (canvas.width / 2) - (this.maxWidth / 2);
			this.backBar.y = (canvas.height / 2) - 16;
			//2. Create the blue foreground bar. This is the element of the
			//progress bar that will increase in width as assets load
			this.frontBar = rectangle(this.maxWidth, 32, this.foregroundColor);
			this.frontBar.x = (canvas.width / 2) - (this.maxWidth / 2);
			this.frontBar.y = (canvas.height / 2) - 16;
			//3. A text sprite that will display the percentage
			//of assets that have loaded
			this.percentage = text("0%", "28px sans-serif", "black");
			this.percentage.x = (canvas.width / 2) - (this.maxWidth / 2) + 12;
			this.percentage.y = (canvas.height / 2) - 16;
			//Flag the `progressBar` as having been initialized
			this.initialized = true;
		}
	},
	//Use the `update` method to update the width of the bar and
	//percentage loaded each frame:
	update() {
		//Change the width of the blue `frontBar` to match the
		//ratio of assets that have loaded. Adding `+1` to
		//`assets.loaded` means that the loading bar will appear at 100%
		//when the last asset is being loaded, which is reassuring for the
		//player observing the load progress
		let ratio = (this.assets.loaded + 1) / this.assets.toLoad;
		this.frontBar.width = this.maxWidth * ratio;
		//Display the percentage
		this.percentage.content = `${Math.floor((ratio) * 100)} %`;
	},
	//Use the `remove` method to remove the progress bar when all the
	//game assets have finished loading
	remove() {
		//Remove the progress bar using the universal sprite `remove` function
		remove(this.frontBar);
		remove(this.backBar);
		remove(this.percentage);
	}
};

export let shakingSprites = [];

export function shake(sprite, magnitude = 16, angular = false) {

  //A counter to count the number of shakes
  let counter = 1;

  //The total number of shakes (there will be 1 shake per frame)
  let numberOfShakes = 10;

  //Capture the sprite's position and angle so you can
  //restore them after the shaking has finished
  let startX = sprite.x,
      startY = sprite.y,
      startAngle = sprite.rotation;

  //Divide the magnitude into 10 units so that you can 
  //reduce the amount of shake by 10 percent each frame
  let magnitudeUnit = magnitude / numberOfShakes;
  
  //The `randomInt` helper function
  let randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  //Add the sprite to the `shakingSprites` array if it
  //isn't already there
  if(shakingSprites.indexOf(sprite) === -1) {
    //console.log("added")
    shakingSprites.push(sprite);
    
    //Add an `updateShake` method to the sprite.
    //The `updateShake` method will be called each frame
    //in the game loop. The shake effect type can be either
    //up and down (x/y shaking) or angular (rotational shaking).
    sprite.updateShake = () => {
      if(angular) {
        angularShake();
      } else {
        upAndDownShake();
      }
    };
  }

  //The `upAndDownShake` function
  function upAndDownShake() {

    //Shake the sprite while the `counter` is less than 
    //the `numberOfShakes`
    if (counter < numberOfShakes) {

      //Reset the sprite's position at the start of each shake
      sprite.x = startX;
      sprite.y = startY;

      //Reduce the magnitude
      magnitude -= magnitudeUnit;

      //Randomly change the sprite's position
      sprite.x += randomInt(-magnitude, magnitude);
      sprite.y += randomInt(-magnitude, magnitude);

      //Add 1 to the counter
      counter += 1;
    }

    //When the shaking is finished, restore the sprite to its original 
    //position and remove it from the `shakingSprites` array
    if (counter >= numberOfShakes) {
      sprite.x = startX;
      sprite.y = startY;
      shakingSprites.splice(shakingSprites.indexOf(sprite), 1);
    }
  }
  
  //The `angularShake` function
  //First set the initial tilt angle to the right (+1) 
  let tiltAngle = 1;

  function angularShake() {
    if (counter < numberOfShakes) {

      //Reset the sprite's rotation
      sprite.rotation = startAngle;

      //Reduce the magnitude
      magnitude -= magnitudeUnit;

      //Rotate the sprite left or right, depending on the direction,
      //by an amount in radians that matches the magnitude
      sprite.rotation = magnitude * tiltAngle;
      counter += 1;

      //Reverse the tilt angle so that the sprite is tilted
      //in the opposite direction for the next shake
      tiltAngle *= -1;
    }

    //When the shaking is finished, reset the sprite's angle and
    //remove it from the `shakingSprites` array
    if (counter >= numberOfShakes) {
      sprite.rotation = startAngle;
      shakingSprites.splice(shakingSprites.indexOf(sprite), 1);
      //console.log("removed")
    }
  }

}


























