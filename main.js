const slider = document.querySelector('.range__slider');
const sliderValue = document.querySelector('.length__title');
const generateBtn = document.getElementById('generate');
const copyBtn = document.getElementById('copy-btn');
const copyInfo = document.querySelector('.result__info.right');
const copiedInfo = document.querySelector('.result__info.left');
const resultContainer = document.querySelector('.result');
const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('slider');
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numberEl = document.getElementById("number");
const symbolEl = document.getElementById("symbol");
let generatedPassword = false;

const sliderProps = {
	fill: "#0B1EDF",
	background: "rgba(255, 255, 255, 0.214)",
};

const copy =()=>{
    let copyText = document.querySelector('#input');
    copyText.select();

}

const getRandomLower= ()=> {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
}
const getRandomUpper = () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
}
const getRandomNumber = () => {
    return (Math.floor(Math.random() * 9)).toString()
}
const getRandomSymbol = () => {
    const symbols = '~!@#$%^&*()_+{}":?><;.,'
    return symbols[Math.floor(Math.random() * symbols.length)]
}

const applyFill = (slider) =>{
    const percentage = (100* (slider.value - slider.min)) / (slider.max - slider.min);
    const bg = `linear-gradient(90deg,${sliderProps.fill} ${percentage}%, ${sliderProps.background} ${percentage + 0.1}%)`
    slider.style.background = bg;
    sliderValue.setAttribute("data-length", slider.value)
}

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol,
}




//* handles the checkboxes state:
//* at least one need to be selected , last checkbox will be disabled

const disableOnlyCheckbox = () => {
    let totalChecked = [uppercaseEl, lowercaseEl, numberEl, symbolEl].filter(el => el.checked);
    totalChecked.forEach(el => {
        if (totalChecked.length == 1) {
            el.disabled = true;
        } else {
            el.disabled = false;
        }
    })
}




//! Update Css Props of the COPY button
// * Getting the bounds of the result viewbox container
let resultContainerBound = {
    top: resultContainer.getBoundingClientRect().top,
    left: resultContainer.getBoundingClientRect().left,
}
// * This will update the position of the copy button based on mouse Position
resultContainer.addEventListener("mousemove", e => {
    resultContainerBound = {
        left: resultContainer.getBoundingClientRect().left,
        top: resultContainer.getBoundingClientRect().top,
    };
    if (generatedPassword) {
        copyBtn.style.opacity = '1';
        copyBtn.style.pointerEvents = 'all';
        copyBtn.style.setProperty("--x", `${e.x - resultContainerBound.left}px`);
        copyBtn.style.setProperty("--y", `${e.y - resultContainerBound.top}px`);
    } else {
        copyBtn.style.opacity = '0';
        copyBtn.style.pointerEvents = 'none';
    }
});


//* generate password and returning it
const generatePassword = (length, lower, upper, number, symbol) => {
    let generatedPassword = "";
    const typesCounter = lower + upper + number + symbol;
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);
    if (typesCounter === 0) {
        return "";
    }
    for (let i = 0; i < length; i++) {
        typesArr.forEach(type => {
            const funcName = Object.keys(type)[0];
            generatedPassword += randomFunc[funcName]();
        });
    }
    return generatedPassword.slice(0, length)
        .split('')
        .sort(() => Math.random() - 0.5)
        .join('');
}

applyFill(slider.querySelector("input"));
slider.querySelector("input").addEventListener("input",event=>{
    sliderValue.setAttribute("data-length",event.target.value);
    applyFill(event.target);
})



//* when Generate button is clicked Password is generated
generateBtn.addEventListener('click', () => {
    const length = + lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasSymbol = symbolEl.checked;
    const hasNumber = numberEl.checked;
    generatedPassword = true;
    resultEl.textContent = generatePassword(length, hasLower, hasUpper,hasNumber, hasSymbol );
    copyInfo.style.transform = "translateY(0%)";
    copyInfo.style.opacity = "0.75";
    copiedInfo.style.transform = "translateY(200%)";
    copiedInfo.style.opacity = "0"
});





//* Copy Password in clipboard
//* clipboard API is the alternative to execCommand
copyBtn.addEventListener("click", () => {
    const password = resultEl.textContent;
    if(!navigator.clipboard){
        const textarea = document.createElement("textarea");
        textarea.value = password;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
    }
    else{
        navigator.clipboard.writeText(password)
            .catch((err)=>console.error(err));
    }

    copyInfo.style.transform = "translateY(200%)";
    copyInfo.style.opacity = "0";
    copiedInfo.style.transform = "translateY(0%)";
    copiedInfo.style.opacity = "0.75";
})



[uppercaseEl, lowercaseEl, numberEl, symbolEl].forEach(el => {
    el.addEventListener('click', () => {
        disableOnlyCheckbox();
    })
})
