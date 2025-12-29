let frameWidth;

// ----- 快霞角色變數 -----
let spriteSheetKuaiXia;
let animationKuaiXia = [];
const totalFramesKuaiXia = 4;
let currentFrameKuaiXia = 0;
let frameWidthKuaiXia;
let characterKuaiXiaX;
let characterKuaiXiaY;
// ----- 尼克角色變數 -----
let animationNick = [];
const totalFramesNick = 3;
let currentFrameNick = 0;
let characterNickX;
let characterNickY;
// ----- 茱蒂角色變數 -----
let spriteSheetJudy;
let animationJudy = [];
const totalFramesJudy = 5;
let currentFrameJudy = 0;
let frameWidthJudy;
let characterJudyX;
let characterJudyY;
// ----- 羊角色變數 -----
let spriteSheetSheep;
let animationSheep = [];
const totalFramesSheep = 4;
let currentFrameSheep = 0;
let frameWidthSheep;
let characterSheepX;
let characterSheepY;
// ----- 蓋瑞角色變數 -----
let animationGary = [];
const totalFramesGary = 2;
let currentFrameGary = 0;
let characterGaryX;
let characterGaryY;
let garyScale = 1;
let isGaryActive = false; // 是否觸發變大與攻擊
// CSV 題庫與對話
let questionsTable;
let questions = [];
let questionsTable3; // 角色3的題庫表格
let questions3 = []; // 角色3的題目陣列
let currentNpc = 0;  // 目前互動的 NPC 編號 (0:無, 4:尼克, 5:茱蒂)
let lastHint = '';   // 新增：紀錄上一題的提示
let lastQuestionNpc = 0; // 紀錄上一題是誰出的
let character2Dialogue = '';
let showDialogue = false;
let dialogueTimer = 0; // 顯示計時器（以 frame 為單位）
// 目前對話框位置（用於避免重疊）
let dialogBox = { x: 0, y: 0, w: 0, h: 0 };
// 玩家輸入與獎勵系統
let playerInput; // p5 input element
let score = 0;
let baseMoveSpeed = 8;
let rewardTimer = 0; // 獎勵持續計時
let currentQuestionIndex = -1; // 當前題目索引
let retryButton;
let nextButton;
let bgImg;
let bgX = 0;
let song; // 音樂變數

// ----- 遊戲變數 -----
let gameState = 'start'; // 遊戲狀態: 'start' 或 'playing'

// ----- 角色屬性 -----
let characterX;
let characterY;
let groundY; // 地面高度
let moveSpeed = 8; // 增加移動速度
let facingDirection = 1; // 1: 向右, -1: 向左

// ----- 跳躍物理屬性 -----
let isJumping = false;
let velocityY = 3.5;
const jumpPower = -25; // 讓跳躍更有力
const gravity = 3.5;   // 讓角色更快落地
let jumpCount = 0;
let fireworks = []; // 煙火陣列

