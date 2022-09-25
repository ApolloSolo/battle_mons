const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

class Boundry {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundries = [];
const offset = {
  x: -880,
  y: -470,
};

collisionsMap.forEach((row, i) => {
  row.forEach((num, j) => {
    if (num === 1025) {
      boundries.push(
        new Boundry({
          position: {
            x: j * Boundry.width + offset.x,
            y: i * Boundry.height + offset.y,
          },
        })
      );
    }
  });
});

const mapImage = new Image();
mapImage.src = `./img/Poke_Style_Map.png`;

const playerImage = new Image();
playerImage.src = `./img/playerDown.png`;

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 } }) {
    this.position = position;
    this.velocity = velocity;
    this.image = image;
    this.frames = frames;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw() {
    c.drawImage(
      this.image,
      0, // Crop start x
      0, // Crop start y
      this.image.width / this.frames.max, // Crop end x
      this.image.height, // Crop end y
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max, // Width
      this.image.height // Height
    );
  }
}

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2, // Center image,
    y: canvas.height / 2 - 68 / 2, // Center image
  },
  image: playerImage,
  frames: { max: 4 },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: mapImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundries];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundries.forEach((boundry) => {
    boundry.draw();
  });
  player.draw();

  let moving = true;
  if (keys.w.pressed && lastKey === "w") {
    for (let i = 0; i < boundries.length; i++) {
      const boundry = boundries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundry,
            position: {
              x: boundry.position.x,
              y: boundry.position.y + 3,
            },
          },
        })
      ) {
        console.log("Colliding!");
        moving = false
        break;
      }
    }

    if(moving)
    movables.forEach((movable) => {
      movable.position.y += 3;
    });
  }
  if (keys.s.pressed && lastKey === "s") {
    for (let i = 0; i < boundries.length; i++) {
        const boundry = boundries[i];
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: {
              ...boundry,
              position: {
                x: boundry.position.x,
                y: boundry.position.y - 3,
              },
            },
          })
        ) {
          console.log("Colliding!");
          moving = false
          break;
        }
      }
  
      if(moving)
    movables.forEach((movable) => {
      movable.position.y -= 3;
    });
  }
  if (keys.a.pressed && lastKey === "a") {
    for (let i = 0; i < boundries.length; i++) {
        const boundry = boundries[i];
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: {
              ...boundry,
              position: {
                x: boundry.position.x + 3,
                y: boundry.position.y,
              },
            },
          })
        ) {
          console.log("Colliding!");
          moving = false
          break;
        }
      }
  
      if(moving)
    movables.forEach((movable) => {
      movable.position.x += 3;
    });
  }
  if (keys.d.pressed && lastKey === "d") {
    for (let i = 0; i < boundries.length; i++) {
        const boundry = boundries[i];
        if (
          rectangularCollision({
            rectangle1: player,
            rectangle2: {
              ...boundry,
              position: {
                x: boundry.position.x - 3,
                y: boundry.position.y,
              },
            },
          })
        ) {
          console.log("Colliding!");
          moving = false
          break;
        }
      }
  
      if(moving)
    movables.forEach((movable) => {
      movable.position.x -= 3;
    });
  }
}
animate();

let lastKey = "";
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
