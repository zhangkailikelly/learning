//坦克构造函数
function Tank(x, y, direction, color, speed, bulletSpeed) {
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.color = color;
  this.speed = speed;
  this.isAlive = true;
  this.enemyTanks = [];
  this.die = function () {
    this.isAlive = false;
  };
  this.distanceToBullet = function (bullet) {
    var x1, y1, x2 = bullet.x, y2 = bullet.y;
    switch (this.direction) {
      case 0:
      case 2:
      x1 = this.x + 13;
      y1 = this.y + 15;
        break;
      case 1:
      case 3:
      x1 = this.x + 15;
      y1 = this.y + 13;
        break;
      default:
    }
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  };
  this.moveUp = function () {
    this.y -= this.speed;
    this.direction = 0;
  };
  this.moveRight = function () {
    this.x += this.speed;
    this.direction = 1;
  };
  this.moveDown = function () {
    this.y += this.speed;
    this.direction = 2;
  };
  this.moveLeft = function () {
    this.x -= this.speed;
    this.direction = 3;
  };
  this.bullets = [];
  this.emitBullet = function () {
    var bullet;
    switch (this.direction) {
      case 0:
      bullet = new Bullet(this.x + 12, this.y-2, this.direction, this.color[1], bulletSpeed);
        break;
      case 1:
      bullet = new Bullet(this.x + 32, this.y + 12, this.direction, this.color[1], bulletSpeed);
        break;
      case 2:
      bullet = new Bullet(this.x + 12, this.y + 32, this.direction, this.color[1], bulletSpeed);
        break;
      case 3:
      bullet = new Bullet(this.x-2, this.y + 12, this.direction, this.color[1], bulletSpeed);
        break;
      default:
    }
    this.bullets.push(bullet);
    var timer = window.setInterval(function() {
      bullet.fly();
    }, 50);
    bullet.timer = timer;
    //检查子弹和敌方坦克距离的方法
    var that = this;
    bullet.checkDistanceToEnemy = function () {
      that.enemyTanks.forEach(function (tank) {
        if(tank.isAlive){
          var d = tank.distanceToBullet(bullet);
          if (d <= 15) {
            tank.die();
            bullet.isAlive = false;
          }
        }
      });
    };
    };

//画出坦克
this.draw = function() {
  //有子弹就画子弹
  if (this.bullets) {
    this.bullets.forEach(function(bullet) {
      if (bullet.isAlive) {
        bullet.draw();
      }
    });
  }
  //判断坦克状态，活着才画
  if(this.isAlive){
    switch (this.direction) {
      case 0:
      case 2:
        cxt.fillStyle = this.color[0];
        cxt.fillRect(this.x, this.y, 5, 30);
        cxt.fillRect(this.x + 6, this.y + 5, 14, 20);
        cxt.fillRect(this.x + 21, this.y, 5, 30);
        cxt.fillStyle = this.color[1];
        cxt.beginPath();
        cxt.arc(this.x + 13, this.y + 15, 5, 0, 2 * Math.PI, false);
        cxt.closePath();
        cxt.fill();
        cxt.strokeStyle = this.color[1];
        cxt.beginPath();
        cxt.lineWidth = 2;
        cxt.moveTo(this.x + 13, this.y + 15);
        if (this.direction === 0) {
          cxt.lineTo(this.x + 13, this.y);
        } else {
          cxt.lineTo(this.x + 13, this.y + 30);
        }
        cxt.closePath();
        cxt.stroke();
        break;
      case 1:
      case 3:
        cxt.fillStyle = this.color[0];
        cxt.fillRect(this.x, this.y, 30, 5);
        cxt.fillRect(this.x + 5, this.y + 6, 20, 14);
        cxt.fillRect(this.x, this.y + 21, 30, 5);
        cxt.fillStyle = this.color[1];
        cxt.beginPath();
        cxt.arc(this.x + 15, this.y + 13, 5, 0, 2 * Math.PI, false);
        cxt.closePath();
        cxt.fill();
        cxt.strokeStyle = this.color[1];
        cxt.beginPath();
        cxt.lineWidth = 2;
        cxt.moveTo(this.x + 15, this.y + 13);
        if (this.direction === 1) {
          cxt.lineTo(this.x + 30, this.y + 13);
        } else {
          cxt.lineTo(this.x, this.y + 13);
        }
        cxt.closePath();
        cxt.stroke();
        break;
      default:
    }
  }
};
}

