// Color mapping for living situations
const situationColors = {
  'Seul': '#a86496',        // Medium purple
  'Famille': '#963c56',      // Dark red-purple
  'Partenaire': '#540f1c',   // Very dark red
  'Colocation': '#e2d3e9'    // Light purple
};

let sortedFlowerData = {
  students: [],
  topReasons: [],
  reasonGroups: {},
  studentCircles: []
};

async function loadSortedFlowerData() {
  try {
    const response = await fetch('../data/data.json');
    if (!response.ok) {
      console.error('Failed to fetch data.json, status:', response.status);
      return false;
    }
    const answers = await response.json();

    // Filter students who don't want full-time (pref !== "Temps plein")
    const nonFullTimeStudents = answers.filter(a => a.pref !== 'Temps plein');

    console.log(`Total non-full-time students: ${nonFullTimeStudents.length}`);

    // Get all reasons for non-full-time students
    const reasonCounts = {};
    nonFullTimeStudents.forEach(student => {
      [student.reason1, student.reason2, student.reason3].forEach(reason => {
        if (reason && reason.trim()) {
          reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        }
      });
    });

    // Get top 3 reasons
    const topReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    console.log('Top 3 reasons:', topReasons);

    // Group students by their primary reason (first non-empty reason)
    const reasonGroups = {};
    topReasons.forEach(reason => {
      reasonGroups[reason] = nonFullTimeStudents.filter(student => {
        const firstReason = student.reason1 || student.reason2 || student.reason3;
        return firstReason === reason;
      });
    });

    sortedFlowerData = {
      students: nonFullTimeStudents,
      topReasons,
      reasonGroups,
      studentCircles: nonFullTimeStudents.map((student, idx) => ({
        student,
        idx,
        reason: student.reason1 || student.reason2 || student.reason3,
        situation: student.situation
      }))
    };

    console.log(`Sorted-flower data loaded: ${nonFullTimeStudents.length} students, top 3 reasons:`, topReasons);
    return true;
  } catch (e) {
    console.error('Failed to load sorted-flower data:', e);
    return false;
  }
}

function generateSortedFlowerSVG() {
  // Ensure we have exactly 3 reasons
  while (sortedFlowerData.topReasons.length < 3) {
    sortedFlowerData.topReasons.push(`Raison ${sortedFlowerData.topReasons.length + 1}`);
  }

  const svgWidth = 1000;
  const svgHeight = 620;
  const centerX = svgWidth / 2;
  const centerY = 220;
  const centerRadius = 100;
  const circleRadius = 15;

  // Column positions and bounds
  const columnY = 260;
  const columnHeight = 260;
  const columnWidth = 260;
  const columnCenters = [150, 500, 850];
  const columns = [
    { x: columnCenters[0], reason: sortedFlowerData.topReasons[0] },
    { x: columnCenters[1], reason: sortedFlowerData.topReasons[1] },
    { x: columnCenters[2], reason: sortedFlowerData.topReasons[2] }
  ];

  let circles = `<circle id="center-circle-sorted" cx="${centerX}" cy="${centerY}" r="${centerRadius}" fill="#ffe8a8" opacity="0.9"/>`;

  const columnTitles = columns.map((column) => `\n  <text x="${column.x}" y="55" text-anchor="middle" fill="#362f2f" font-size="18" font-weight="600">${column.reason}</text>`).join('');

  // Group students by reason for better distribution
  const studentsPerReason = {};
  columns.forEach(col => {
    studentsPerReason[col.reason] = [];
  });

  sortedFlowerData.studentCircles.forEach((circleData, idx) => {
    const reason = circleData.reason;
    if (studentsPerReason[reason]) {
      studentsPerReason[reason].push({ ...circleData, idx });
    }
  });

  // Generate circles with grid layout per column
  const circlesPerColumn = 3; // 3 columns
  columns.forEach((column) => {
    const students = studentsPerReason[column.reason] || [];
    const rowsPerColumn = Math.ceil(students.length / 3);

    students.forEach((circleData, studentIdx) => {
      const color = situationColors[circleData.situation] || '#e2d3e9';

      const row = studentIdx % rowsPerColumn;
      const col = Math.floor(studentIdx / rowsPerColumn);

      // Distribute within column bounds
      const circleX = column.x + (col - 1) * (columnWidth / 3) + Math.random() * 20 - 10;
      const circleY = columnY + (row / rowsPerColumn) * columnHeight + Math.random() * 20 - 10;

      circles += `\n  <circle id="student-circle-${circleData.idx}" class="sorted-student-circle" cx="${centerX}" cy="${centerY}" r="${circleRadius}" fill="${color}" data-target-x="${circleX}" data-target-y="${circleY}" opacity="0.7"/>`;
    });
  });

  const svg = `
    <svg id="sorted-flower-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="620">
      ${columnTitles}
      ${circles}
    </svg>
  `;

  return svg;
}

