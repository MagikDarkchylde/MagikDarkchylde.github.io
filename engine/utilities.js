import { makeSound } from "./sound.js";

export let assets = {
  //Properties to help track the assets being loaded
  toLoad: 0,
  loaded: 0,

  //File extensions for different types of assets
  imageExtensions: ["png", "jpg", "gif"],
  fontExtensions: ["ttf", "otf", "ttc", "woff"],
  jsonExtensions: ["json"],
  audioExtensions: ["mp3", "ogg", "wav", "webm"],

  //The `load` method creates and loads all the assets. Use it like this:
  //`assets.load(["images/anyImage.png", "fonts/anyFont.otf"]);`
  load(sources) {
    //The `load` method will return a Promise when everything has loaded
    return new Promise(resolve => {

      //The `loadHandler` counts the number of assets loaded, 
      //compares it to the total number of assets that need to be loaded,
      //and resolves the Promise when everything has loaded
      let loadHandler = () => {
        this.loaded += 1;
        console.log(this.loaded);

        //Check whether everything has loaded
        if (this.toLoad === this.loaded) {
          //Reset `toLoad` and `loaded` to `0` so you can use them
          //to load more assetslater if you need to
          this.toLoad = 0;
          this.loaded = 0;
          console.log("Assets finished loading");

          //Resolve the promise
          resolve();
        }
      };

      //Display a console message to confirm 
      //that the assets are being loaded
      console.log("Loading assets...");

      //Find the number of files that need to be loaded
      this.toLoad = sources.length;

      //Loop through all the source filenames 
      //and find out how they should be interpreted
      sources.forEach(source => {
        //Find the extensionof the asset
        let extension = source.split(".").pop();

        //Load images that have file extensions that match
        //the imageExtensions array
        if (this.imageExtensions.indexOf(extension) !== -1) {
          this.loadImage(source, loadHandler);
        }

        //Load fonts
        else if (this.fontExtensions.indexOf(extension) !== -1) {
          this.loadFont(source, loadHandler);
        }

        //Load JSON files
        else if (this.jsonExtensions.indexOf(extension) !== -1) {
          this.loadJson(source, loadHandler);
        }

        //Load audio files
        else if (this.audioExtensions.indexOf(extension) !== -1) {
          this.loadSound(source, loadHandler);
        }
        //Display a message if the a file type isn't recognized
        else {
          console.log("File type not recognized: " + source);
        }
      });
    });
  },

  loadImage(source, loadHandler) {
    //Create a new image an call `loadHandler`
    //when the image file has loaded
    let image = new Image();
    image.addEventListener("load", loadHandler, false);

    //Assign the image as a property of the `assets` object so
    //you can access it like this: `assets["path/imageName.png"]`
    this[source] = image;

    //Set the image's `src` property to start loading the image
    image.src = source;
  },

  loadFont(source, loadHandler) {
    //Use the font's filename as the `fontFamily` name
    let fontFamily = source.split("/").pop().split(".")[0];

    //Append an `@font-face` style rule to the head of the HTML document
    let newStyle = document.createElement("style");
    let fontFace = "@font-face {font-family: '" + fontFamily + "'; src: url('" + source + "');}";
    // let fontFace = `@font-face {font-family: ${fontFamily}; src: url(${source});}`;
    newStyle.appendChild(document.createTextNode(fontFace));
    document.head.appendChild(newStyle);

    //Tell the `loadHandler` we are loading a font
    loadHandler();
  },

  loadJson(source, loadHandler) {
    //Create a new `xhr` object to store the file
    let xhr = new XMLHttpRequest();
    xhr.open("GET", source, true);
    xhr.responseType = "text";

    xhr.onload = event => {
      // 200: means loaded success
      if (xhr.status === 200) {
        let file = JSON.parse(xhr.responseText);
        file.name = source;
        //Assign the file as a property of the assets object so
        //you can access it like this: `assets["file.json"]`
        this[file.name] = file;
        //Texture atlas support:
        //If the JSON file has a `frames` property then
        //it's in Texture Packer format
        if (file.frames) {
          //Create the tileset frames
          this.createTilesetFrames(file, source, loadHandler);
        } else {
          //Alert the load handler that the file has loaded
          loadHandler();
        }
      }
    };

    //Send the request to load the file
    xhr.send();
  },

  createTilesetFrames(file, source, loadHandler) {
    //Get the tileset image's file path
    let baseUrl = source.replace(/[^\/]*$/, "");
    //Use the `baseUrl` and `image` name property from the JSON
    //file's `meta` object to construct the full image source path
    let imageSource = baseUrl + file.meta.image;
    let imageLoadHandler = () => {
      //Assign the image as a property of the `assets` object so
      //you can access it like this:
      //`assets["images/imageName.png"]`
      this[imageSource] = image;

      Object.keys(file.frames).forEach(frame => {
        //The `frame` object contains data for each sub-image.
        //Add the frame data to the asset object so that you
        //can access it later like this: `assets["frameName.png"]`
        this[frame] = file.frames[frame];
        //Get a reference to the source so that 
        //it will be easy for us to access it later
        this[frame].source = image;
      });

      //Alert the load handler that the file has loaded
      loadHandler();
    };

    //Load the tileset image
    let image = new Image();
    image.addEventListener('load', imageLoadHandler, false);
    image.src = imageSource;
  },

  loadSound(source, loadHandler) {
    //Create a sound object and alert the `loadHandler`
    //when the sound file has loaded
    let sound = makeSound(source, loadHandler);
    //Get the sound file name
    sound.name = source;
    //Assign the sound as a property of the assets object so
    //we can access it this way: `assets["assets/sound.mp3"]`
    this[sound.name] = sound;
  }
};

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

