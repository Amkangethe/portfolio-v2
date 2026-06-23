//------------------------------------------------------------------------------------------
// Set the theme
const ICON_LIGHT = "../static/img/theme/sun.png";
const ICON_DARK  = "../static/img/theme/moon.png";

const root = document.documentElement;
const icon = document.getElementById("theme-icon");
const themeButton = document.getElementById("theme-button");


let currentTheme = localStorage.getItem("currentTheme");

if (!currentTheme)
{
    currentTheme = "dark"; // default theme
}

root.dataset.theme = currentTheme;
const setIcon = () =>
{
    const isDark = root.dataset.theme === "dark";
    icon.src = isDark ? ICON_DARK : ICON_LIGHT;
};

if (themeButton && icon)
{
    // Toggle Theme
    themeButton.addEventListener('click', () => {
        newTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        root.dataset.theme = newTheme;
        localStorage.setItem("currentTheme", newTheme);
        setIcon();
    });
}

setIcon();
//------------------------------------------------------------------------------------------
document.querySelectorAll('.header-options').forEach(option => {
    option.addEventListener('click', () => {
            const target = document.getElementById(option.textContent.toLowerCase());
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
});


const text = "AI Engineer. Masters Student. Full Stack Dev.";
const el = document.getElementById("introduction-description");
let i = 0;
let deleting = false;

function type() {
    if (!deleting && i < text.length) {
        el.textContent += text[i++];
        setTimeout(type, 140);
    } else if (!deleting && i === text.length) {
        deleting = true;
        setTimeout(type, 1500); // pause before deleting
    } else if (deleting && i > 0) {
        el.textContent = text.slice(0, --i);
        setTimeout(type, 40); // delete faster than typing
    } else {
        deleting = false;
        setTimeout(type, 800); // pause before retyping
    }
}
type();
//------------------------------------------------------------------------------------------
const chatboxInput = document.querySelector('.chatbox-input');
const sendButton = document.querySelector('.chatbox-send-button');
const askText = document.getElementById('ask');

chatboxInput.addEventListener('input', () => {
    const hasText = chatboxInput.value.trim();
    if (sendButton.style.opacity = hasText)
        {
            sendButton.style.opacity = 1;
            chatboxInput.style.fontWeight = 'normal';

        }
    else
        {
            sendButton.style.opacity = 0;
            chatboxInput.style.fontWeight = '700';
        }
    sendButton.style.pointerEvents = hasText ? 'auto' : 'none';
    askText.style.opacity = hasText ? '0' : '1';
    
});
//------------------------------------------------------------------------------------------
const gatech = document.querySelector('.card-gatech');


const umbc   = document.querySelector('.card-umbc');
const photo  = document.querySelector('.photo-img');
const photoDescription = document.querySelector('.photo-description');

let gatechIsFront = true;

const FRONT = { transform: 'translate(0, 0)', zIndex: '2', boxShadow: 'none', backdropFilter: 'blur(30px)' };
const BACK  = { transform: 'translate(20px, -20px)',     zIndex: '1', boxShadow: 'none',  backdropFilter: 'blur(30px)' };
const PEEK  = { transform: 'translate(30px, -30px) rotate(5deg)', boxShadow: '0 0 10px rgba(255,255,255,0.4)' };

const GATECH_PHOTO   = "../static/img/campus/gatech-campus.jpg";
const UMBC_PHOTO     = "../static/img/campus/umbc-campus.jpg";
const DEFAULT_PHOTO  = "../static/img/headshot.jpg";

function applyStyle(el, styles) { Object.assign(el.style, styles); }

function setPhoto(src) {
    if (!src) { photo.style.display = 'none'; return; }
    photo.style.opacity = '0';
    photo.style.display = 'block';
    setTimeout(() => { photo.src = src; photo.style.opacity = '1'; }, 300);
}

function setDescription(description) {
    photoDescription.style.opacity = '0';
    setTimeout(() => { photoDescription.textContent = description; photoDescription.style.opacity = '1'; }, 300);
}


document.querySelector('.card-container').addEventListener('click', () => {
    if (gatechIsFront) {
        applyStyle(gatech, BACK);
        applyStyle(umbc, FRONT);
    } else {
        applyStyle(umbc, BACK);
        applyStyle(gatech, FRONT);
    }
    gatechIsFront = !gatechIsFront;
});

gatech.addEventListener('mouseenter', () => {
    if (gatechIsFront) applyStyle(umbc, PEEK);
    setPhoto(GATECH_PHOTO);
    setDescription("Atlanta, Georgia");
    
});
gatech.addEventListener('mouseleave', () => {
    if (gatechIsFront) applyStyle(umbc, BACK);
    setPhoto(DEFAULT_PHOTO);
    setDescription("Me");
});

umbc.addEventListener('mouseenter', () => {
    if (!gatechIsFront) applyStyle(gatech, PEEK);
    setPhoto(UMBC_PHOTO);
    setDescription("Baltimore, Maryland");
});
umbc.addEventListener('mouseleave', () => {
    if (!gatechIsFront) applyStyle(gatech, BACK);
    setPhoto(DEFAULT_PHOTO);
    setDescription("Me");
});
//------------------------------------------------------------------------------------------
const locationCard  = document.querySelector('.location-card');
const DC_PHOTO = "../static/img/location/dc.png";

locationCard.addEventListener('mouseenter', () => {
    applyStyle(photo);
    setPhoto(DC_PHOTO);
    setDescription("Washington, D.C.");
    console.log("Hovered over location card");
});
locationCard.addEventListener('mouseleave', () => {
    setPhoto(DEFAULT_PHOTO);
    setDescription("Me");
});


