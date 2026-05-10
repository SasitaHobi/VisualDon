const basColor = "#e2d3e9";
const rot1 = "#a86496";
const rot2 = "#963c56";
const rot3 = "#540f1c";

const petalPath = "M62.65,209.6c0,83.16-3.63,129.98-31.31,209.6C4.64,338.37.8,292.06.03,209.6S14.05,0,31.34,0s31.31,127.39,31.31,209.6Z";

let petalsToFallCount = 0;
let rot1TargetCount = 0;
let rot3TargetCount = 0;

async function loadCalculData() {
  try {
    const { totPlein, totPartiel, totEmploi, totWorkVital } = await import('./calcul.js');
    return { totPlein, totPartiel, totEmploi, totWorkVital };
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
    const transformValue = `translate(${x}, ${y}) rotate(${angle}) scale(${petalScale})`;

    petals.push(`
      <g id="petal-${i}" class="petal" data-original-transform="${transformValue}" transform="${transformValue}">
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
    console.warn('Could not load data, defaulting to 0 falling petals');
    petalsToFallCount = 0;
    rot1TargetCount = 0;
    rot3TargetCount = 0;
    return;
  }

  const { totPlein, totPartiel, totEmploi, totWorkVital } = data;
  const full = totPlein();
  const partial = totPartiel();
  const employment = totEmploi();
  const vital = totWorkVital();
  const total = full + partial + employment;

  if (total === 0) {
    petalsToFallCount = 0;
    rot1TargetCount = 0;
    rot3TargetCount = 0;
    return;
  }

  const partialEmploymentCount = partial + employment;
  const vitalCount = vital;

  rot1TargetCount = Math.round(16 * (partialEmploymentCount / total));
  rot3TargetCount = Math.round(16 * (vitalCount / total));
  petalsToFallCount = rot3TargetCount;

  console.log(`Employment data: ${full} full-time, ${partial} part-time, ${employment} employed, ${vital} vital. rot1=${rot1TargetCount}, rot3=${rot3TargetCount}.`);
}

let currentRot1Count = 0;
let currentRot3Count = 0;
let currentFallProgress = 0;

export function updateCenterFlowerAnimation(progress) {
  const svg = document.querySelector('#center-flower-svg');
  if (!svg) return;

  const clamped = Math.max(0, Math.min(1, progress));
  const stage1End = 0.33;
  const stage2End = 0.66;

  let activeRot1Count = 0;
  let activeRot3Count = 0;
  let fallProgress = 0;

  if (clamped <= stage1End) {
    const stage1Ratio = stage1End > 0 ? clamped / stage1End : 1;
    activeRot1Count = Math.round(rot1TargetCount * stage1Ratio);
  } else if (clamped <= stage2End) {
    activeRot1Count = rot1TargetCount;
    const stage2Ratio = stage2End > stage1End ? (clamped - stage1End) / (stage2End - stage1End) : 1;
    activeRot3Count = Math.round(rot3TargetCount * stage2Ratio);
  } else {
    activeRot1Count = rot1TargetCount;
    activeRot3Count = rot3TargetCount;
    fallProgress = (clamped - stage2End) / (1 - stage2End);
  }

  if (
    activeRot1Count === currentRot1Count &&
    activeRot3Count === currentRot3Count &&
    fallProgress === currentFallProgress
  ) {
    return;
  }

  currentRot1Count = activeRot1Count;
  currentRot3Count = activeRot3Count;
  currentFallProgress = fallProgress;

  for (let i = 0; i < 16; i++) {
    const petal = svg.querySelector(`#petal-${i}`);
    if (!petal) continue;

    const path = petal.querySelector('path');
    if (!path) continue;

    const originalTransform = petal.getAttribute('data-original-transform') || '';
    let fill = basColor;
    let opacity = 1;
    let transform = originalTransform;

    if (i < activeRot3Count) {
      fill = rot3;
      if (fallProgress > 0) {
        opacity = Math.max(0, 1 - fallProgress);
        transform = `${originalTransform} translate(0, ${200 * fallProgress})`;
      }
    } else if (i < activeRot1Count) {
      fill = rot1;
    }

    path.setAttribute('fill', fill);
    petal.setAttribute('transform', transform);
    petal.setAttribute('opacity', opacity);
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
    flowerContainer.className = 'sticky-step';
    flowerContainer.style.cssText = 'display: flex; justify-content: center; margin: 10px 0;';
    flowerContainer.innerHTML = generateFlowerSVG();

    const textContent = document.createElement('div');
    textContent.className = 'text-content';

    const heading = centerSection.querySelector('h2');
    const paragraphs = Array.from(centerSection.querySelectorAll('p'));

    if (heading) {
      textContent.appendChild(heading);
    }

    paragraphs.forEach(p => {
      textContent.appendChild(p);
    });

    centerSection.appendChild(flowerContainer);
    centerSection.appendChild(textContent);

    await calculatePetalsToFall();
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