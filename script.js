const player = document.querySelector('.player');
const game = document.querySelector('#main-game');
const aliens = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const instructions = document.querySelector('.game-instructions');
const start = document.querySelector('.start');
let alienInterval;

function move(event) {
    if (event.key === 'w') {
        event.preventDefault();
        moveUp();
    } else if (event.key === 's') {
        event.preventDefault();
        moveDown();
    } else if (event.key === ' ') {
        event.preventDefault();
        shoot();
    }
}

function moveUp() {
    let topPosition = getComputedStyle(player).getPropertyValue('top');

    if (topPosition === '0px') return;
    else {
        let position = parseInt(topPosition);
        position -= 45;
        player.style.top = `${position}px`;
    }
}

function moveDown() {
    let topPosition = getComputedStyle(player).getPropertyValue('top');

    if (topPosition === '540px') return;
    else {
        let position = parseInt(topPosition);
        position += 45;
        player.style.top = `${position}px`;
    }
}

function shoot() {
    let laser = createLaserElement();
    game.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(player).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let position = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => {
            if (checkLaserCollision(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if (position === 460) laser.remove();
        else laser.style.left = `${position + 8}px`
    }, 10);
}

function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliens[Math.floor(Math.random() * aliens.length)];
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    game.appendChild(newAlien);
    moveAlien(newAlien);
}

function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let position = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if (position <= 50) {
            if (Array.from(alien.classList).includes('dead-alien')) alien.remove();
            else gameOver();
        } else alien.style.left = `${position - 4}px`
    }, 30)
}

function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if (laserLeft != 460 && laserLeft + 40 >= alienLeft && laserTop <= alienTop && laserTop >= alienBottom) return true;
    else return false
}

start.addEventListener('click', (event) => {
    play();
})

function play() {
    start.style.display = 'none';
    instructions.style.display = 'none';
    window.addEventListener('keydown', move);
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

function gameOver() {
    window.removeEventListener('keydown', move);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('game over!');
        player.style.top = '270px';
        start.style.display = 'block';
        instructions.style.display = 'block';
    })
}