export function randomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function contain(sprite, bounds, bounce = false, extra = undefined) {

  let x = bounds.x,
      y = bounds.y,
      width = bounds.width,
      height = bounds.height;

      //The `collision` object is used t store which
      //side of the containing rectangle the sprite hits
      let collision;

      //Left
      if (sprite.x < x) {
        //Bounce the sprite if `bounce` is true
        if (bounce) sprite.vx *= -1;
        //If the sprite has `mass`, let the mass
        //affect the sprite's velocity
        if (sprite.mass) sprite.vx /= sprite.mass;
        sprite.x = x;
        collision = "left"; 
      }
      //Top
      if (sprite.y < y) {
        if (bounce) sprite.vy *= -1;
        if (sprite.mass) sprite.vy /= sprite.mass;
        sprite.y = y;
        collision = "top";
      }
      //Right
      if (sprite.x + sprite.width > width) {
        if (bounce) sprite.vx *= -1;
        if (sprite.mass) sprite.vx /= sprite.mass;
        sprite.x = width - sprite.width;
        collision = "right";
      }
      //Bottom
      if (sprite.y + sprite.height > height) {
        if (bounce) sprite.vy *= -1;
        if (sprite.mass) sprite.vy /= sprite.mass;
        sprite.y = height - sprite.height;
        collision = "bottom";
      }

      //The `extra` function runs if there was a collision
      //and `extra` has been defined
      if (collision && extra) extra(collision);

      //Return the `collision` object
      return collision;
}

export function distance(s1, s2) {
  let vx = s2.centerX - s1.centerX,
      vy = s2.centerY - s1.centerY;
  return Math.sqrt(vx*vx + vy*vy);
}

export function move(...sprites) {
  if (sprites.length === 1) {
    let s = sprites[0];
    s.x += s.vx;
    s.y += s.vy;
  }
  else {
    for (let i = 0; i < sprites.length; i++) {
      let s = sprites[i];
      s.x += s.vx;
      s.y += s.vy;
    }
  }
}

export function followEase(follower, leader, speed) {
  //Figure out the distance between the sprites
  let vx = leader.centerX - follower.centerX,
      vy = leader.centerY - follower.centerY,
      distance = Math.sqrt(vx*vx + vy*vy);
  //Move the follower if it's more than 1 pixel
  //away from the leader
  if (distance >= 1) {
    follower.x += vx * speed;
    follower.y += vy * speed;
  }
}

export function followConstant(follower, leader, speed) {
  //Figure out the distance between the sprites
  let vx = leader.centerX - follower.centerX,
      vy = leader.centerY - follower.centerY,
      distance = Math.sqrt(vx*vx + vy*vy);
  //Move the follower if it's more than 1 move
  //away from the leader
  if (distance >= speed) {
    follower.x += (vx / distance) * speed;
    follower.y += (vy / distance) * speed;
  }
}

