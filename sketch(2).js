let spriteSheet;
let animation = [];
const numFrames = 5; // 圖片精靈中的圖片總數
const spriteSheetWidth = 1020; // 圖片精靈的總寬度
const spriteSheetHeight = 213; // 圖片精靈的總高度
let frameWidth; // 單一畫格的寬度
let currentFrame = 0;
let isLooping = false; // 用來追蹤動畫是否正在播放
let song; // 用來存放音樂的變數

// 茱蒂的變數
let judySpriteSheet;
let judyAnimation = [];
let judyCurrentFrame = 0;

function preload() {
  // 預先載入圖片，請確保路徑和檔名 '1/jump/all.png' 正確
  spriteSheet = loadImage('1/jump/all.png');
  // 預先載入茱蒂的圖片
  judySpriteSheet = loadImage('茱蒂/stop/all.png.png');
  // 預先載入音樂，請將 'music.mp3' 換成您的音樂檔名
  song = loadSound('music.mp3');
}

function setup() {
  // 產生一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);

  // 計算單一畫格的寬度
  frameWidth = spriteSheetWidth / numFrames;

  // 將圖片精靈裁切成個別的畫格並存入陣列
  for (let i = 0; i < numFrames; i++) {
    let frame = spriteSheet.get(i * frameWidth, 0, frameWidth, spriteSheetHeight);
    animation.push(frame);
  }

  // 為茱蒂創建動畫陣列
  for (let i = 0; i < numFrames; i++) {
    let frame = judySpriteSheet.get(i * frameWidth, 0, frameWidth, spriteSheetHeight);
    judyAnimation.push(frame);
  }

  // 設定動畫播放速度 (每秒10幀)
  frameRate(10);

  // 初始時暫停動畫
  noLoop();
}

function draw() {
  // 設定畫布背景顏色
  background('#909580');

  // 計算第一個角色的置中 x 和 y 座標
  let x1 = (windowWidth / 2 - frameWidth) / 2;
  let y = (windowHeight - spriteSheetHeight) / 2;

  // 顯示第一個角色的當前動畫畫格
  image(animation[currentFrame], x1, y);

  // 計算茱蒂的 x 座標，放在右側
  let x2 = windowWidth / 2 + (windowWidth / 2 - frameWidth) / 2;

  // 顯示茱蒂的當前動畫畫格
  image(judyAnimation[judyCurrentFrame], x2, y);

  // 更新到下一個畫格，實現循環播放
  currentFrame = (currentFrame + 1) % numFrames;
  judyCurrentFrame = (judyCurrentFrame + 1) % numFrames;
}

// 當滑鼠被按下時，切換動畫的播放/暫停狀態
function mousePressed() {
  if (isLooping) {
    song.pause(); // 暫停音樂
    noLoop();
    isLooping = false;
  } else {
    song.loop(); // 循環播放音樂
    loop();
    isLooping = true;
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
