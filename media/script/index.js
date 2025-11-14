let movableElements, curSelection = null;
const positionSlider = document.getElementById('positionSlider');

// for tracking inactivity
let inactivityTimer, scroller, scrollDir, maxScroll, minScroll;
const inactivityDuration = 20000, scrollRate = 100;

positionSlider.addEventListener('input', onSlide);

const LINEAR = 550, SCALAR = 40;
function renderAll() {
    const sliderValue = positionSlider.value;
    const sliderAdj = (sliderValue - LINEAR) / SCALAR;
    
    movableElements.forEach(elem => {
        const x = parseFloat(elem.dataset.dx)*2.5**(parseFloat(elem.dataset.size)+sliderAdj);
        const y = parseFloat(elem.dataset.dy)*2.5**(parseFloat(elem.dataset.size)+sliderAdj);
        elem.style.left = `calc(50% + var(--dimension-scaler) * ${x} / 100)`;
        elem.style.top = `calc(50% + var(--dimension-scaler) * ${y} / 100)`;
        
        const size = 2.3**(parseFloat(elem.dataset.size)+sliderAdj);
        elem.style.width = `calc(var(--dimension-scaler) * ${size} / 100)`

        console.log(size, x, y)
        if (size < 0.25 || (x > 125 || x < -25) && (y > 125 || y < -25))
            elem.hidden = true;
        else
            elem.hidden = false;
    });
}

function enableTransition() {
    movableElements.forEach(elem => {
        elem.style.transition = "left 1s, top 1s, width 1s";
    });
}

function disableTransition() {
    movableElements.forEach(elem => {
        elem.style.transition = "";
    });
}

function onSlide() {
    disableTransition();
    renderAll();
}

function passiveScroll() {
    enableTransition();
    
    let val = parseInt(positionSlider.value)
    if (val === maxScroll) {
        scrollDir = -1;
    } else if (val === minScroll) {
        scrollDir = 1;
    }

    positionSlider.value = val + scrollDir;

    renderAll();
    scroller = setTimeout(passiveScroll, scrollRate); // set up next scroll
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    clearTimeout(scroller);
    inactivityTimer = setTimeout(passiveScroll, inactivityDuration);
}

function onClick(event, item) {
    const elem = item;

    if (item == curSelection) {
        delete curSelection.dataset.selected;
        curSelection = null;
    } else {
        if (curSelection != null) {
            delete curSelection.dataset.selected;
        }
        curSelection = item;
        curSelection.dataset.selected = '';

        positionSlider.value = (Math.min(Math.log(10 / Math.abs(elem.dataset.dx)), Math.log(15 / Math.abs(elem.dataset.dy))) 
            / Math.log(2.3) - elem.dataset.size) * SCALAR + LINEAR;
    }

    resetInactivityTimer();
    enableTransition();
    renderAll();
}

function createMovableElement(dict) {
    const elem = document.createElement('movable-element');

    const alwaysDisp = document.createElement('always-display');
    const infoReveal = document.createElement('info-reveal');

    if ('info-reveal' in dict) {
        const name = document.createElement('h1');
        name.textContent = dict['info-reveal']['name'];

        const output = document.createElement('h2');
        output.textContent = dict['info-reveal']['output'];

        const p = document.createElement('p');
        p.textContent = dict['info-reveal']['description'];

        infoReveal.appendChild(name);
        infoReveal.appendChild(output);
        infoReveal.appendChild(p);
    } else if ('p' in dict) {
        const p = document.createElement('p');
        p.textContent = dict['p'];

        infoReveal.appendChild(p);
    }

    if ('always-display' in dict) {
        const img = document.createElement('img');
        if (dict['always-display']['img'] !== '')
            img.src = './media/img/' + dict['always-display']['img'] + '.svg';
        else
            img.src = './media/img/placeholder.png';

        const imgcaption = document.createElement('figcaption');
        imgcaption.textContent = dict['always-display']['figcaption'];

        alwaysDisp.appendChild(img);
        alwaysDisp.appendChild(imgcaption);
    }

    infoReveal.style.top = "50%";
    if (parseFloat(dict['dx']) >= 0) {
        infoReveal.style.left = "110%";
    } else {
        infoReveal.style.left = "-120%";
    }

    elem.appendChild(infoReveal)
    elem.appendChild(alwaysDisp);

    elem.dataset.dx = dict['dx'];
    elem.dataset.dy = dict['dy'];
    elem.dataset.size = Math.log10(dict['carbon']) / Math.log10(5);

    elem.addEventListener('click', function(event) {
        onClick(event, this);
    });

    return elem;
}

function initSpace(elemContainer, fileName) {
    fetch(fileName)
        .then((res) => res.text())
        .then((text) => {
            data = JSON.parse(text);

            data['data'].forEach(item => {
                elemContainer.appendChild(createMovableElement(item));
            });

            movableElements = document.querySelectorAll('movable-element');
            onSlide();
        })
        .catch((e) => console.error(e));
}

document.addEventListener('DOMContentLoaded', () => {
    const elemContainer = document.getElementById('element-container');

    initSpace(elemContainer, './media/json/data.json');
    resetInactivityTimer();
    scrollDir = 1;
    maxScroll = parseInt(positionSlider.max);
    minScroll = parseInt(positionSlider.min);

    elemContainer.addEventListener('wheel', function(event) {
        positionSlider.value = parseInt(positionSlider.value)+event.deltaY;
        resetInactivityTimer();
        onSlide();
    });
})