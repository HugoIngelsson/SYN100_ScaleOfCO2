let movableElements, curSelection = null;
const positionSlider = document.getElementById('positionSlider');

positionSlider.addEventListener('input', onSlide);

function renderAll() {
    const sliderValue = positionSlider.value;
    const sliderAdj = (sliderValue-500)/50;
    
    movableElements.forEach(elem => {
        const x = 50+parseFloat(elem.dataset.dx)*2.5**(parseFloat(elem.dataset.size)+sliderAdj);
        const y = 50+parseFloat(elem.dataset.dy)*2.5**(parseFloat(elem.dataset.size)+sliderAdj);
        elem.style.left = `${x}%`;
        elem.style.top = `${y}%`;
        
        const size = 2.3**(parseFloat(elem.dataset.size)+sliderAdj);
        elem.style.width = `${size}%`

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

// a = 2.5 ** (size + (x-500)/50)
// size+(x-500)/50 = log2.5(a)
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

        positionSlider.value = (Math.min(Math.log(10 / Math.abs(elem.dataset.dx)), Math.log(20 / Math.abs(elem.dataset.dy))) 
            / Math.log(2.3) - elem.dataset.size) * 50 + 500;
    }

    enableTransition();
    renderAll();
}

function createMovableElement(dict) {
    const elem = document.createElement('movable-element');

    const img = document.createElement('img');
    const p = document.createElement('p');
    const imgcaption = document.createElement('figcaption');

    if ('img' in dict) {
        img.src = dict['img'];
        img.style.width = '100%';
    }

    if ('p' in dict) {
        p.textContent = dict['p'];
    }

    if ('figcaption' in dict) {
        imgcaption.textContent = dict['figcaption'];
    }

    p.style.top = "0px";
    if (parseFloat(dict['dx']) >= 0) {
        p.style.left = "100%";
    } else {
        p.style.left = "-100%";
    }

    elem.appendChild(img);
    elem.appendChild(imgcaption);
    elem.appendChild(p);

    elem.dataset.dx = dict['dx'];
    elem.dataset.dy = dict['dy'];
    elem.dataset.size = dict['size'];

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

    initSpace(elemContainer, 'data.json');

    elemContainer.addEventListener('wheel', function(event) {
        positionSlider.value = parseInt(positionSlider.value)+event.deltaY;
        onSlide();
    });
})