document.addEventListener('DOMContentLoaded', function () {
    initMusicControl();
    initTypingEffect();
    initMusicAutoPlay();
    initCardEffect();
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });
    if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', function () {
            const bgMusic = document.getElementById('bgMusic');
            bgMusic.play();
        });
    }
    disableSelectionAndDrag();
});

function disableSelectionAndDrag() {
    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
        return false;
    });
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    });
}

function initMusicControl() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = true;
    musicToggle.addEventListener('click', function () {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.style.background = 'rgba(255, 255, 255, 0.2)';
        } else {
            bgMusic.play();
            musicToggle.style.background = 'rgba(255, 255, 255, 0.4)';
        }
        isPlaying = !isPlaying;
    });
}

function initTypingEffect() {
    const nameContainer = document.querySelector('.name-container');
    const nameTextElement = document.querySelector('.name-text');
    const nameText = "DenSonet";
    let isDeleting = false;
    let text = '';
    let index = 0;
    let typingSpeed;
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    nameContainer.appendChild(cursor);
    function updateCursor() {
        if (text === '') {
            const containerWidth = nameContainer.offsetWidth;
            cursor.style.left = `${(containerWidth - cursor.offsetWidth) / 2}px`;
        } else {
            const textWidth = nameTextElement.offsetWidth;
            cursor.style.left = `${textWidth + 2}px`;
        }
    }
    function type() {
        if (isDeleting) {
            if (text.length > 0) {
                text = nameText.substring(0, text.length - 1);
                nameTextElement.textContent = text;
                typingSpeed = 80;
            }
            if (text === '') {
                isDeleting = false;
                typingSpeed = 1500;
                index = 0;
                nameContainer.style.textAlign = 'center';
                updateCursor();
            }
        } else {
            if (index < nameText.length) {
                text = nameText.substring(0, index + 1);
                nameTextElement.textContent = text;
                typingSpeed = 150;
                index++;
            }
            if (text === nameText) {
                isDeleting = true;
                typingSpeed = 800;
                nameContainer.style.textAlign = 'center';
                updateCursor();
            }
        }
        updateCursor();
        setTimeout(type, typingSpeed);
    }
    nameTextElement.textContent = '';
    cursor.style.display = 'block';
    updateCursor();
    setTimeout(type, 1000);
}

function initMusicAutoPlay() {
    const bgMusic = document.getElementById('bgMusic');
    function tryPlay() {
        bgMusic.play().then(() => {
            bgMusic.muted = false;
        }).catch((e) => {
            document.addEventListener('click', function clickHandler() {
                bgMusic.play().then(() => {
                    bgMusic.muted = false;
                    document.removeEventListener('click', clickHandler);
                }).catch((error) => {
                    console.log('点击后播放仍受阻:', error);
                });
            });
        });
    }
    tryPlay();
}

function initCardEffect() {
    const card = document.getElementById('card');
    const container = document.getElementById('card-container');

    if (!card || !container) return;

    const MAX_ROTATION = 15;

    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    function animate() {
        currentRotateX += (targetRotateX - currentRotateX) * 0.1;
        currentRotateY += (targetRotateY - currentRotateY) * 0.1;

        card.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

        requestAnimationFrame(animate);
    }

    animate();

    setTimeout(() => {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();

            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            targetRotateX = (0.5 - y) * MAX_ROTATION * 2;
            targetRotateY = (x - 0.5) * MAX_ROTATION * 2;
        });

        container.addEventListener('mouseleave', () => {
            targetRotateX = 0;
            targetRotateY = 0;
        });
    }, 1000);
}