export function angle(s1, s2) {
  return Math.atan2(s2.centerY - s1.centerY, s2.centerX - s1.centerX);
}

export function rotateSprite(rotatingSprite, centerSprite, distance, angle) {
  // x pos
  rotatingSprite.x = 
  centerSprite.centerX - rotatingSprite.parent.x 
  + (distance * Math.cos(angle))
  - rotatingSprite.halfWidth;
  // y pos
  rotatingSprite.y = 
  centerSprite.centerY - rotatingSprite.parent.y
  + (distance * Math.sin(angle))
  - rotatingSprite.halfWidth;
}

export function rotatePoint(pointX, pointY, distanceX, distanceY, angle) {
  let point = {};
  point.x = pointX + Math.cos(angle) * distanceX;
  point.y = pointY + Math.sin(angle) * distanceY;
  return point;
}

export function shoot(shooter, angle, offsetFromCenter, bulletSpeed, bulletArray, bulletSprite) {
  //Make a new sprite using the user-supplied `bulletSprite` function
  let bullet = bulletSprite();
  //Set the bullet's start point
  bullet.x = shooter.centerX - bullet.halfWidth + (offsetFromCenter * Math.cos(angle));
  bullet.y = shooter.centerY - bullet.halfHeight + (offsetFromCenter * Math.sin(angle));
  //Set the bullet's velocity
  bullet.vx = Math.cos(angle) * bulletSpeed;
  bullet.vy = Math.sin(angle) * bulletSpeed;
  //Push the bullet into the `bulletArray`
  bulletArray.push(bullet);
}

export function outsideBounds(sprite, bounds, extra = undefined) {
  let x = bounds.x,
      y = bounds.y,
      width = bounds.width,
      height = bounds.height;
  //The `collision` object is used to store which
  //side of the containing rectangle the sprite hits
  let collision;
  //Left
  if (sprite.x < x - sprite.width) {
    collision = "left";
  }
  //Top
  if (sprite.y < y - sprite.height) {
    collision = "top";
  }
  //Right
  if (sprite.x > width) {
    collision = "right";
  }
  //Bottom
  if (sprite.y > height) {
    collision = "bottom";
  }
  //The `extra` function runs if there was a collision
  //and `extra` has been defined
  if (collision && extra) extra(collision);
  //Return the `collision` object
  return collision;
}

export function dotPoints(boundary, sprite) {
  //1. Get the sprite's motion vector and unit vector
  let v1 = {};
  v1.vx = sprite.vx;
  v1.vy = sprite.vy;
  v1.m = Math.sqrt(v1.vx * v1.vx + v1.vy * v1.vy);
  v1.dx = v1.vx / v1.m || 0;
  v1.dy = v1.vy / v1.m || 0;

  //3. Get the boundary line's vector, unit vector, left normal,
  //and left normal unit vector 
  let v2 = {};
  v2.ax = boundary.ax;
  v2.ay = boundary.ay;
  v2.bx = boundary.bx;
  v2.by = boundary.by;
  v2.vx = v2.bx - v2.ax;
  v2.vy = v2.by - v2.ay;
  v2.m = Math.sqrt(v2.vx * v2.vx + v2.vy * v2.vy);
  v2.dx = v2.vx / v2.m || 0;
  v2.dy = v2.vy / v2.m || 0;
  v2.ln = {};
  v2.ln.vx = v2.vy;
  v2.ln.vy = -v2.vx;
  v2.ln.dx = v2.ln.vx / v2.m || 0;
  v2.ln.dy = v2.ln.vy / v2.m || 0;

  //4. Get a vector between the start point of 
  //the sprite's motion vector and the start point of the line 
  let v3 = {};
  v3.vx = v2.ax - sprite.centerX + sprite.width/2;
  v3.vy = v2.ay - sprite.centerY + sprite.height/2;

  //5. You need two Dot products.
  //The first tells you whether the sprite is 
  //between the start and end points of the line
  let dp1 = v3.vx * v2.dx + v3.vy * v2.dy;

  //The second dot product tells you if the sprite has crossed the line
  let dp2 = v3.vx * v2.ln.dx + v3.vy * v2.ln.dy;

  return { dp1: dp1, dp2: dp2, v1: v1, v2: v2 };
}


export function wait(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}