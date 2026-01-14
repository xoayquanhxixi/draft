// Grab DOM elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const photoPreview = document.getElementById('photoPreview');
const countdownEl = document.getElementById('countdown');
const downloadLink = document.getElementById('downloadLink');

// Start the camera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert('Cannot access camera. Please allow camera permissions and open this page on HTTPS or localhost.');
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
      countdownEl.textContent = 'Smile! 😄';
      setTimeout(() => {
        countdownEl.style.display = 'none';
        callback();
      }, 700);
    }
  }, 1000);
}

// Capture photo
function capturePhoto() {
  if (!video.srcObject) {
    alert('Camera not started. Please allow camera access.');
    return;
  }

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  const padding = 20;
  const bottomSpace = 50; // Polaroid bottom

  canvas.width = videoWidth + padding * 2;
  canvas.height = videoHeight + padding * 2 + bottomSpace;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(video, padding, padding, videoWidth, videoHeight);

  const date = getDate();
  ctx.fillStyle = '#666';
  ctx.font = '16px Arial';
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