export function updateSortedFlowerAnimation(progress) {
  const centerCircle = document.querySelector('#center-circle-sorted');
  if (!centerCircle) return;

  // Phase 1: Shrink center circle (0 to 0.3 progress)
  const shrinkProgress = Math.max(0, Math.min(1, progress * 3.33));
  const centerRadius = 400 * (1 - shrinkProgress * 0.9); // Shrink to 30% of original
  centerCircle.setAttribute('r', centerRadius);

  // Phase 2: Disperse small circles (0.3 to 1 progress)
  const disperseProgress = Math.max(0, (progress - 0.3) / 0.7);

  const centerX = 500;
  const centerY = 150;

  document.querySelectorAll('.sorted-student-circle').forEach(circle => {
    const targetX = parseFloat(circle.getAttribute('data-target-x'));
    const targetY = parseFloat(circle.getAttribute('data-target-y'));

    // Interpolate position based on progress
    const currentX = centerX + (targetX - centerX) * disperseProgress;
    const currentY = centerY + (targetY - centerY) * disperseProgress;

    circle.setAttribute('cx', currentX);
    circle.setAttribute('cy', currentY);

    // Adjust opacity: fade in as they move
    const opacity = 0.7 + (0.3 * disperseProgress);
    circle.setAttribute('opacity', opacity);
  });
}

async function initSortedFlower() {
  try {
    console.log('initSortedFlower starting...');
    const sortedSection = document.getElementById('sorted-flower');
    if (!sortedSection) {
      console.warn('sorted-flower section not found');
      return;
    }
    console.log('sorted-flower section found');

    // Load data first
    const dataLoaded = await loadSortedFlowerData();
    if (!dataLoaded) {
      console.error('Could not load sorted-flower data');
      return;
    }
    console.log('Data loaded successfully');

    // Create container
    const flowerContainer = document.createElement('div');
    flowerContainer.id = 'sorted-flower-container';
    flowerContainer.className = 'sticky-step';
    flowerContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center; margin: 40px 0;';

    const svgContent = generateSortedFlowerSVG();
    console.log('SVG generated, length:', svgContent.length);
    const legendHtml = `
      <div class="sorted-flower-legend">
        <p class="legend-title">Légende : couleurs = situation de logement</p>
        <div class="legend-items">
          ${Object.entries(situationColors).map(([label, color]) => `<div class="legend-item"><span class="legend-swatch" style="background:${color}"></span><span>${label}</span></div>`).join('')}
        </div>
      </div>
    `;
    flowerContainer.innerHTML = svgContent + legendHtml;

    // Insert after heading
    const heading = sortedSection.querySelector('h2');
    if (heading && heading.nextSibling) {
      sortedSection.insertBefore(flowerContainer, heading.nextSibling);
    } else {
      sortedSection.appendChild(flowerContainer);
    }
    console.log('SVG inserted into DOM');

    console.log('Sorted-flower initialized successfully');
  } catch (e) {
    console.error('Error initializing sorted-flower:', e);
  }
}

// Initialize when document is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSortedFlower);
} else {
  initSortedFlower();
}