function preload() {
  spriteSheetJudy = loadImage('茱蒂/stop/all.png.png'); // 修正檔名：實際檔案為 all.png.png
  bgImg = loadImage('動物3背景.png');
  // 載入題庫 CSV（必須放在專案根目錄）
  questionsTable = loadTable('questions.csv', 'csv', 'header');
  questionsTable3 = loadTable('name_questions.csv', 'csv', 'header'); // 載入角色3的題庫
  // 載入尼克的三張走路圖片 (尼克/走路/0.png ... 尼克/走路/2.png)
  for (let i = 0; i < totalFramesNick; i++) {
    animationNick[i] = loadImage(`尼克/走路/${i}.png`);
  }
  // 載入快霞的精靈圖片
  spriteSheetKuaiXia = loadImage('快霞/run/run.png');
  // 載入羊的精靈圖片 (請確認資料夾 '羊' 存在，且內有 all.png)
  spriteSheetSheep = loadImage('羊/all.png');
  // 載入蓋瑞圖片
  for (let i = 0; i < totalFramesGary; i++) {
    animationGary[i] = loadImage(`蓋瑞/${i}.png`);
  }
  // 載入音樂 (來自 sketch(2).js)
  song = loadSound('music.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bgImg);

  // 裁切茱蒂的圖片精靈 (假設尺寸類似，5張)
  if (spriteSheetJudy.width > 1) {
    frameWidthJudy = spriteSheetJudy.width / totalFramesJudy;
    for (let i = 0; i < totalFramesJudy; i++) {
      let frame = spriteSheetJudy.get(i * frameWidthJudy, 0, frameWidthJudy, spriteSheetJudy.height);
      animationJudy.push(frame);
    }
  }

  // 裁切快霞的圖片精靈 (4張)
  if (spriteSheetKuaiXia.width > 1) {
    frameWidthKuaiXia = spriteSheetKuaiXia.width / totalFramesKuaiXia;
    for (let i = 0; i < totalFramesKuaiXia; i++) {
      let frame = spriteSheetKuaiXia.get(i * frameWidthKuaiXia, 0, frameWidthKuaiXia, spriteSheetKuaiXia.height);
      animationKuaiXia.push(frame);
    }
  }

  // 裁切羊的圖片精靈 (4張)
  if (spriteSheetSheep.width > 1) {
    frameWidthSheep = spriteSheetSheep.width / totalFramesSheep;
    for (let i = 0; i < totalFramesSheep; i++) {
      let frame = spriteSheetSheep.get(i * frameWidthSheep, 0, frameWidthSheep, spriteSheetSheep.height);
      animationSheep.push(frame);
    }
  }

  // 使用快霞圖片作為基準寬高 (替代原本的舊主角或尼克)
  frameWidth = frameWidthKuaiXia;

  // 解析 CSV 表格為 questions 陣列
  if (questionsTable && questionsTable.getRowCount() > 0) {
    for (let r = 0; r < questionsTable.getRowCount(); r++) {
      const row = questionsTable.getRow(r);
      questions.push({
        question: row.getString('question'),
        answer: row.getString('answer'),
        correctFeedback: row.getString('correctFeedback'),
        wrongFeedback: row.getString('wrongFeedback'),
        hint: row.getString('hint')
      });
    }
  }

  // 解析角色3的 CSV 表格 (中文欄位: 題目,答案,答對回饋,答錯回饋,提示)
  if (questionsTable3 && questionsTable3.getRowCount() > 0) {
    for (let r = 0; r < questionsTable3.getRowCount(); r++) {
      const row = questionsTable3.getRow(r);
      questions3.push({
        question: row.getString('題目'),
        answer: row.getString('答案'),
        correctFeedback: row.getString('答對回饋'),
        wrongFeedback: row.getString('答錯回饋'),
        hint: row.getString('提示')
      });
    }
  }

  // 設定角色初始位置
  characterX = width / 2 - frameWidth / 2;
  // 使用走路圖片高度來決定地面高度
  groundY = height - (animationKuaiXia.length > 0 ? animationKuaiXia[0].height : 100) - 50; // 增加安全檢查
  characterY = groundY;

  // 設定尼克初始位置 (交換位置：改為在主角右邊)
  characterNickX = characterX + 600;
  characterNickY = groundY + (animationKuaiXia.length > 0 ? animationKuaiXia[0].height : 100) - animationNick[0].height + 70;

  // 設定茱蒂初始位置 (交換位置：改為在尼克右邊)
  characterJudyX = characterNickX + 1500;
  characterJudyY = groundY + (animationKuaiXia.length > 0 ? animationKuaiXia[0].height : 100) + 150 - (animationJudy.length > 0 ? animationJudy[0].height * 0.8 : 0);

  // 設定羊初始位置 (在茱蒂右邊 700)
  characterSheepX = characterJudyX + 700;
  // 對齊地面 (使用快霞的高度作為地面基準，計算羊的底部位置)
  characterSheepY = groundY + (animationKuaiXia.length > 0 ? animationKuaiXia[0].height : 100) - (animationSheep.length > 0 ? animationSheep[0].height : 0);

  // 設定蓋瑞初始位置 (在羊右邊 2000)
  characterGaryX = characterSheepX + 2000;
  characterGaryY = groundY + (animationKuaiXia.length > 0 ? animationKuaiXia[0].height : 100) - animationGary[0].height;

  // 設定快霞初始位置 (開始畫面中央，遊戲中在主角右邊)
  characterKuaiXiaX = width / 2 - frameWidthKuaiXia / 2;
  characterKuaiXiaY = height / 2 - spriteSheetKuaiXia.height / 2 + 70; // 往下移 50 像素
  // 提高動畫播放速度以配合移動

  frameRate(15);

  // 初始時不播放動畫
  noLoop();

  // 設定基礎速度與建立玩家輸入欄（隱藏，碰到題目時顯示）
  baseMoveSpeed = moveSpeed;
  playerInput = createInput('');
  playerInput.attribute('placeholder', '輸入答案並按 Enter');
  playerInput.size(140);
  playerInput.hide();
  // 使用原生事件監聽 Enter
  playerInput.elt.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  });

  // 建立答題控制按鈕，預設隱藏
  retryButton = createButton('再作答一次');
  retryButton.hide();
  retryButton.mousePressed(function () {
    retryQuestion();
  });

  nextButton = createButton('下一題');
  nextButton.hide();
  nextButton.mousePressed(function () {
    nextQuestion();
    });  
}

