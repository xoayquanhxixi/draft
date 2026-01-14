const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const photoPreview = document.getElementById('photoPreview');
const countdownEl = document.getElementById('countdown');
const downloadLink = document.getElementById('downloadLink');

const padding = 20;
const bottomSpace = 60; // Polaroid bottom

// Start camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();
      // Fixed Korean booth ratio (3:4)
      video.width = 360;
      video.height = 480;
      console.log('Camera ready');
    };
  } catch (err) {
    alert('카메라 접근이 필요합니다.');
    console.error(err);
  }
}
startCamera();

// Date in YYYY.MM.DD
function getDate() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${month}.${day}`;
}

// Countdown with Korean “치~즈!”
function startCountdown(callback) {
  let count = 3;
  countdownEl.textContent = count;
  countdownEl.style.display = 'block';

  const timer = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      clearInterval(timer);
      countdownEl.textContent = '치~즈! 😄';
      setTimeout(() => {
        countdownEl.style.display = 'none';
        callback();
      }, 700);
    }
  }, 1000);
}

// Capture photo
function capturePhoto() {
  if (!video.srcObject || video.videoWidth === 0) {
    alert('카메라 준비 중...');
    return;
  }

  const videoWidth = video.width;
  const videoHeight = video.height;

  canvas.width = videoWidth + padding * 2;
  canvas.height = videoHeight + padding * 2 + bottomSpace;

  const ctx = canvas.getContext('2d');

  // Polaroid-style frame
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(video, padding, padding, videoWidth, videoHeight);

  const date = getDate();
  ctx.fillStyle = '#666';
  ctx.font = '16px Nanum Gothic, Arial';
  ctx.textAlign = 'right';
  ctx.fillText(date, canvas.width - padding, canvas.height - 15);

  const imgData = canvas.toDataURL('image/png');
  photoPreview.src = imgData;

  photoPreview.classList.remove('show');
  setTimeout(() => photoPreview.classList.add('show'), 50);

  downloadLink.href = imgData;
  downloadLink.download = `photo_${date}.png`;
}

// Button click
takePhotoBtn.onclick = () => startCountdown(capturePhoto);
