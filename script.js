// Clock
const clockViewButton = document.getElementById('clock-btn');
const clockContainer = document.getElementById('clock-container');
const clockElTitle = document.getElementById('clock-title');
const clockTimeEls = document.querySelectorAll('.clock-time');

// Countdown
const countdownViewBtn = document.getElementById('countdown-btn');
const countdownContainer = document.getElementById('countdown-container');
const inputContainer = document.getElementById('countdown-input');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownResetBtn = document.getElementById('countdown-reset-btn');
const countdownTimeEls = document.querySelectorAll('.countdown-time');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

// Stopwatch
const stopwatchViewBtn = document.getElementById('stopwatch-btn');
const stopwatchContainer = document.getElementById('stopwatch-container');
const stopwatchDisplay = document.getElementById('stopwatch-display');

const stopwatchForm = document.getElementById('stopwatchForm');
const stopwatchElTitle = document.getElementById('stopwatch-title');
const stopwatchTitleInput = document.getElementById('stopwatch-input-title');
const stopwatchTimeEls = document.querySelectorAll('.stopwatch-time');
const stopwatchInputs = document.getElementById('stopwatch-inputs');

const formElSecs = document.getElementById('stopwatch-seconds');
const formElMins = document.getElementById('stopwatch-minutes');
const formElHours = document.getElementById('stopwatch-hours');


/** Variables & Constants */
// Clock
let clockTitle = '';
let clockDate = '';
let clockValue = new Date();
let clockActive;
// Countdown
let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;
// Stopwatch
let stopwatchActive;

// View booleans
let isClock;
let isCountdown;
let isStopwatch;

// Time variables
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Min Date
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute('min', today);


/** Functions */
// Populate countdown, complete UI
function updateDOM() {
    if (isClock) {
        clockActive = setInterval(() => {
            const today = new Date();

            clockElTitle.textContent = `${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
            clockTimeEls[0].textContent = `${today.getHours()}`;
            clockTimeEls[1].textContent = `${today.getMinutes()}`;
            clockTimeEls[2].textContent = `${today.getSeconds()}`;
        }, second);
    }

    if (isCountdown) {
        countdownActive = setInterval(() => {
            const now =  new Date().getTime();
            const distance = countdownValue - now;
            // Calculate time units
            const days = Math.floor(distance / day);
            const hours = Math.floor((distance % day) / hour);
            const minutes = Math.floor((distance % hour) / minute);
            const seconds = Math.floor((distance % minute) / second);
    
            // Hide Input
            inputContainer.hidden = true;
    
            if (distance < 0) {
                countdownEl.hidden = true;
                clearInterval(countdownActive);
                completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
                completeEl.hidden = false;
            }
            else {
                // Populate Countdown
                countdownElTitle.textContent = `${countdownTitle}`;
                countdownTimeEls[0].textContent = `${days}`;
                countdownTimeEls[1].textContent = `${hours}`;
                countdownTimeEls[2].textContent = `${minutes}`;
                countdownTimeEls[3].textContent = `${seconds}`;
                completeEl.hidden = true;
                countdownEl.hidden = false;
            }
        }, second);
    }

    if (isStopwatch) {
        const inputSecs = formElSecs.value;
        const inputMins = formElMins.value;
        const inputHours = formElHours.value;
        // Convert input time values into seconds
        let hourVal = inputHours > 0 ? inputHours * 60**2 : 0;
        let minuteVal = inputMins > 0 ? inputMins * 60 : 0;
        let secVal = inputSecs > 0 ? inputSecs : 0;
        let totalTime = Number(hourVal + minuteVal + secVal);

        stopwatchActive = setInterval(() => {
            if (totalTime < 0) {
                clearInterval(stopwatchActive);
            }

            else {
                const seconds = Math.floor((totalTime % 60) / 1);
                const minutes = Math.floor((totalTime % 3600) / 60);
                const hours = Math.floor(totalTime / 3600);
                
                stopwatchElTitle.textContent = `${stopwatchTitleInput.value}`;
                stopwatchTimeEls[0].textContent = `${hours}`;
                stopwatchTimeEls[1].textContent = `${minutes}`;
                stopwatchTimeEls[2].textContent = `${seconds}`;
                
                totalTime = totalTime - 1;
            }
        }, second);
    }
}

// Get values from Countdown Form
function updateCountdown(e) {
    e.preventDefault();
    // Set inputs
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    // Store in local storage
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown', JSON.stringify(savedCountdown));

    // Check date input
    if (countdownDate === '') {
        alert('Please pick a date');
        return
    }
    // Get number version of current Date => updateDOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
}

// Reset Countdown
function resetCountdown() {
    // Hide countdown => show input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;

    // Stop previous countdown
    clearInterval(countdownActive);

    // Reset variables
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

// Get Local Storage Countdown
function restorePreviousCountdown() {
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')) {
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDOM();
    }
}


/** Event Listeners */
// Clock
clockViewButton.addEventListener('click', () => {
    isClock = true;
    isCountdown = false;
    isStopwatch = false;
    
    isClock ? clockContainer.hidden = false : '';
    isCountdown ? '' : countdownContainer.hidden = true;
    isStopwatch ? '' : stopwatchContainer.hidden = true;
    updateDOM();
});
// Countdown
countdownForm.addEventListener('submit', updateCountdown);
countdownResetBtn.addEventListener('click', resetCountdown);
completeBtn.addEventListener('click', resetCountdown);
countdownViewBtn.addEventListener('click', () => {
    isClock = false;
    isCountdown = true;
    isStopwatch = false;
    // Reset clock
    clearInterval(clockActive);

    isClock ? '' : clockContainer.hidden = true;
    isCountdown ? countdownContainer.hidden = false : '';
    isStopwatch ? '' : stopwatchContainer.hidden = true;

    if (localStorage.getItem('countdown')) {
        restorePreviousCountdown();
    }
    else {
        resetCountdown();
    }
});
// Stopwatch
stopwatchViewBtn.addEventListener('click', () => {
    isClock = false;
    isCountdown = false;
    isStopwatch = true;
    // Reset clock
    clearInterval(clockActive);

    isClock ? '' : clockContainer.hidden = true;
    isCountdown ? '' : countdownContainer.hidden = true;
    isStopwatch ? stopwatchContainer.hidden = false : '';
});
stopwatchForm.addEventListener('submit', (e) => {
    e.preventDefault();

    stopwatchInputs.hidden = true;
    stopwatchDisplay.hidden = false;
    updateDOM();
});