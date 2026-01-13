const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const takePhotoBtn = document.getElementById('takePhotoBtn');
const photoResult = document.getElementById('photoResult');
const photoPreview = document.getElementById('photoPreview');
const countdownEl = document.getElementById('countdown');
const dateText = document.getElementById('dateText');
const downloadLink = document.getElementById('downloadLink');

// Access camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(() => alert('Camera not available'));

function getDate() {
  const d = new Date();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${d.getFullYear()}.${m}.${day}`;
}

function startCountdown(done) {
  let count = 3;
  countdownEl.textContent = count;
  countdownEl.style.display = 'block';

  const timer = setInterval(() => {
    count--;
    if (count > 0) countdownEl.textContent = count;
    else {
      clearInterval(timer);
      countdownEl.style.display = 'none';
      done();
    }
  }, 1000);
}

takePhotoBtn.onclick = () => startCountdown(capturePhoto);

function capturePhoto() {
  const w = video.videoWidth;
  const h = video.videoHeight;
  const pad = 20;
  const bottom = 40;

  canvas.width = w + pad*2;
  canvas.height = h + pad*2 + bottom;

  const ctx = canvas.getContext('2d');

  // white frame
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // photo
  ctx.drawImage(video, pad, pad, w, h);

  // date
  const date = getDate();
  ctx.fillStyle = '#666';
  ctx.font = '16px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(date, canvas.width - pad, canvas.height - 15);

  const img = canvas.toDataURL('image/png');
  photoResult.src = img;
  dateText.textContent = date;
  photoPreview.style.display = 'block';
  downloadLink.href = img;
}
