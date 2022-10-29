import kaboom from "kaboom";

// initialize context
kaboom();

// load assets
loadSprite("bird", "sprites/birdy.png");
loadSprite("bg", "sprites/bg.png");
loadSprite("pipe", "sprites/pipe.png");
loadSound("wooosh", "sounds/wooosh.mp3");

let highScore = 0;

scene("game", () => {
  const PIPE_GAP = 160;
  let score = 0;

  add([
    sprite("bg", { width: width(), height: height() })
  ]);

  const scoreText = add([
    text(score, { size: 50 })
  ]);

  // add a game object to screen
  const player = add([
    // list of components
    sprite("bird"),
    scale(2),
    pos(80, 40),
    area(),
    body(),
  ]);

  function producePipes() {
    const offset = rand(-50, 50);

    add([
      sprite("pipe"),
      pos(width(), height() / 2 + offset + PIPE_GAP / 2),
      "pipe",
      area(),
      scale(2),
      { passed: false }
    ]);

    add([
      sprite("pipe", { flipY: true }),
      pos(width(), height() / 2 + offset - PIPE_GAP / 2),
      origin("botleft"),
      "pipe",
      area(),
      scale(2)
    ]);
  }

  loop(1.5, () => {
    producePipes();
  });

  action("pipe", (pipe) => {
    pipe.move(-160, 0);

    if (pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      score += 1;
      scoreText.text = score;
    }
  });

  player.collides("pipe", () => {
    go("gameover", score);
  });

  player.action(() => {
    if (player.pos.y > height() + 30 || player.pos.y < -30) {
      go("gameover", score);
    }
  });

  onClick(() => {
    play("wooosh");
    player.jump(400);
  })

  keyPress("space", () => {
    play("wooosh");
    player.jump(400);
  });
});

scene("gameover", (score) => {
  if (score > highScore) {
    highScore = score;
  }

  add([
    text(
      "gameover!\n"
      + "score: " + score
      + "\nhigh score: " + highScore,
      { size: 45 }
    )
  ]);

  onClick(() => {
    go("game");
  });

  keyPress("space", () => {
    go("game");
  });
});

go("game");