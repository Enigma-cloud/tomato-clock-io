const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('.time-span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

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

        // If Countdown complete, show Complete
        if (distance < 0) {
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        }
        // Else, show Countdown 
        else {
            // Populate Countdown
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    }, second);
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
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', resetCountdown);
completeBtn.addEventListener('click', resetCountdown);

// On Load, check localStorage
restorePreviousCountdown();