function draw() {
  // 繪製背景 (三張圖串接：左、中、右)
  image(bgImg, bgX, 0, width, height);
  image(bgImg, bgX - width, 0, width, height);
  image(bgImg, bgX + width, 0, width, height);

  // 背景循環邏輯：當背景移動超過寬度時重置，造成無限捲動效果
  if (bgX <= -width) bgX += width;
  if (bgX >= width) bgX -= width;

  if (gameState === 'playing') {
    let isMoving = false;

    // 判斷是否按下 Shift 鍵加速 (跑步模式)
    let currentSpeed = moveSpeed;
    if (keyIsDown(SHIFT)) {
      currentSpeed = baseMoveSpeed * 2;
    }

    // ----- 鍵盤控制 -----
    if (keyIsDown(RIGHT_ARROW)) {
      bgX -= currentSpeed; // 背景往左移
      characterJudyX -= currentSpeed; // 茱蒂 也要跟著背景移動
      characterNickX -= currentSpeed; // 尼克 也要跟著背景移動
      characterSheepX -= currentSpeed; // 羊 也要跟著背景移動
      characterGaryX -= currentSpeed; // 蓋瑞 也要跟著背景移動
      facingDirection = 1;
      isMoving = true;
    }
    if (keyIsDown(LEFT_ARROW)) {
      bgX += currentSpeed; // 背景往右移
      characterJudyX += currentSpeed; // 茱蒂 也要跟著背景移動
      characterNickX += currentSpeed; // 尼克 也要跟著背景移動
      characterSheepX += currentSpeed; // 羊 也要跟著背景移動
      characterGaryX += currentSpeed; // 蓋瑞 也要跟著背景移動
      facingDirection = -1;
      isMoving = true;
    }

    // ----- 跳躍邏輯 -----
    if (isJumping) {
      characterY += velocityY;
      velocityY += gravity;

      if (characterY >= groundY) {
        characterY = groundY;
        isJumping = false;
        velocityY = 0;
        jumpCount = 0;
      }
    }

    // ----- 蓋瑞邏輯 -----
    if (score >= 3) {
      // 提示玩家往右走
      push();
      fill(255, 255, 0);
      textSize(24);
      textAlign(CENTER);
      text("恭喜答對三題！請繼續往右走尋找蓋瑞！", width / 2, 100);
      pop();

      // 檢查與蓋瑞的距離，靠近時觸發遊戲成功
      if (dist(characterX, characterY, characterGaryX, characterGaryY) < 400) {
        gameState = 'gameover'; // 找到蓋瑞，遊戲成功
      }
    }

    // ----- 碰撞檢測 (角色1 與 角色2) -----
    // 使用簡單 AABB 碰撞
    let w1 = frameWidthKuaiXia; // 改為快霞的寬度
    let h1 = animationKuaiXia[0].height; // 改為快霞的高度
    // let w2 = frameWidth; // 改為統一寬度 (與主角相同)
    // let h2 = animationKuaiXia[0].height; // 改為統一高度 (與主角相同)
    let left1 = characterX; // 修正：使用 characterX 而非 characterKuaiXiaX，因為碰撞邏輯是基於畫面中心的判定
    let right1 = characterX + w1;
    let top1 = characterY;
    let bottom1 = characterY + h1;

    // 尼克 的碰撞框
    let leftNick = characterNickX;
    let rightNick = characterNickX + animationNick[0].width;
    let topNick = characterNickY;
    let bottomNick = characterNickY + animationNick[0].height;

    // 茱蒂 的碰撞框
    let leftJudy = characterJudyX;
    let rightJudy = characterJudyX + frameWidthJudy * 0.8; // 修正寬度計算與比例
    let topJudy = characterJudyY;
    let bottomJudy = characterJudyY + animationJudy[0].height * 0.8; // 修正高度計算與比例

    // 羊 的碰撞框
    let leftSheep = characterSheepX;
    let rightSheep = characterSheepX + animationSheep[0].width;
    let topSheep = characterSheepY;
    let bottomSheep = characterSheepY + animationSheep[0].height;

    const isCollidingNick = (right1 > leftNick && left1 < rightNick && bottom1 > topNick && top1 < bottomNick);
    const isCollidingJudy = (right1 > leftJudy && left1 < rightJudy && bottom1 > topJudy && top1 < bottomJudy);
    const isCollidingSheep = (right1 > leftSheep && left1 < rightSheep && bottom1 > topSheep && top1 < bottomSheep);

    // 判斷與哪個 NPC 碰撞
    if (isCollidingNick || isCollidingJudy || isCollidingSheep) {
      
      // 新增：羊的互動邏輯 (持續偵測 下鍵)
      if (isCollidingSheep) {
        currentNpc = 6;
        showDialogue = true;
        dialogueTimer = 10; // 保持對話框顯示
        
        if (keyIsDown(DOWN_ARROW)) {
          if (lastQuestionNpc === 5) {
            character2Dialogue = '提示: ' + (lastHint || '還沒有題目喔');
          } else {
            character2Dialogue = '我只知道茱蒂的問題提示喔';
          }
        } else {
          character2Dialogue = '答錯了嗎？在羊身邊按下 下鍵 則給予該題提示';
        }
        
        // 隱藏輸入框與按鈕 (羊不負責答題)
        if (playerInput) playerInput.hide();
        if (retryButton) retryButton.hide();
        if (nextButton) nextButton.hide();
        
      } else if (!showDialogue) {
        // 根據碰撞對象選擇題庫
        if (isCollidingNick) {
          currentNpc = 4;
          if (questions3.length > 0) {
            const idx = floor(random(0, questions3.length));
            currentQuestionIndex = idx;
            character2Dialogue = questions3[idx].question;
            lastHint = questions3[idx].hint; // 紀錄提示
            lastQuestionNpc = 4;
          } else {
            character2Dialogue = '你好！(無題目)';
            lastHint = '';
            lastQuestionNpc = 0;
          }
        } else if (isCollidingJudy) {
          currentNpc = 5;
          if (questions.length > 0) {
            const idx = floor(random(0, questions.length));
            currentQuestionIndex = idx;
            character2Dialogue = questions[idx].question;
            lastHint = questions[idx].hint; // 紀錄提示
            lastQuestionNpc = 5;
          } else {
            character2Dialogue = '題庫不存在或無題目';
            lastHint = '';
            lastQuestionNpc = 0;
          }
        }

        showDialogue = true;
        dialogueTimer = 300; // 顯示 300 幀（備援，但若離開會立即隱藏）
        
        // 顯示玩家輸入欄，並聚焦
        if (playerInput) {
          playerInput.show();
          playerInput.value('');
          playerInput.elt.focus();
        }
        // 隱藏按鈕（如果之前有顯示）
        if (retryButton) retryButton.hide();
        if (nextButton) nextButton.hide();
      }
    } else {
      // 未碰到時立即隱藏題目與輸入欄與按鈕
      showDialogue = false;
      currentNpc = 0;
      character2Dialogue = '';
      if (playerInput) playerInput.hide();
      if (retryButton) retryButton.hide();
      if (nextButton) nextButton.hide();
      currentQuestionIndex = -1;
    }

    // 如果文字正在顯示，遞減計時器（僅在仍碰撞或為回饋時有作用）
    if (showDialogue) {
      dialogueTimer--;
      if (dialogueTimer <= 0) {
        showDialogue = false;
        character2Dialogue = '';
        if (playerInput) playerInput.hide();
        if (retryButton) retryButton.hide();
        if (nextButton) nextButton.hide();
      }
    }

    // 處理獎勵計時（例如暫時移速加成）
    if (rewardTimer > 0) {
      rewardTimer--;
      if (rewardTimer <= 0) {
        moveSpeed = baseMoveSpeed; // 回復原速
      }
    }

    // ----- 動畫更新 -----
    // (移除舊主角動畫更新邏輯)

    currentFrameJudy = floor(frameCount / 4) % totalFramesJudy;
    currentFrameNick = floor(frameCount / 4) % totalFramesNick;
    currentFrameKuaiXia = floor(frameCount / 4) % totalFramesKuaiXia;
    currentFrameSheep = floor(frameCount / 4) % totalFramesSheep;
    currentFrameGary = floor(frameCount / 10) % totalFramesGary; // 蓋瑞動畫速度

  }

  // ----- 繪製角色 -----
  // 改為繪製快霞作為主角
  if (animationKuaiXia.length > 0) {
    const img = animationKuaiXia[currentFrameKuaiXia];
    push();
    translate(characterX + frameWidthKuaiXia / 2, 0);
    scale(facingDirection, 1);
    // 調整高度以對齊地面 (使用 animation[0].height 作為地面基準)
    image(img, -img.width / 2, characterY + animationKuaiXia[0].height - img.height);
    pop();
  }

  // ----- 繪製茱蒂 -----
  // 修正：使用茱蒂原本的寬高 (frameWidthJudy, animationJudy[0].height) 乘以 1.5，避免被拉寬
  if (animationJudy.length > 0) {
    image(animationJudy[currentFrameJudy], characterJudyX, characterJudyY, frameWidthJudy * 0.8, animationJudy[0].height * 0.8); // 比例改為 0.8
  }

  // ----- 繪製羊 -----
  if (animationSheep.length > 0) {
    image(animationSheep[currentFrameSheep], characterSheepX, characterSheepY);
  }

  // ----- 繪製蓋瑞 -----
  if (animationGary.length > 0) {
    // 計算放大後的繪製位置，確保底部對齊地面
    let gW = animationGary[0].width * garyScale;
    let gH = animationGary[0].height * garyScale;
    let drawY = characterGaryY - (gH - animationGary[0].height);
    image(animationGary[currentFrameGary], characterGaryX, drawY, gW, gH);
  }


  // ----- 繪製尼克 -----
  push();
  translate(characterNickX + animationNick[0].width / 2, 0);
  scale(-1, 1);
  image(animationNick[currentFrameNick], -animationNick[0].width / 2, characterNickY);
  pop();

  // 顯示對話文字（若有）- 顯示在當前互動的 NPC 頭上
  if (showDialogue && character2Dialogue) {
    push();
    textAlign(LEFT);
    const chatTextSize = 16;
    textSize(chatTextSize);
    fill(255);
    noStroke();

    const padding = 8;
    const maxWidthLimit = 360;
    const raw = character2Dialogue;
    const words = raw.split(/\s+/);
    let lines = [];
    let cur = '';
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const test = cur === '' ? w : cur + ' ' + w;
      const tw = textWidth(test);
      if (tw > maxWidthLimit - padding * 2 && cur !== '') {
        lines.push(cur);
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur !== '') lines.push(cur);

    if (character2Dialogue.indexOf('\n') >= 0) {
      lines = [];
      const chunks = character2Dialogue.split('\n');
      for (let c of chunks) {
        const parts = c.split(/\s+/);
        let l = '';
        for (let p of parts) {
          const t = l === '' ? p : l + ' ' + p;
          if (textWidth(t) > maxWidthLimit - padding * 2 && l !== '') {
            lines.push(l);
            l = p;
          } else {
            l = t;
          }
        }
        if (l !== '') lines.push(l);
      }
    }

    let boxW = 0;
    for (let ln of lines) {
      boxW = max(boxW, textWidth(ln));
    }
    boxW = min(boxW, maxWidthLimit - padding * 2);
    const lineHeight = chatTextSize * 1.2;
    const boxH = lines.length * lineHeight + padding * 2;

    let tx, tyBase;
    if (currentNpc === 4) {
      tx = characterNickX;
      tyBase = characterNickY;
    } else {
      tx = characterJudyX;
      tyBase = characterJudyY;
    }
    if (currentNpc === 6) { tx = characterSheepX; tyBase = characterSheepY; }
    const ty = tyBase - 20 - boxH;

    fill('#222');
    rect(tx - padding, ty - padding, boxW + padding * 2, boxH + padding * 2, 8);

    dialogBox.x = tx - padding;
    dialogBox.y = ty - padding;
    dialogBox.w = boxW + padding * 2;
    dialogBox.h = boxH + padding * 2;

    fill(255);
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], tx, ty + padding + (i + 1) * lineHeight - lineHeight / 4);
    }
    pop();
  }

  // 顯示玩家頭上的輸入欄（當有題目時）
  if (showDialogue && playerInput) {
    const inputW = 140;
    const px = floor(characterX + frameWidth / 2 - inputW / 2);
    let py = floor(characterY - 70);
    try {
      const inputH = (playerInput.elt && playerInput.elt.offsetHeight) ? playerInput.elt.offsetHeight : 24;
      const inputRect = { x: px, y: py, w: inputW, h: inputH };
      const db = dialogBox;
      const overlap = !(inputRect.x + inputRect.w < db.x || inputRect.x > db.x + db.w || inputRect.y + inputRect.h < db.y || inputRect.y > db.y + db.h);
      if (overlap) {
        py = Math.floor(db.y - inputH - 8);
      }
    } catch (e) {}
    playerInput.position(px, py);
    playerInput.show();
  }

  // 定位並顯示按鈕（如果有）
  if (showDialogue) {
    const padding = 8;
    const maxWidthLimit = 360;
    const raw = character2Dialogue || '';
    const words = raw.split(/\s+/);
    let linesCalc = [];
    let curCalc = '';
    textSize(16);
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const test = curCalc === '' ? w : curCalc + ' ' + w;
      const tw = textWidth(test);
      if (tw > maxWidthLimit - padding * 2 && curCalc !== '') {
        linesCalc.push(curCalc);
        curCalc = w;
      } else {
        curCalc = test;
      }
    }
    if (curCalc !== '') linesCalc.push(curCalc);
    if (raw.indexOf('\n') >= 0) {
      linesCalc = [];
      const chunks = raw.split('\n');
      for (let c of chunks) {
        const parts = c.split(/\s+/);
        let l = '';
        for (let p of parts) {
          const t = l === '' ? p : l + ' ' + p;
          if (textWidth(t) > maxWidthLimit - padding * 2 && l !== '') {
            linesCalc.push(l);
            l = p;
          } else {
            l = t;
          }
        }
        if (l !== '') linesCalc.push(l);
      }
    }

    let boxW = 0;
    for (let ln of linesCalc) boxW = max(boxW, textWidth(ln));
    boxW = min(boxW, maxWidthLimit - padding * 2);
    const btnW = 120;
    const btnH = 28;
    let tx, tyBase;
    if (currentNpc === 4) {
      tx = characterNickX;
      tyBase = characterNickY;
    } else {
      tx = characterJudyX;
      tyBase = characterJudyY;
    }
    const lineHeight = 16 * 1.2;
    const boxH = linesCalc.length * lineHeight + padding * 2;
    const ty = tyBase - 20 - boxH;
    const bx = tx + (boxW - btnW) / 2;
    const by = ty - btnH - 8;

    if (retryButton && retryButton.style('display') !== 'none') {
      retryButton.position(floor(bx), floor(by));
      retryButton.show();
    }
    if (nextButton && nextButton.style('display') !== 'none') {
      nextButton.position(floor(bx), floor(by));
      nextButton.show();
    }
  }

  push();
  fill(0);
  noStroke();
  textSize(18);
  textAlign(LEFT);
  text(`Score: ${score}`, 16, 28);
  pop();

  // ----- 開始畫面提示 -----
  if (gameState === 'start') {
    fill(0);
    textAlign(CENTER);
    textSize(24);
    text('Click to Start', width / 2, height / 2 + 150);

    // 繪製快霞動畫
    image(animationKuaiXia[currentFrameKuaiXia], characterKuaiXiaX, characterKuaiXiaY);
  }

  // ----- 遊戲結束畫面 -----
  if (gameState === 'gameover') {
    fill(0, 150);
    rect(0, 0, width, height);

    // 煙火特效邏輯
    if (random(1) < 0.05) {
      fireworks.push(new Firework());
    }
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].show();
      if (fireworks[i].done()) {
        fireworks.splice(i, 1);
      }
    }

    fill(255);
    textSize(60);
    textAlign(CENTER);
    text("恭喜通關！", width / 2, height / 2);
  }
}

