// Mid-Autumn Festival greetings and procedural artwork generator

export const GREETINGS = [
  {
    title: "Trung Thu vui vẻ nha..",
    enTitle: "Happy Mid-Autumn",
    quote: "Chúc cậu một mùa Trung Thu thật vui nha..\nChúc cậu tất cả, trừ những điều làm cậu mệt.",
    enQuote: "Wishing you a happy Mid-Autumn Festival, with everything good and none of the things that make you tired.",
    author: "Một lời chúc nhỏ",
    wishTag: "✦ Vui vẻ nha ✦",
    imgSrc: "/img/1.jpg",
    imgIndex: 0
  },

  {
    title: "Cười nhiều hơn nhé",
    enTitle: "Smile More",
    quote: "Mong là dạo này cậu sẽ cười nhiều hơn một chút,\nvà có thật nhiều chuyện nhỏ nhỏ khiến cậu vui.",
    enQuote: "I hope you'll smile a little more these days,\nand have plenty of little things that make you happy.",
    author: "Gửi cậu",
    wishTag: "✦ Cười nhiều lên ✦",
    imgSrc: "/img/2.jpg",
    imgIndex: 1
  },

  {
    title: "Đừng nghĩ nhiều quá",
    enTitle: "Don't Overthink",
    quote: "Chúc cậu những ngày sau này bớt nghĩ nhiều hơn một chút..\nCó những chuyện không cần phải ôm trong lòng mãi đâu.",
    enQuote: "I hope you can overthink a little less.\nSome things don't need to stay in your heart forever.",
    author: "Một người luôn mong cậu ổn",
    wishTag: "✦ Bớt nghĩ nha ✦",
    imgSrc: "/img/3.jpg",
    imgIndex: 2
  },

  {
    title: "Yêu thương bản thân",
    enTitle: "Love Yourself",
    quote: "Nhớ giữ gìn sức khỏe nha.\nVà cũng nhớ yêu thương bản thân mình nhiều hơn một chút nữa.",
    enQuote: "Take good care of yourself.\nAnd remember to love yourself a little more too.",
    author: "Thương cậu",
    wishTag: "✦ Thương mình trước ✦",
    imgSrc: "/img/4.jpg",
    imgIndex: 1
  },

  {
    title: "Mong cậu luôn ổn",
    enTitle: "I Hope You're Okay",
    quote: "Không cần lúc nào cũng phải mạnh mẽ đâu.\nMệt thì nghỉ một chút, buồn thì cứ buồn,\nrồi từ từ mọi thứ sẽ ổn hơn.",
    enQuote: "You don't always have to be strong.\nRest when you're tired, feel sad when you need to,\nand let things get better in their own time.",
    author: "Gửi cậu trong đêm trăng",
    wishTag: "✦ Bình an nhé ✦",
    imgSrc: "/img/5.jpg",
    imgIndex: 3
  },

  {
    title: "Chúc cậu thật hạnh phúc",
    enTitle: "Be Happy",
    quote: "Chúc cậu gặp được thật nhiều người tốt,\ncó thật nhiều niềm vui,\nvà luôn được yêu thương theo cách mà cậu xứng đáng.",
    enQuote: "May you meet good people, find plenty of joy,\nand always be loved the way you deserve.",
    author: "Một lời chúc thật lòng",
    wishTag: "✦ Hạnh phúc nhé ✦",
    imgSrc: "/img/6.jpg",
    imgIndex: 2
  },

  {
    title: "Trung Thu này..",
    enTitle: "This Mid-Autumn",
    quote: "Trung Thu này không biết cậu có ước gì không..\nnhưng nếu có thì mong những điều cậu mong muốn\nsẽ từ từ trở thành hiện thực nha.",
    enQuote: "I don't know what you wished for this Mid-Autumn,\nbut I hope the things you wish for slowly become real.",
    author: "Đêm trăng",
    wishTag: "✦ Điều ước thành hiện thực ✦",
    imgSrc: "/img/7.jpg",
    imgIndex: 1
  },

  {
    title: "Một lời chúc riêng",
    enTitle: "Just For You",
    quote: "Chúc cậu tất cả những điều tốt đẹp.\nTrừ vất vả, buồn phiền và những đêm phải suy nghĩ quá nhiều.",
    enQuote: "Wishing you all the good things,\nexcept the struggles, sadness, and sleepless nights.",
    author: "Gửi riêng cậu",
    wishTag: "✦ Bình an là được ✦",
    imgSrc: "/img/8.jpg",
    imgIndex: 0
  },

  {
    title: "Cuối cùng là..",
    enTitle: "One Last Wish",
    quote: "Mong cậu luôn là chính mình,\nluôn có người bên cạnh khi cần,\nvà quan trọng nhất là những ngày sau này sẽ nhẹ nhàng với cậu hơn.",
    enQuote: "May you always be yourself,\nhave someone beside you when you need them,\nand may the days ahead be a little gentler with you.",
    author: "Trung Thu vui vẻ nha..",
    wishTag: "✦ Nhớ vui nhé ✦",
    imgSrc: "/img/9.jpg",
    imgIndex: 3
  }
];

