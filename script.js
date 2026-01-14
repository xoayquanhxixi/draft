// DOM elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const photoResult = document.getElementById('photoResult');
const photoPreview = document.getElementById('photoPreview');
const countdownEl = document.getElementById('countdown');
const dateText = document.getElementById('dateText');
const downloadLink = document.getElementById('downloadLink');

let videoReady = false;

// Start camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      videoReady = true;
      video.play();
    };
  } catch (err) {
    alert('Cannot access camera. Allow permissions and use HTTPS or localhost.');
    console.error('Camera error:', err);
  }
}

startCamera();

// Format date YYYY.MM.DD
function getDate() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${month}.${day}`;
}

// Countdown before capture
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
      countdownEl.style.display = 'none';
      callback();
    }
  }, 1000);
}

// Capture photo
function capturePhoto() {
  if (!videoReady) {
    alert('Video not ready yet. Please wait a moment.');
    return;
  }

  const w = 400; // fixed width for consistency
  const h = (video.videoHeight / video.videoWidth) * w;
  const pad = 20;
  const bottom = 40;

  canvas.width = w + pad * 2;
  canvas.height = h + pad * 2 + bottom;
  const ctx = canvas.getContext('2d');

  // White Polaroid frame
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw video
  ctx.drawImage(video, pad, pad, w, h);

  // Draw date
  const date = getDate();
  ctx.fillStyle = '#555';
  ctx.font = 'bold 16px Courier New';
  ctx.textAlign = 'right';
  ctx.fillText(date, canvas.width - pad, canvas.height - 15);

  // Show preview
  const imgData = canvas.toDataURL('image/png');
  photoResult.src = imgData;
  dateText.textContent = date;
  photoPreview.style.display = 'block';

  // Download link
  downloadLink.href = imgData;
  downloadLink.download = `photo_${date}.png`;
}

// Button click
takePhotoBtn.onclick = () => startCountdown(capturePhoto);