// 檢查玩家輸入答案
function checkAnswer() {
  console.log('checkAnswer called, currentNpc:', currentNpc, 'currentQuestionIndex:', currentQuestionIndex);
  if (currentQuestionIndex < 0) return;
  let currentQ;
  if (currentNpc === 4) {
    currentQ = questions3[currentQuestionIndex];
  } else if (currentNpc === 5 || currentNpc === 6) { // 羊(6) 使用通用題庫
    currentQ = questions[currentQuestionIndex];
  }
  if (!currentQ) return;

  const user = playerInput.value().trim();
  console.log('user input:', user);
  const correct = currentQ.answer ? currentQ.answer.trim() : '';
  if (user === '') {
    console.log('user input is empty, returning');
    return;
  }

  if (correct === '' || user === correct) {
    console.log('answer correct');
    if (currentNpc === 4) {
      // 尼克的特殊回饋
      character2Dialogue = `唉呦${user} 跟那小蘿蔔一樣小隻`;
      console.log('Nick response:', character2Dialogue);
    } else {
      character2Dialogue = currentQ.correctFeedback || '答對了！';
      score += 1;
      rewardTimer = 300;
      moveSpeed = baseMoveSpeed * 1.5;
    }
    playerInput.hide();
    showDialogue = true;
    dialogueTimer = 180;
    currentQuestionIndex = -1;
    if (nextButton) {
      nextButton.show();
      if (retryButton) retryButton.hide();
    }
  } else {
    console.log('answer wrong');
    character2Dialogue = (currentQ.wrongFeedback || '答錯了'); // 移除直接提示，引導玩家去找羊
    showDialogue = true;
    dialogueTimer = 180;
    if (retryButton) {
      retryButton.show();
      if (nextButton) nextButton.hide();
    }
  }
}

