let movableElements;
const positionSlider = document.getElementById('positionSlider');

positionSlider.addEventListener('input', onSlide);

function onSlide() {
    const sliderValue = positionSlider.value;
    const sliderAdj = (sliderValue-500)/50;
    
    movableElements.forEach(elem => {
        const x = 50+parseFloat(elem.dataset.dx)*2.5**(parseFloat(elem.dataset.size)+sliderAdj);
        const y = 30+parseFloat(elem.dataset.dy)*2.5**(parseFloat(elem.dataset.size)+sliderAdj);
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

function createMovableElement(dict) {
    const elem = document.createElement('movable-element');

    if ('img' in dict) {
        const img = document.createElement('img');
        img.src = dict['img'];
        img.style.width = '100%'; // could change to be variable

        elem.appendChild(img);
    }

    if ('figcaption' in dict) {
        const imgcaption = document.createElement('figcaption');
        imgcaption.textContent = dict['figcaption'];

        elem.appendChild(imgcaption);
    }

    if ('p' in dict) {
        const p = document.createElement('p');
        p.textContent = dict['p'];

        elem.appendChild(p);
    }

    elem.dataset.dx = dict['dx'];
    elem.dataset.dy = dict['dy'];
    elem.dataset.size = dict['size'];

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