export function getRandomGreeting() {
  const index = Math.floor(Math.random() * GREETINGS.length);
  return GREETINGS[index];
}

// Procedural high-resolution Mid-Autumn illustration generator (returns 4 data-URL strings)
export function createMidAutumnIllustrations() {
  const images = [];

  // 1. Moon & Sky Lanterns Night
  {
    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 220);
    bgGrad.addColorStop(0, '#0c0721');
    bgGrad.addColorStop(0.5, '#20103c');
    bgGrad.addColorStop(1, '#3b184f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 440, 220);

    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 440, Math.random() * 180, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const moonGrad = ctx.createRadialGradient(310, 85, 5, 310, 85, 68);
    moonGrad.addColorStop(0, '#ffffff');
    moonGrad.addColorStop(0.3, '#fff6d6');
    moonGrad.addColorStop(0.7, '#fed57a');
    moonGrad.addColorStop(1, 'rgba(254, 213, 122, 0)');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(310, 85, 68, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff9e6';
    ctx.beginPath();
    ctx.arc(310, 85, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(40, 18, 65, 0.45)';
    ctx.beginPath();
    ctx.ellipse(320, 100, 70, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    const drawLantern = (x, y, scale, glowColor) => {
      const lGlow = ctx.createRadialGradient(x, y, 0, x, y, 32 * scale);
      lGlow.addColorStop(0, glowColor);
      lGlow.addColorStop(1, 'rgba(255, 120, 0, 0)');
      ctx.fillStyle = lGlow;
      ctx.beginPath();
      ctx.arc(x, y, 32 * scale, 0, Math.PI * 2);
      ctx.fill();

      const bGrad = ctx.createLinearGradient(x - 12 * scale, y - 16 * scale, x + 12 * scale, y + 16 * scale);
      bGrad.addColorStop(0, '#ff4d4d');
      bGrad.addColorStop(0.6, '#ff7a00');
      bGrad.addColorStop(1, '#ffc107');
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x - 11 * scale, y - 14 * scale, 22 * scale, 28 * scale, 6 * scale);
      } else {
        ctx.rect(x - 11 * scale, y - 14 * scale, 22 * scale, 28 * scale);
      }
      ctx.fill();

      ctx.strokeStyle = '#ffe082';
      ctx.lineWidth = 1.5 * scale;
      ctx.stroke();

      ctx.strokeStyle = '#e53935';
      ctx.beginPath();
      ctx.moveTo(x, y + 14 * scale);
      ctx.lineTo(x, y + 26 * scale);
      ctx.stroke();
    };

    drawLantern(130, 100, 1.25, 'rgba(255, 170, 0, 0.6)');
    drawLantern(205, 55, 0.85, 'rgba(255, 150, 0, 0.5)');
    drawLantern(75, 60, 0.7, 'rgba(255, 140, 0, 0.45)');
    drawLantern(255, 135, 0.95, 'rgba(255, 160, 0, 0.55)');

    ctx.fillStyle = '#080514';
    ctx.beginPath();
    ctx.moveTo(0, 220);
    ctx.lineTo(0, 185);
    ctx.bezierCurveTo(90, 160, 160, 195, 240, 175);
    ctx.bezierCurveTo(320, 155, 380, 180, 440, 170);
    ctx.lineTo(440, 220);
    ctx.closePath();
    ctx.fill();

    images.push(canvas.toDataURL('image/jpeg', 0.92));
  }

  // 2. Moon Rabbit & Lotus Mooncake
  {
    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 220);
    bgGrad.addColorStop(0, '#15092a');
    bgGrad.addColorStop(0.5, '#2e124d');
    bgGrad.addColorStop(1, '#56195c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 440, 220);

    const moonGrad = ctx.createRadialGradient(160, 105, 10, 160, 105, 95);
    moonGrad.addColorStop(0, '#ffffff');
    moonGrad.addColorStop(0.4, '#fff9e6');
    moonGrad.addColorStop(0.7, '#fcd580');
    moonGrad.addColorStop(1, 'rgba(252, 213, 128, 0)');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(160, 105, 95, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fffdf0';
    ctx.beginPath();
    ctx.arc(160, 105, 60, 0, Math.PI * 2);
    ctx.fill();

    // Cute Rabbit Silhouette
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(265, 150, 22, 17, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(280, 138, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(278, 116, 4, 13, -0.15, 0, Math.PI * 2);
    ctx.ellipse(286, 118, 4, 12, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(244, 150, 6, 0, Math.PI * 2);
    ctx.fill();

    // Mooncake
    const mcGrad = ctx.createRadialGradient(315, 162, 2, 315, 162, 16);
    mcGrad.addColorStop(0, '#ffe082');
    mcGrad.addColorStop(0.7, '#ffb300');
    mcGrad.addColorStop(1, '#c47d00');
    ctx.fillStyle = mcGrad;
    ctx.beginPath();
    ctx.ellipse(318, 162, 16, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.ellipse(280, 172, 70, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sakura branch overhead
    ctx.strokeStyle = '#3a2018';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.bezierCurveTo(90, 40, 150, 20, 220, 50);
    ctx.stroke();

    for (let p = 0; p < 18; p++) {
      ctx.fillStyle = '#ffb8d9';
      ctx.beginPath();
      ctx.ellipse(40 + p * 22, 30 + Math.sin(p) * 25, 5, 3, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    images.push(canvas.toDataURL('image/jpeg', 0.92));
  }

  // 3. Floating River Lanterns & Stars
  {
    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 220);
    bgGrad.addColorStop(0, '#09071c');
    bgGrad.addColorStop(0.45, '#1b143b');
    bgGrad.addColorStop(0.75, '#351c4a');
    bgGrad.addColorStop(1, '#0e0b1c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 440, 220);

    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = `rgba(255, 235, 180, ${Math.random() * 0.7 + 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 440, Math.random() * 140, Math.random() * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    const moonG = ctx.createRadialGradient(220, 70, 5, 220, 70, 55);
    moonG.addColorStop(0, '#ffffff');
    moonG.addColorStop(0.5, '#fff1c4');
    moonG.addColorStop(1, 'rgba(255, 241, 196, 0)');
    ctx.fillStyle = moonG;
    ctx.beginPath();
    ctx.arc(220, 70, 55, 0, Math.PI * 2);
    ctx.fill();

    const waterG = ctx.createLinearGradient(0, 160, 0, 220);
    waterG.addColorStop(0, 'rgba(25, 15, 45, 0.8)');
    waterG.addColorStop(1, 'rgba(10, 6, 22, 0.95)');
    ctx.fillStyle = waterG;
    ctx.fillRect(0, 160, 440, 60);

    ctx.strokeStyle = 'rgba(255, 230, 150, 0.4)';
    ctx.lineWidth = 1.5;
    for (let r = 165; r < 215; r += 7) {
      ctx.beginPath();
      ctx.moveTo(180 - (r - 165) * 1.2, r);
      ctx.lineTo(260 + (r - 165) * 1.2, r);
      ctx.stroke();
    }

    const drawLotus = (lx, ly, ls) => {
      ctx.fillStyle = 'rgba(255, 190, 0, 0.7)';
      ctx.beginPath();
      ctx.arc(lx, ly - 4, 8 * ls, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ff4d6d';
      ctx.beginPath();
      ctx.ellipse(lx, ly, 15 * ls, 6 * ls, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(lx, ly - 4, 3 * ls, 0, Math.PI * 2);
      ctx.fill();
    };

    drawLotus(140, 185, 1.2);
    drawLotus(290, 192, 1.1);
    drawLotus(220, 178, 0.8);
    drawLotus(80, 196, 0.9);
    drawLotus(360, 186, 0.85);

    images.push(canvas.toDataURL('image/jpeg', 0.92));
  }

  // 4. Moon Palace in the Clouds
  {
    const canvas = document.createElement('canvas');
    canvas.width = 440;
    canvas.height = 220;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, 220);
    bgGrad.addColorStop(0, '#0a0d24');
    bgGrad.addColorStop(0.5, '#171c42');
    bgGrad.addColorStop(1, '#342654');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 440, 220);

    const mGrad = ctx.createRadialGradient(220, 110, 10, 220, 110, 95);
    mGrad.addColorStop(0, '#ffffff');
    mGrad.addColorStop(0.4, '#fff6d9');
    mGrad.addColorStop(0.8, '#ffcd59');
    mGrad.addColorStop(1, 'rgba(255, 205, 89, 0)');
    ctx.fillStyle = mGrad;
    ctx.beginPath();
    ctx.arc(220, 110, 95, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fffcee';
    ctx.beginPath();
    ctx.arc(220, 110, 68, 0, Math.PI * 2);
    ctx.fill();

    // Palace Pagoda Silhouette
    ctx.fillStyle = '#100c24';
    ctx.fillRect(195, 95, 50, 45);
    ctx.beginPath();
    ctx.moveTo(180, 95);
    ctx.lineTo(260, 95);
    ctx.lineTo(245, 82);
    ctx.lineTo(195, 82);
    ctx.closePath();
    ctx.fill();

    ctx.fillRect(202, 70, 36, 12);
    ctx.beginPath();
    ctx.moveTo(190, 70);
    ctx.lineTo(250, 70);
    ctx.lineTo(238, 58);
    ctx.lineTo(202, 58);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(218, 58);
    ctx.lineTo(222, 58);
    ctx.lineTo(220, 44);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 215, 120, 0.35)';
    ctx.beginPath();
    ctx.ellipse(150, 170, 90, 22, 0, 0, Math.PI * 2);
    ctx.ellipse(290, 175, 95, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#080614';
    ctx.beginPath();
    ctx.ellipse(220, 205, 240, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    images.push(canvas.toDataURL('image/jpeg', 0.92));
  }

  return images;
}
