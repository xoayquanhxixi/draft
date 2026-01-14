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

// Start camera safely
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
    video.srcObject = stream;

    // Wait until video metadata is loaded to get correct width/height
    video.onloadedmetadata = () => {
      videoReady = true;
      video.play();
    };
  } catch (err) {
    alert('Cannot access camera. Allow permissions and open on HTTPS or localhost.');
    console.error('Camera error:', err);
  }
}

startCamera();

// Get formatted date
function getDate() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${month}.${day}`;
}

// Countdown before photo
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

  const w = video.videoWidth;
  const h = video.videoHeight;
  const pad = 20;
  const bottom = 40;

  canvas.width = w + pad * 2;
  canvas.height = h + pad * 2 + bottom;

  const ctx = canvas.getContext('2d');

  // Draw white frame
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the video image
  ctx.drawImage(video, pad, pad, w, h);

  // Draw the date
  const date = getDate();
  ctx.fillStyle = '#666';
  ctx.font = '16px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(date, canvas.width - pad, canvas.height - 15);

  // Set image preview
  const imgData = canvas.toDataURL('image/png');
  photoResult.src = imgData;
  dateText.textContent = date;
  photoPreview.style.display = 'block';

  // Set download link
  downloadLink.href = imgData;
}

// Button click
takePhotoBtn.onclick = () => startCountdown(capturePhoto);
