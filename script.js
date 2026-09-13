const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

const frameCount = 128;
// Format numbers with leading zeros (e.g., 001, 010, 128)
const currentFrame = index => (
  `ezgif-5e253a2b0c4c33a5-jpg/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const preloadImages = () => {
  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
  }
};

const img = new Image();
img.src = currentFrame(1);
canvas.width = 1920;
canvas.height = 1080;

img.onload = function(){
  // Draw the image filling the canvas while maintaining aspect ratio
  drawCover(img);
};

function drawCover(img) {
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetX = 0;
        offsetY = (canvas.height - drawHeight) / 2;
    } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = 0;
    }
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

const updateImage = index => {
  img.src = currentFrame(index);
  drawCover(img);
}

// Ensure the canvas resizing handles aspect ratio gracefully
window.addEventListener('resize', () => {
    // Keep internal resolution high, CSS scales it down
    drawCover(img);
});

// Scroll linked animation logic
window.addEventListener('scroll', () => {  
  const scrollTop = document.documentElement.scrollTop;
  // Calculate max scroll depth based on the document height and viewport
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  
  // Calculate the fraction of scroll progress
  const scrollFraction = scrollTop / maxScrollTop;
  
  // Determine which frame to show
  // We want to map scroll fraction 0 -> 1 to frame 1 -> 128
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );
  
  // frameIndex will be 0 to 127. Add 1 for 1-based index
  requestAnimationFrame(() => updateImage(frameIndex + 1));
});

preloadImages();

// Intersection Observer for fading in cards as you scroll
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Optional: remove visible class if you want them to fade out when scrolling past
            // entry.target.classList.remove('visible'); 
        }
    });
}, observerOptions);

document.querySelectorAll('.step').forEach(step => {
    observer.observe(step);
});
