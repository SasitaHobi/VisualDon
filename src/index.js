import { updateCenterFlowerAnimation } from './center-flower.js';
import { updateSortedFlowerAnimation } from './sorted-flower.js';

console.log('Scrollama available:', typeof window.scrollama);

const DELAY_AFTER_ANIMATION = 1000; // 1 second delay

const stepStates = {
  'center-flower': {
    isLocked: false,
    lockTime: null
  },
  'sorted-flower': {
    isLocked: false,
    lockTime: null
  }
};

function updateStepLocks() {
  Object.keys(stepStates).forEach(stepId => {
    const state = stepStates[stepId];
    if (state.isLocked && state.lockTime) {
      const elapsed = Date.now() - state.lockTime;
      console.log(`${stepId}: locked for ${elapsed}ms (need ${DELAY_AFTER_ANIMATION}ms)`);
      if (elapsed >= DELAY_AFTER_ANIMATION) {
        state.isLocked = false;
        state.lockTime = null;
        const element = document.getElementById(stepId);
        if (element) {
          element.classList.remove('animation-locked');
        }
        console.log('✓ Step unlocked:', stepId);
      }
    }
  });
}

function setupScrollProgress() {
  if (window.scrollama && typeof window.scrollama === 'function') {
    const scroller = window.scrollama();
    scroller
      .setup({
        step: ".step",
        offset: 2,
        progress: true,
        debug: false,
      })
      .onStepEnter((response) => {
        response.element.classList.add('active-step');
        const stepId = response.element.id;
        if (stepStates[stepId]) {
          stepStates[stepId].isLocked = false;
          stepStates[stepId].lockTime = null;
          response.element.classList.remove('animation-locked');
        }
        console.log('Step enter:', response.element.id, response.direction);
      })
      .onStepExit((response) => {
        response.element.classList.remove('active-step');
        const stepId = response.element.id;
        if (stepStates[stepId]) {
          stepStates[stepId].isLocked = false;
          stepStates[stepId].lockTime = null;
          response.element.classList.remove('animation-locked');
        }
        console.log('Step exit:', response.element.id, response.direction);
      })
      .onStepProgress((response) => {
        updateStepLocks();

        const stepId = response.element.id;
        const state = stepStates[stepId];

        // Skip if locked
        if (state && state.isLocked) {
          return;
        }

        console.log('Step progress:', stepId, response.progress);
        if (stepId === 'center-flower') {
          updateCenterFlowerAnimation(response.progress);
        }
        if (stepId === 'sorted-flower') {
          updateSortedFlowerAnimation(response.progress);
        }

        // Lock when animation complete
        if (response.progress >= 0.99 && state && !state.isLocked) {
          state.isLocked = true;
          state.lockTime = Date.now();
          response.element.classList.add('animation-locked');
          console.log('Animation complete, locking for 1s:', stepId);
        }
      });

    window.addEventListener('resize', () => scroller.resize());
    setInterval(updateStepLocks, 50);
  } else {
    console.warn('Scrollama unavailable, using fallback scroll progress.');
    const steps = document.querySelectorAll('.step');
    const updateFallback = () => {
      updateStepLocks();

      const windowHeight = window.innerHeight;
      steps.forEach((element) => {
        const stepId = element.id;
        const state = stepStates[stepId];

        if (state && state.isLocked) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));

        if (element.id === 'center-flower') {
          updateCenterFlowerAnimation(progress);
        }
        if (element.id === 'sorted-flower') {
          updateSortedFlowerAnimation(progress);
        }

        // Lock when animation complete
        if (progress >= 0.99 && state && !state.isLocked) {
          state.isLocked = true;
          state.lockTime = Date.now();
          element.classList.add('animation-locked');
          console.log('Animation complete, locking for 1s:', stepId);
        }
      });
    };
    window.addEventListener('scroll', updateFallback);
    window.addEventListener('resize', updateFallback);
    setInterval(updateStepLocks, 50);
    updateFallback();
  }
}

setupScrollProgress();

