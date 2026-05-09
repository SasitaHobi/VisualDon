import { updateCenterFlowerAnimation } from './center-flower.js';
import { updateSortedFlowerAnimation } from './sorted-flower.js';

console.log('Scrollama available:', typeof window.scrollama);

function setupScrollProgress() {
  if (window.scrollama && typeof window.scrollama === 'function') {
    const scroller = window.scrollama();
    scroller
      .setup({
        step: ".step",
        offset: 0.9,
        progress: true,
        debug: false,
      })
      .onStepEnter((response) => {
        response.element.classList.add('active-step');
        console.log('Step enter:', response.element.id, response.direction);
      })
      .onStepExit((response) => {
        response.element.classList.remove('active-step');
        console.log('Step exit:', response.element.id, response.direction);
      })
      .onStepProgress((response) => {
        const stepId = response.element.id;
        console.log('Step progress:', stepId, response.progress);
        if (stepId === 'center-flower') {
          updateCenterFlowerAnimation(response.progress);
        }
        if (stepId === 'sorted-flower') {
          updateSortedFlowerAnimation(response.progress);
        }
      });

    window.addEventListener('resize', () => scroller.resize());
  } else {
    console.warn('Scrollama unavailable, using fallback scroll progress.');
    const steps = document.querySelectorAll('.step');
    const updateFallback = () => {
      const windowHeight = window.innerHeight;
      steps.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
        if (element.id === 'center-flower') {
          updateCenterFlowerAnimation(progress);
        }
        if (element.id === 'sorted-flower') {
          updateSortedFlowerAnimation(progress);
        }
      });
    };
    window.addEventListener('scroll', updateFallback);
    window.addEventListener('resize', updateFallback);
    updateFallback();
  }
}

setupScrollProgress();
