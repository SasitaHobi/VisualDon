import scrollama from "scrollama";
import { makeCenterFlower } from './center-flower.js';

// instantiate the scrollama
const scroller = scrollama();

// setup the instance, pass callback functions
scroller
  .setup({
    step: ".step",
  })
  .onStepEnter((response) => {
    // { element, index, direction }
  })
  .onStepExit((response) => {
    // { element, index, direction }
  });