//构造子弹函数
function Bullet(x,y,direction,color,speed){
  this.x = x;
  this.y = y;
  this.direction = direction;
  this.speed = speed;
  this.timer = null;
  this.isAlive = true;
  this.checkDistanceToEnemy = null;
  this.fly = function () {
    if (this.x <= 0 ||this.x >= 400 || this.y <=0 || this.y >= 300) {
      window.clearInterval(this.timer);
      this.isAlive = false;
    } else {
      switch (this.direction) {
        case 0:
          this.y -= this.speed;
          break;
        case 1:
          this.x += this.speed;
          break;
        case 2:
          this.y += this.speed;
          break;
        case 3:
          this.x -= this.speed;
          break;
        default:
      }
    }
    if (this.checkDistanceToEnemy) {
      this.checkDistanceToEnemy();
    }
  };
  this.draw = function () {
    cxt.fillStyle = color;
    cxt.fillRect(this.x, this.y, 2, 2);
  };
}

//通过对象冒充方法构造玩家的坦克
function Hero(x, y, direction, color, speed, bulletSpeed) {
  this.tank = Tank;
  this.tank(x, y, direction, color, speed, bulletSpeed);
}

//通过对象冒充方法构造敌方坦克
function Enemy(x, y, direction, color, speed, bulletSpeed) {
  this.tank = Tank;
  this.tank(x, y, direction, color, speed, bulletSpeed);
  //设置转向概率
  this.randomTurn = function () {
    //产生0-1的随机数
    var a = Math.random();
    //设置1%的转向概率
    if (a < 0.01) {
      //产生0、1、2、3、4的随机数
      this.direction = Math.floor(Math.random() * 4 + 0);
    }
    //当到达画布边缘时，调整方向，调整为相反方向的概率为50%，左右各25%
    var b = Math.random();
    if (this.x <= 0) {
      if (b >= 0 && b < 0.25) {
        this.direction = 0;
      } else if (b >= 0.25 && b < 0.75) {
        this.direction = 1;
      } else {
        this.direction = 2;
      }
    }
    if (this.y <= 0) {
      if (b >= 0 && b < 0.25) {
        this.direction = 1;
      } else if ( b >=0.25 && b < 0.75) {
        this.direction = 2;
      } else{
        this.direction = 3;
      }
    }
    if (this.x + 30 >= 400) {
      if(b >= 0 && b < 0.25){
        this.direction = 0;
      }else if ( b >=0.25 && b < 0.75) {
        this.direction = 3;
      }else{
        this.direction = 2;
      }
    }
    if (this.y + 30 >= 300) {
      if (b >= 0 && b < 0.25) {
        this.direction = 1;
      } else if ( b >=0.25 && b < 0.75) {
        this.direction = 0;
      } else{
        this.direction = 3;
      }
    }
  };
  //设置打子弹的频率
  this.randomEmitBullet = function() {
    var a = Math.random();
    if(a < 0.02){
      this.emitBullet();
    }
  };
  //坦克移动
  this.run = function(){
    this.randomTurn();
    this.randomEmitBullet();
    switch (this.direction) {
      case 0:
      if (this.y > 0) {
        this.y -= this.speed;
      }
      break;
      case 1:
      if (this.x + 30 < 400) {
        this.x += this.speed;
      }
      break;
      case 2:
      if (this.y + 30 < 300) {
        this.y += this.speed;
      }
      break;
      case 3:
      if (this.x > 0) {
        this.x -= this.speed;
      }
      break;
      default:
    }
  };
}

function flashTankMap(){
  //清除画布
  cxt.clearRect(0, 0, 400, 300);
  //重新绘制坦克
  hero.draw();
  enemies.forEach(function(enemy){
  enemy.draw();
  });
  document.getElementById("aa").innerHTML =
    "enemy1: " + enemies[0].x + "  ," + enemies[0].y + "<br/>" +
    "enemy2: " + enemies[1].x + "  ," + enemies[1].y +"<br/>" +
    "enemy3: " + enemies[2].x + "  ," + enemies[2].y +"<br/>" ;
}