// ----- 煙火特效類別 -----
class Firework {
  constructor() {
    this.firework = new Particle(random(width), height, true);
    this.exploded = false;
    this.particles = [];
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(createVector(0, 0.2));
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(createVector(0, 0.2));
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, false);
      this.particles.push(p);
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}

class Particle {
  constructor(x, y, firework) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;
    this.acc = createVector(0, 0);
    if (this.firework) {
      this.vel = createVector(0, random(-18, -10)); // 調整發射高度
    } else {
      this.vel = p5.Vector.random2D();
      this.vel.mult(random(2, 10));
    }
    this.color = color(random(255), random(255), random(255));
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.9);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    if (!this.firework) {
      strokeWeight(4);
      stroke(red(this.color), green(this.color), blue(this.color), this.lifespan);
    } else {
      strokeWeight(6);
      stroke(255, 255, 0);
    }
    point(this.pos.x, this.pos.y);
  }
}

function retryQuestion() {
  if (currentQuestionIndex < 0) return;
  if (currentNpc === 4) {
    character2Dialogue = questions3[currentQuestionIndex].question;
  } else if (currentNpc === 5) {
    character2Dialogue = questions[currentQuestionIndex].question;
  } else if (currentNpc === 6) {
    character2Dialogue = questions[currentQuestionIndex].question;
  }
  showDialogue = true;
  dialogueTimer = 300;
  if (playerInput) {
    playerInput.show();
    playerInput.value('');
    playerInput.elt.focus();
  }
  if (retryButton) retryButton.hide();
}

