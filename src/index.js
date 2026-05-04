
// import studentsData from "../data/Profils en Ingénierie des médias.csv";
import { makeCenterFlower } from './center-flower.js';
const axiom = 'F';
let w = window.innerWidth;
let h = window.innerHeight
let len = (h / 2.15 + h / 2.6) / 2;
let sentence = axiom;
let count = 0;

let bgc;

const rules = [];
rules[0] = {
    a: 'F',
    b: 'Go[+F][-F]GF*'
};

rules[1] = {
    a: 'G',
    b: 'GG'
};

function setup() {
    createCanvas(w, h);
    
        bgc = [250, 250, 250];
    
}

function turtle() {
   background(bgc);
    angle = radians((mainConfig.stems.angle.max + mainConfig.stems.angle.min) / 2);
    resetMatrix();
    translate(width / 2, height - 15);
    for (var i = 0; i < sentence.length; i++) {
        strokeWeight(mainConfig.stems.strokeWeight);
        stroke(mainConfig.stems.color.r, mainConfig.stems.color.g, mainConfig.stems.color.b);
        var current = sentence.charAt(i);
        if (current == 'F' || current == 'G') {
            line(0, 0, 0, -len);
            translate(0, -len);
        } else if (current == '*') {
            if (i % mainConfig.flowers.density === 0) {
                scale(0.8);
                makeFlower();
            }
        } else if (current == '+') {
            let positiveRotation = angle * 0.5;
            rotate(positiveRotation);
        } else if (current == '-') {
            let negativeRotation = -angle * 0.5;
            rotate(negativeRotation);
        } else if (current == '[') {
            push();
        } else if (current == ']') {
            pop();
            count++;
        }
    }
    if (i >= sentence.length) {
        finished = true;
    }
}

function generateStems(iterations) {
    for (i = iterations - 1; i > 0; i--) {
        branch();
    }
}

function branch() {
    len *= 0.485;
    var nextSentence = '';
    for (var i = 0; i < sentence.length; i++) {
        var current = sentence.charAt(i);
        var found = false;
        for (var j = 0; j < rules.length; j++) {
            if (current == rules[j].a) {
                found = true;
                nextSentence += rules[j].b;
                break;
            }
        }
        if (!found) {
            nextSentence += current;
        }
    }
    sentence = nextSentence;
    turtle();
}

function draw() {
    // Disabled - flowers now displayed in footer
    // noFill();
    // smooth();
    // background(3, 3, 3);
    // createSingleFlower();
    // noLoop();
}

function createSingleFlower(){
    turtle();
    generateStems(mainConfig.stems.count);
}
makeCenterFlower();