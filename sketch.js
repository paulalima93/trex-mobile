var trex, trex_running, trex_dead;
var ground, ground_image;
var invisible_ground;
var cloud, cloud_image;
var obstacle;
var obstacle_image1, obstacle_image2, obstacle_image3, obstacle_image4, obstacle_image5, obstacle_image6;
var score = 0;
var cloudsGroup, obstaclesGroup;
var game_over, game_over_image;
var restart, restart_image;
var gameState = "play";
var die_sound, jump_sound, check_sound;

//carrega imagens e armazena nas variáveis
function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_dead = loadAnimation("trex_collided.png");
  ground_image = loadImage("ground2.png");
  cloud_image = loadImage("cloud.png");
  obstacle_image1 = loadImage("obstacle1.png");
  obstacle_image2 = loadImage("obstacle2.png");
  obstacle_image3 = loadImage("obstacle3.png");
  obstacle_image4 = loadImage("obstacle4.png");
  obstacle_image5 = loadImage("obstacle5.png");
  obstacle_image6 = loadImage("obstacle6.png");
  game_over_image = loadImage("gameOver.png");
  restart_image = loadImage("restart.png");
  die_sound = loadSound("die.mp3");
  jump_sound = loadSound("jump.mp3");
  check_sound = loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(windowWidth,windowHeight)
  //createCanvas(600,200)

  //cria o sprite do chão com animação
  ground = createSprite(300,height-10,600,20);
  ground.addImage("chaozinho", ground_image);
  ground.velocityX = -10;

  //crie um sprite de trex
  trex = createSprite(50, height-50, 50,50);
  trex.addAnimation("correndo", trex_running);
  trex.addAnimation("faleceu", trex_dead);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 30);

  //cria o chão invisível
  invisible_ground = createSprite(300,height-4,600,5);
  invisible_ground.visible = false;

  game_over = createSprite(width/2,height/2-40);
  game_over.addImage(game_over_image);
  game_over.scale = 0.5;

  
  restart = createSprite(width/2, height/2);
  restart.addImage(restart_image);
  restart.scale = 0.5;

  // var aleatorio = Math.round(random(1,10))
  // console.log(aleatorio)

  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  
}

function draw(){
  background("white");

  text("Pontuação: " + score, width-100, 50)
 
  if(gameState === "play") {
    if(ground.x < 0){
      ground.x = ground.width/2
    }

    game_over.visible = false;
    restart.visible = false;
    if(touches.length > 0 || keyDown("space") && trex.y > height-35){
      trex.velocityY = -10;
      jump_sound.play();
      touches = []
    }

    //aumenta a velocidade do chão
    ground.velocityX = -(10 + 3* score/100);

    spawnClouds();
    spawnObstacles();

    score = score + Math.round(getFrameRate()/30);
   
    if (score>0 && score%500===0) {
      check_sound.play();
    }

    if(trex.isTouching(obstaclesGroup)){
      gameState = "end";
      die_sound.play();
      // trex.velocityY = -10;
      // jump_sound.play();

    }

  } else if(gameState === "end") {
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    game_over.visible = true;
    restart.visible = true;
    
    trex.changeAnimation("faleceu");
    //trex.y = 170;
    //trex.velocityY = 0;

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0) {      
      reset();
      touches = []
    }

    if(mousePressedOver(restart)){
      console.log("Clicou em restart")
      reset();
    }
  }


  trex.velocityY += 0.5;

  trex.collide(invisible_ground);

  drawSprites();
}

function reset(){
  gameState = "play";
  score = 0;
  restart.visible = false;
  game_over.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("correndo")
}

function spawnClouds(){
 // console.log(frameCount)
  if(frameCount % 60 === 0){
    cloud = createSprite(width+100,100,40,10);
    cloud.velocityX = -3;
    cloud.y = Math.round(random(20,100));
    cloud.addImage(cloud_image);
    cloud.scale = 0.7

    cloud.depth = trex.depth;
    trex.depth += 1;
    //trex.depth = trex.depth + 1

    //como calcular o tempo exato para passar da tela
    //largura da tela / velocidade da nuvem
    // 700/3 = 233, coloquei 250 de folga pra não sumir ao passar
    cloud.lifetime = 500;

    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    obstacle = createSprite(width+100, height-25, 10, 40);
    obstacle.velocityX = -10;
    obstacle.scale = 0.6
    obstacle.lifetime = 500;
    obstacle.velocityX = -(10 + 3* score/100);
    var aleatorio = Math.round(random(1,6))

    switch(aleatorio){
      case 1: obstacle.addImage(obstacle_image1);
        break;
      case 2: obstacle.addImage(obstacle_image2);
        break;
      case 3: obstacle.addImage(obstacle_image3);
        break;
      case 4: obstacle.addImage(obstacle_image4);
        break;
      case 5: obstacle.addImage(obstacle_image5);
        break;
      case 6: obstacle.addImage(obstacle_image6);
        break;
    }

    obstaclesGroup.add(obstacle)
  }
}


