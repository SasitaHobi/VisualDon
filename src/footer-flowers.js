// Create 20 small flowers in the footer
let flowerHeights = {};
const studentFirstYear = 80;
const studentDiploma = 63;

// Calculate percentage of non-graduated students
const nonGraduatedPercentage = ((studentFirstYear - studentDiploma) / studentFirstYear) * 100;
const flowerCount = 20;
const nonGrowingFlowersCount = Math.round((nonGraduatedPercentage / 100) * flowerCount);
const nonGrowingFlowers = new Set();

// Distribute non-growing flowers evenly across the row
const step = flowerCount / nonGrowingFlowersCount;
for (let i = 0; i < nonGrowingFlowersCount; i++) {
    nonGrowingFlowers.add(Math.round(i * step));
}

function initFooterFlowers() {
    const footer = document.getElementById('flower-footer');

    if (!footer) {
        return;
    }

    for (let i = 0; i < flowerCount; i++) {
        const div = document.createElement('div');
        div.id = `flower-container-${i}`;
        div.style.width = '80px';
        div.style.height = '80px';
        footer.appendChild(div);
        flowerHeights[i] = 0;
    }

    // Create a p5 sketch for each flower
    for (let i = 0; i < flowerCount; i++) {
        setTimeout(() => createFooterFlower(i), i * 50);
    }

    // Listen to scroll events
    window.addEventListener('scroll', updateFlowerHeights);
}

function updateFlowerHeights() {
    const scrollHeight = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollHeight / maxScroll : 0;

    // Update heights for different flowers based on scroll position
    for (let i = 0; i < flowerCount; i++) {
        if (!nonGrowingFlowers.has(i)) {
            const flowerProgress = Math.max(0, scrollProgress);
            flowerHeights[i] = (flowerProgress * 40) - 40; // Max height is 40
        } else {
            flowerHeights[i] = -40;
        }
    }
}

function createFooterFlower(index) {
    const containerId = `flower-container-${index}`;

    let flowerSketch = (p) => {
        p.setup = function() {
            p.createCanvas(80, 120);
        }

        p.draw = function() {
            p.background(255, 245, 245);
            p.translate(40, 40);

            // Draw stem from bottom (fixed) to top (growing)
            p.stroke(130, 130, 80);
            p.strokeWeight(2);
            p.line(0, 100, 0, 10 - flowerHeights[index]);

            // Move to top of stem to draw flower
            p.translate(0, -flowerHeights[index]);
            p.scale(0.5);

            // Draw the flower with the same style as the main flowers
            p.stroke(baseColor.r, baseColor.g, baseColor.b, 0.5);
            p.strokeWeight(0.25);
            let f = mainConfig.flowers.color;
            let rOff = 10;
            let gOff = 10;
            let bOff = 10;
            let brightOff = 50;
            p.fill(f.r + rOff + brightOff, f.g + gOff + brightOff, f.b + bOff + brightOff);

            const petalCount = 5;
            for (let i = 0; i < petalCount * 2; i++) {
                // Draw petal using the same control points
                let fcp = mainConfig.flowers.petalControlPoints;
                p.beginShape();
                p.vertex(fcp.cp1x, fcp.cp1y);
                p.bezierVertex(fcp.cp2x, fcp.cp2y, fcp.cp3x, fcp.cp3y, fcp.cp4x, fcp.cp4y);
                p.bezierVertex(fcp.cp3x, -fcp.cp3y, fcp.cp2x, -fcp.cp2y, fcp.cp1x, fcp.cp1y);
                p.endShape();

                p.rotate(p.PI / petalCount);
            }

            // Draw pistil
            p.fill(f.pistilColor);
            p.ellipse(0, 0, mainConfig.flowers.pistilRadius);
        }
    };

    new p5(flowerSketch, containerId);
}

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterFlowers);
} else {
    initFooterFlowers();
}
