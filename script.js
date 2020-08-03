  var container = document.querySelector('.container');
  var ball = document.querySelector('#ball');
  var paddle = document.querySelector('.paddle');
  var btn_start = document.querySelector('.startBtn');
  var gameOver = true;
  var gameInPlay = false;
  var score = 0;
  var lives = 5;
  var animationRepeat;
  var ballDir = [5, 5, 5];
  var containerDim = container.getBoundingClientRect();
  btn_start.addEventListener('click', startGame);
  document.addEventListener('keydown', function (e) {
      var key = e.keyCode;
      e.preventDefault();
      if (key === 37) paddle.left = true;
      else if (key === 39) paddle.right = true;
      else if (key === 38 && !gameInPlay) gameInPlay = true;
  });
  document.addEventListener('keyup', function (e) {
      var key = e.keyCode;
      e.preventDefault();
      if (key === 37) paddle.left = false;
      else if (key === 39) paddle.right = false;
  });

  function startGame() {
      if (gameOver) {
          document.querySelector('.gameover').style.display = 'none';
          ball.style.display = 'block';
          lives = 5;
          setupBricks(24);
          lifeUpdater();
          animationRepeat = requestAnimationFrame(update);
          gameOver = false;
          gameInPlay = false;
      }
  }

  function setupBricks(num) {
      var row = {
          x: ((containerDim.width % 100) / 2)
          , y: 50
      };
      for (var x = 0; x < num; x++) {
          if (row.x > (containerDim.width - 100)) {
              row.y += 70;
              row.x = ((containerDim.width % 100) / 2);
          }
          brickMaker(row);
          row.x += 100;
      }
  }

  function brickMaker(row) {
      var div = document.createElement('div');
      div.setAttribute('class', 'brick');
      div.style.background = 'linear-gradient(' + ranColor() + ', #ddd)';
      var pointDiv = Math.ceil(Math.random() * 10) + 2;
      div.dataset.points = pointDiv;
      div.innerHTML = pointDiv;
      div.style.left = row.x + 'px';
      div.style.top = row.y + 'px';
      container.appendChild(div);
  }

  function ranColor() {
      function c() {
          var hex = Math.floor(Math.random() * 256).toString(16);
          var response = ('0' + String(hex)).substr(-2);
          return response;
      }
      return '#' + c() + c() + c();
  }

  function update() {
      if (gameOver === false) {
          var pCurrent = paddle.offsetLeft;
          if (paddle.left && pCurrent > 0) {
              pCurrent -= 5;
          }
          else if (paddle.right && pCurrent < (containerDim.width - paddle.offsetWidth)) {
              pCurrent += 5;
          }
          paddle.style.left = pCurrent + 'px';
          if (!gameInPlay) {
              waitingOnPaddle();
          }
          else {
              ballMove();
          }
          animationRepeat = requestAnimationFrame(update);
      }
  }

  function waitingOnPaddle() {
      ball.style.top = (paddle.offsetTop - 22) + 'px';
      ball.style.left = (paddle.offsetLeft + 70) + 'px';
  }

  function ballMove() {
      var x = ball.offsetLeft;
      var y = ball.offsetTop;
      if (x > (containerDim.width - 20) || x < 0) {
          ballDir[0] *= -1;
      }
      if (y > (containerDim.height - 20) || y < 0) {
          if (y > (containerDim.height - 20)) {
              fallOffEdge();
              return;
          }
          ballDir[1] *= -1;
      }
      if (isCollide(ball, paddle)) {
          var nDir = ((x - paddle.offsetLeft) - (paddle.offsetWidth / 2)) / 10;
          ballDir[0] = nDir;
          ballDir[1] *= -1;
      }
      var tempBricks = document.querySelectorAll('.brick');
      if (tempBricks.length == 0) {
          stopper();
          setupBricks(20);
      }
      for (var tarBrick of tempBricks) {
          if (isCollide(tarBrick, ball)) {
              ballDir[1] *= -1;
              tarBrick.parentNode.removeChild(tarBrick);
              scoreUpdate(tarBrick.dataset.points);
          }
      }
      x += ballDir[0];
      y += ballDir[1];
      ball.style.top = y + 'px';
      ball.style.left = x + 'px';
  }

  function lifeUpdater() {
      document.querySelector('.lives').innerText = lives;
  }

  function scoreUpdate(num) {
      score += parseInt(num);
      document.querySelector('.score').innerText = score;
  }

  function stopper() {
      gameInPlay = false;
      ballDir[0, -5];
      waitingOnPaddle();
      window.cancelAnimationFrame(animationRepeat);
  }

  function endGame() {
      document.querySelector('.gameover').style.display = 'block';
      document.querySelector('.gameover').innerHTML = 'GAME OVER<br>Your Score ' + score;
      gameOver = true;
      ball.style.display = 'none';
      var tempBricks = document.querySelectorAll('.brick');
      for (var tarBrick of tempBricks) {
          tarBrick.parentNode.removeChild(tarBrick);
      }
  }

  function fallOffEdge() {
      lives--;
      if (lives < 0) {
          endGame();
          lives = 0;
      }
      lifeUpdater();
      stopper();
  }

  function isCollide(a, b) {
      var aRect = a.getBoundingClientRect();
      var bRect = b.getBoundingClientRect();
      return (!(aRect.bottom < bRect.top || aRect.top > bRect.bottom || aRect.right < bRect.left || aRect.left > bRect.right));
  }