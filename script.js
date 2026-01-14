// Grab DOM elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const photoResult = document.getElementById('photoResult');
const photoPreview = document.getElementById('photoPreview');
const countdownEl = document.getElementById('countdown');
const dateText = document.getElementById('dateText');
const downloadLink = document.getElementById('downloadLink');

// Function to start the camera safely
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    alert('Cannot access camera. Please allow camera permissions and open this page on HTTPS or localhost.');
    console.error('Camera error:', err);
  }
}

// Start camera immediately
startCamera();

// Get formatted date
function getDate() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${month}.${day}`;
}

// Countdown before taking photo
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

// Take photo button click
takePhotoBtn.onclick = () => startCountdown(capturePhoto);

// Capture photo function
function capturePhoto() {
  if (!video.srcObject) {
    alert('Camera not started. Please allow camera access.');
    return;
  }

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;
  const padding = 20;
  const bottomSpace = 40;

  // Set canvas size for photo + frame + date
  canvas.width = videoWidth + padding * 2;
  canvas.height = videoHeight + padding * 2 + bottomSpace;

  const ctx = canvas.getContext('2d');

  // Draw white frame
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the video image
  ctx.drawImage(video, padding, padding, videoWidth, videoHeight);

  // Draw the date at the bottom right
  const date = getDate();
  ctx.fillStyle = '#666';
  ctx.font = '16px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(date, canvas.width - padding, canvas.height - 15);

  // Convert canvas to image and show in preview
  const imgData = canvas.toDataURL('image/png');
  photoResult.src = imgData;
  dateText.textContent = date;
  photoPreview.style.display = 'block';

  // Set download link
  downloadLink.href = imgData;
}