function nextQuestion() {
  if (currentNpc === 4 && questions3.length > 0) {
    const idx = floor(random(0, questions3.length));
    currentQuestionIndex = idx;
    character2Dialogue = questions3[idx].question;
    lastHint = questions3[idx].hint; // 更新提示
    lastQuestionNpc = 4;
  } else if ((currentNpc === 5 || currentNpc === 6) && questions.length > 0) {
    const idx = floor(random(0, questions.length));
    currentQuestionIndex = idx;
    character2Dialogue = questions[idx].question;
    lastHint = questions[idx].hint; // 更新提示
    lastQuestionNpc = 5;
  } else {
    return;
  }

  showDialogue = true;
  dialogueTimer = 300;
  if (playerInput) {
    playerInput.show();
    playerInput.value('');
    playerInput.elt.focus();
  }
  if (nextButton) nextButton.hide();
  if (retryButton) retryButton.hide();
}

function mousePressed() {
  if (gameState === 'start') {
    gameState = 'playing';
    loop();
    if (song) {
      song.loop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // 防止圖片未載入完成時存取屬性導致錯誤
  if (animationKuaiXia.length === 0) return;

  groundY = height - animationKuaiXia[0].height - 50;
  if (!isJumping) {
    characterY = groundY;
  }
  characterNickY = groundY + animationKuaiXia[0].height - animationNick[0].height + 70;
  
  // 更新茱蒂的 Y 座標
  if (animationJudy.length > 0) {
    characterJudyY = groundY + animationKuaiXia[0].height + 150 - (animationJudy[0].height * 0.8);
  }
  
  // 更新羊的 Y 座標
  if (animationSheep.length > 0) {
    characterSheepY = groundY + animationKuaiXia[0].height - animationSheep[0].height;
  }
  
  // 更新蓋瑞的 Y 座標
  if (animationGary.length > 0) {
    characterGaryY = groundY + animationKuaiXia[0].height - animationGary[0].height;
  }

}

function keyPressed() {
  if (gameState === 'playing' && keyCode === UP_ARROW) {
    if (jumpCount < 2) {
      isJumping = true;
      velocityY = jumpPower;
      jumpCount++;
    }
  }
}