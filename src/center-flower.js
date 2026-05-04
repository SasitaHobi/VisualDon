const basColor = "#e2d3e9";
const rot1 = "#a86496";
const rot2 = "#963c56";
const rot3 = "#540f1c";

const petalPath = "M62.65,209.6c0,83.16-3.63,129.98-31.31,209.6C4.64,338.37.8,292.06.03,209.6S14.05,0,31.34,0s31.31,127.39,31.31,209.6Z";

let petalsToFallCount = 0;

async function loadCalculData() {
  try {
    const { totPlein, totPartiel, totEmploi } = await import('./calcul.js');
    return { totPlein, totPartiel, totEmploi };
  } catch (e) {
    console.error('Failed to load calcul.js:', e);
    return null;
  }
}

function generateFlowerSVG() {
  const petals = [];
  const angleStep = 360 / 16;
  const centerX = 250;
  const centerY = 250;
  const petalDistance = 200;
  const petalScale = 0.35;

  for (let i = 0; i < 16; i++) {
    const angle = i * angleStep;
    const radians = (angle * Math.PI) / 180;
    const x = centerX + petalDistance * Math.sin(radians);
    const y = centerY - petalDistance * Math.cos(radians);

    petals.push(`
      <g id="petal-${i}" class="petal" transform="translate(${x}, ${y}) rotate(${angle}) scale(${petalScale})">
        <path fill="${basColor}" d="${petalPath}"/>
      </g>
    `);
  }

  const svg = `
    <svg id="center-flower-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      ${petals.join('')}
      <circle id="flower-center" fill="#ffe8a8" cx="${centerX}" cy="${centerY}" r="45.8"/>
    </svg>
  `;

  return svg;
}

async function calculatePetalsToFall() {
  const data = await loadCalculData();
  if (!data) {
    console.warn('Could not load data, defaulting to 4 falling petals');
    petalsToFallCount = 0;
    return;
  }

  const { totPlein, totPartiel, totEmploi } = data;
  const full = totPlein();
  const partial = totPartiel();
  const employment = totEmploi();
  const total = full + partial + employment;

  if (total === 0) {
    petalsToFallCount = 0;
    return;
  }

  const fullPercent = (full / total) * 100;
  const partialPercent = (partial / total) * 100;
  const employmentPercent = (employment / total) * 100;

  const dominant = Math.max(fullPercent, partialPercent, employmentPercent);
  petalsToFallCount = Math.round(16 * (dominant / 100));

  console.log(`Employment data: ${full} full-time, ${partial} part-time, ${employment} employed. ${petalsToFallCount} petals will fall.`);
}

function setupScrollAnimation() {
  const centerSection = document.getElementById('center-flower');
  if (!centerSection) return;

  let animationTriggered = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animationTriggered) {
        animationTriggered = true;
        triggerPetalFall();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(centerSection);
}

function triggerPetalFall() {
  const svg = document.querySelector('#center-flower-svg');
  if (!svg) {
    console.warn('SVG not found for petal fall animation');
    return;
  }

  for (let i = 0; i < petalsToFallCount; i++) {
    const petal = svg.querySelector(`#petal-${i}`);
    if (petal) {
      petal.classList.add('falling');
      const path = petal.querySelector('path');
      if (path) {
        path.setAttribute('fill', rot3);
      }
    }
  }
}

async function initCenterFlower() {
  try {
    const centerSection = document.getElementById('center-flower');
    if (!centerSection) {
      console.warn('center-flower section not found');
      return;
    }

    const flowerContainer = document.createElement('div');
    flowerContainer.id = 'flower-container';
    flowerContainer.style.cssText = 'display: flex; justify-content: center; margin: 40px 0;';
    flowerContainer.innerHTML = generateFlowerSVG();

    const heading = centerSection.querySelector('h2');
    if (heading && heading.nextSibling) {
      centerSection.insertBefore(flowerContainer, heading.nextSibling);
    } else {
      centerSection.appendChild(flowerContainer);
    }

    await calculatePetalsToFall();
    setupScrollAnimation();
    console.log('Center flower initialized successfully');
  } catch (e) {
    console.error('Error initializing center flower:', e);
  }
}

// Initialize when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCenterFlower);
} else {
  initCenterFlower();
}