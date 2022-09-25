const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

const battleZonesMap = [];
for (let i = 0; i < battle_zones.length; i += 70) {
  battleZonesMap.push(battle_zones.slice(i, i + 70));
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

const battleZones = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((num, j) => {
    if (num === 1025) {
      battleZones.push(
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

const foregroundImage = new Image();
foregroundImage.src = `./img/Poke_Style_Foreground.png`;

const playerDownImage = new Image();
playerDownImage.src = `./img/playerDown.png`;

const upImage = new Image();
upImage.src = `./img/playerUp.png`;

const leftImage = new Image();
leftImage.src = `./img/playerLeft.png`;

const rightImage = new Image();
rightImage.src = `./img/playerRight.png`;

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2, // Center image,
    y: canvas.height / 2 - 68 / 2, // Center image
  },
  image: playerDownImage,
  frames: { max: 4 },
  sprites: {
    up: upImage,
    left: leftImage,
    right: rightImage,
    down: playerDownImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: mapImage,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
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

const movables = [background, ...boundries, foreground, ...battleZones];

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
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();

  if (keys.w.pressed || keys.a.pressed || keys.d.pressed || keys.s.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < .02
      ) {
        console.log("Battle collision!");
        break;
      }
    }
  }

  let moving = true;
  player.moving = false;
  if (keys.w.pressed && lastKey === "w") {
    player.moving = true;
    player.image = player.sprites.up;
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
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  }
  if (keys.s.pressed && lastKey === "s") {
    player.moving = true;
    player.image = player.sprites.down;
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
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  }
  if (keys.a.pressed && lastKey === "a") {
    player.moving = true;
    player.image = player.sprites.left;
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
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  }
  if (keys.d.pressed && lastKey === "d") {
    player.moving = true;
    player.image = player.sprites.right;
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
        moving = false;
        break;
      }
    }

    if (moving)
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
