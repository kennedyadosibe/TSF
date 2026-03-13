(function () {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg) return;

  // Replace these URLs later with your TSF real photos in /assets/images
  const images = [
    "https://images.unsplash.com/photo-1520975919658-b4a6c4a73f04?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1920&q=80"
  ];

  let idx = 0;

  function swapBg() {
    idx = (idx + 1) % images.length;

    // fade effect
    heroBg.style.opacity = "0.2";
    setTimeout(() => {
      heroBg.style.backgroundImage = `url('${images[idx]}')`;
      heroBg.style.opacity = "1";
    }, 350);
  }

  // change every 6 seconds
  setInterval(swapBg, 6000);
})();