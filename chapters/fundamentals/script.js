// This script uses the 'defer' attribute in the HTML <head> tag.
// This ensures it runs only after the entire HTML document is loaded, preventing all timing errors.

// --- Main Navigation Logic ---
function initializeLessonNavigation(lessonContainer) {
    if (!lessonContainer) return;
    const pages = lessonContainer.querySelectorAll('.page');
    const tocLinks = lessonContainer.querySelectorAll('.table-of-contents a');
    const startBtn = lessonContainer.querySelector('.start-now-btn');

    function showPage(pageIndex) {
        pages.forEach((page, i) => page.classList.toggle('hidden', i !== pageIndex));
        if (pageIndex >= 0 && pageIndex < pages.length) {
            const currentPage = pages[pageIndex];
            const prevBtn = currentPage.querySelector('.prev-page');
            const nextBtn = currentPage.querySelector('.next-page');
            if (prevBtn) {
                prevBtn.textContent = (pageIndex === 1) ? "< Back to Contents" : "< Previous";
                prevBtn.onclick = () => showPage((pageIndex === 1) ? 0 : pageIndex - 1);
            }
            if (nextBtn) {
                const isLastPage = pageIndex === pages.length - 1;
                nextBtn.disabled = isLastPage;
                nextBtn.textContent = isLastPage ? "Next Project >" : "Next >";
                if (!isLastPage) nextBtn.onclick = () => showPage(pageIndex + 1);
            }
        }
    }

    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = document.querySelector(link.getAttribute('href'));
            if (targetPage) showPage(parseInt(targetPage.dataset.pageIndex, 10));
        });
    });

    if (startBtn) startBtn.addEventListener('click', () => showPage(1));
    showPage(0); // Show the TOC page initially
}

// --- Natural Numbers Quiz ---
function initializeNaturalNumberQuiz() {
    const questionEl = document.getElementById('quiz-question-text');
    if (!questionEl) return;
    const answerButtonsEl = document.getElementById('quiz-answer-buttons');
    const feedbackEl = document.getElementById('quiz-feedback');
    const nextButton = document.getElementById('quiz-next-btn');
    let currentQuestion = {};

    function generateQuestion() {
        const questionType = Math.random();
        let num1, num2;
        if (questionType < 0.5) {
            const isNatural = Math.random() < 0.5;
            if (isNatural) {
                num1 = Math.ceil(Math.random() * 100);
                return { text: `Is <strong>${num1}</strong> a natural number?`, answer: true, explanation: `${num1} is a positive counting number.` };
            } else {
                const nonNaturalType = Math.random();
                if (nonNaturalType < 0.33) num1 = 0;
                else if (nonNaturalType < 0.66) num1 = -(Math.ceil(Math.random() * 100));
                else num1 = (Math.random() * 10).toFixed(1);
                return { text: `Is <strong>${num1}</strong> a natural number?`, answer: false, explanation: `Natural numbers cannot be zero, negative, or a decimal.` };
            }
        } else {
            const isNaturalResult = Math.random() < 0.5;
            if (isNaturalResult) {
                num2 = Math.ceil(Math.random() * 10) + 1;
                num1 = num2 * (Math.ceil(Math.random() * 10) + 1);
                return { text: `Does <strong>${num1} ÷ ${num2}</strong> result in a natural number?`, answer: true, explanation: `Yes, because ${num1} ÷ ${num2} = ${num1 / num2}, which is a natural number.` };
            } else {
                num2 = Math.ceil(Math.random() * 10) + 2;
                num1 = Math.ceil(Math.random() * 50) + 1;
                while (num1 % num2 === 0) { num1 = Math.ceil(Math.random() * 50) + 1; }
                return { text: `Does <strong>${num1} ÷ ${num2}</strong> result in a natural number?`, answer: false, explanation: `No, because ${num1} ÷ ${num2} = ${(num1 / num2).toFixed(2)}, which is not a whole number.` };
            }
        }
    }

    function displayQuestion() {
        currentQuestion = generateQuestion();
        questionEl.innerHTML = currentQuestion.text;
        feedbackEl.style.display = 'none';
        nextButton.style.display = 'none';
        answerButtonsEl.querySelectorAll('button').forEach(btn => btn.disabled = false);
    }

    answerButtonsEl.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        const userAnswer = e.target.dataset.answer === 'true';
        if (userAnswer === currentQuestion.answer) {
            feedbackEl.textContent = `Correct! ${currentQuestion.explanation}`;
            feedbackEl.className = 'quiz-feedback correct';
        } else {
            feedbackEl.textContent = `Not quite. ${currentQuestion.explanation}`;
            feedbackEl.className = 'quiz-feedback incorrect';
        }
        feedbackEl.style.display = 'block';
        nextButton.style.display = 'inline-block';
        answerButtonsEl.querySelectorAll('button').forEach(btn => btn.disabled = true);
    });

    nextButton.addEventListener('click', displayQuestion);
    displayQuestion();
}

// --- Whole Numbers Interactive ---
function initializeWholeNumberInteractive() {
    const toggleBtn = document.getElementById('toggle-zero-btn');
    if (!toggleBtn) return;
    const zeroElement = document.getElementById('zero-element');
    const numberSetTarget = document.getElementById('number-set-target');
    const setLabel = document.getElementById('set-label');
    toggleBtn.addEventListener('click', () => {
        const isZeroIncluded = numberSetTarget.contains(zeroElement);
        if (!isZeroIncluded) {
            numberSetTarget.prepend(zeroElement);
            setLabel.textContent = "Whole Numbers";
            toggleBtn.textContent = "Reset";
        } else {
            document.getElementById('zero-container').prepend(zeroElement);
            setLabel.textContent = "Natural Numbers";
            toggleBtn.textContent = "Add 0 to the Set";
        }
    });
}

// --- Factor Finder Game ---
function initializeFactorFinderGame() {
    const targetNumberEl = document.getElementById('target-number');
    if (!targetNumberEl) return;
    const numberGridEl = document.getElementById('number-grid');
    const checkBtn = document.getElementById('check-factors-btn');
    const newBtn = document.getElementById('new-number-btn');
    let correctFactors = [];

    function generateNewGame() {
        const currentTarget = Math.floor(Math.random() * 25) + 12; // Numbers 12-36
        targetNumberEl.textContent = currentTarget;
        correctFactors = [];
        for (let i = 1; i <= currentTarget; i++) { if (currentTarget % i === 0) correctFactors.push(i); }
        numberGridEl.style.setProperty('--grid-columns', Math.ceil(currentTarget / 3));
        numberGridEl.innerHTML = '';
        for (let i = 1; i <= currentTarget; i++) {
            const btn = document.createElement('button');
            btn.className = 'grid-number'; btn.textContent = i; btn.dataset.number = i;
            numberGridEl.appendChild(btn);
        }
        checkBtn.style.display = 'inline-block';
        newBtn.style.display = 'none';
        numberGridEl.style.pointerEvents = 'auto';
    }
    numberGridEl.addEventListener('click', (e) => { if (e.target.classList.contains('grid-number')) e.target.classList.toggle('selected'); });
    checkBtn.addEventListener('click', () => {
        numberGridEl.querySelectorAll('.grid-number').forEach(btn => {
            const num = parseInt(btn.dataset.number, 10);
            const isFactor = correctFactors.includes(num);
            const isSelected = btn.classList.contains('selected');
            if (isSelected && isFactor) btn.classList.add('correct');
            else if (isSelected && !isFactor) btn.classList.add('incorrect');
            else if (!isSelected && isFactor) btn.classList.add('missed');
        });
        checkBtn.style.display = 'none';
        newBtn.style.display = 'inline-block';
        numberGridEl.style.pointerEvents = 'none';
    });
    newBtn.addEventListener('click', generateNewGame);
    generateNewGame();
}

// --- Prime Sorter Game ---
function initializePrimeSorterGame() {
    const gameContainer = document.querySelector('.prime-sorter-game');
    if (!gameContainer) return;

    const startScreen = document.getElementById('sorter-start-screen');
    const gameOverScreen = document.getElementById('sorter-game-over-screen');
    const gameArea = document.getElementById('sorter-game-area');
    const startBtn = document.getElementById('sorter-start-btn');
    const restartBtn = document.getElementById('sorter-restart-btn');
    const scoreEl = document.getElementById('sorter-score');
    const livesEl = document.getElementById('sorter-lives');
    const finalScoreEl = document.getElementById('sorter-final-score');
    const numberDisplay = document.getElementById('sorter-number-display');
    const primeBin = document.getElementById('prime-bin');
    const compositeBin = document.getElementById('composite-bin');

    let score = 0, lives = 3, isCurrentPrime = false;

    function isPrime(num) {
        if (num <= 1) return false;
        if (num <= 3) return true;
        if (num % 2 === 0 || num % 3 === 0) return false;
        for (let i = 5; i * i <= num; i = i + 6) {
            if (num % i === 0 || num % (i + 2) === 0) return false;
        }
        return true;
    }

    function updateHUD() {
        scoreEl.textContent = score;
        livesEl.textContent = '❤️'.repeat(lives);
    }

    function nextNumber() {
        const currentNumber = Math.floor(Math.random() * 99) + 2; // Numbers from 2 to 100
        isCurrentPrime = isPrime(currentNumber);

        numberDisplay.textContent = currentNumber;
        numberDisplay.classList.remove('entering'); // Remove class to allow re-triggering animation
        void numberDisplay.offsetWidth; // Force a browser reflow
        numberDisplay.classList.add('entering'); // Add class to trigger animation

        primeBin.disabled = false;
        compositeBin.disabled = false;
    }

    function handleChoice(e) {
        primeBin.disabled = true;
        compositeBin.disabled = true;

        const choiceIsPrime = e.currentTarget.dataset.type === 'prime';
        const clickedBin = e.currentTarget;

        if (choiceIsPrime === isCurrentPrime) {
            score++;
            clickedBin.classList.add('correct-flash');
        } else {
            lives--;
            clickedBin.classList.add('incorrect-flash');
        }

        // Remove the flash class after the animation is done
        setTimeout(() => {
            clickedBin.classList.remove('correct-flash', 'incorrect-flash');
        }, 500);

        updateHUD();

        if (lives <= 0) {
            setTimeout(endGame, 700);
        } else {
            setTimeout(nextNumber, 700);
        }
    }

    function startGame() {
        score = 0;
        lives = 3;
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        gameArea.classList.remove('hidden');
        updateHUD();
        nextNumber();
    }

    function endGame() {
        gameArea.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
        finalScoreEl.textContent = score;
    }

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    primeBin.addEventListener('click', handleChoice);
    compositeBin.addEventListener('click', handleChoice);
}

// --- Opposites Stepper Interactive ---
function initializeOppositesStepper() {
    const stepperContainer = document.querySelector('.stepper-interactive');
    if (!stepperContainer) return;

    const stepBackBtn = document.getElementById('step-back-btn');
    const stepForwardBtn = document.getElementById('step-forward-btn');
    const stepperResetBtn = document.getElementById('stepper-reset-btn');
    const character = document.getElementById('stepper-character');
    const positionDisplay = document.getElementById('stepper-position-display');
    // IMPROVEMENT: Get the new feedback element
    const feedbackText = document.getElementById('stepper-feedback-text');

    let currentPosition = 0;
    const MAX_STEPS = 5;

    function updateStepperVisuals() {
        const displayValue = currentPosition > 0 ? `+${currentPosition}` : currentPosition;
        positionDisplay.textContent = `Position: ${displayValue}`;
        const percentage = (currentPosition + MAX_STEPS) * (100 / (MAX_STEPS * 2));
        character.style.left = `${percentage}%`;
        stepForwardBtn.disabled = currentPosition >= MAX_STEPS;
        stepBackBtn.disabled = currentPosition <= -MAX_STEPS;
    }

    // IMPROVEMENT: Function to show floating text feedback
    function showFeedback(text, type) {
        feedbackText.textContent = text;
        feedbackText.className = ''; // Clear previous classes
        void feedbackText.offsetWidth; // Trigger a reflow to restart animation
        feedbackText.classList.add(type, 'show');
    }

    stepForwardBtn.addEventListener('click', () => {
        if (currentPosition < MAX_STEPS) {
            currentPosition++;
            updateStepperVisuals();
            showFeedback('+1', 'correct'); // Trigger feedback
        }
    });

    stepBackBtn.addEventListener('click', () => {
        if (currentPosition > -MAX_STEPS) {
            currentPosition--;
            updateStepperVisuals();
            showFeedback('-1', 'incorrect'); // Trigger feedback
        }
    });

    stepperResetBtn.addEventListener('click', () => {
        currentPosition = 0;
        updateStepperVisuals();
    });

    updateStepperVisuals();
}

// --- Number Line Game ---
function initializeNumberLineGame() {
    const gameContainer = document.querySelector('.number-line-game');
    if (!gameContainer) return;

    const numberLineContainer = document.getElementById('number-line-container');
    const targetNumberDisplay = document.getElementById('target-number-display');
    const feedbackDisplay = document.getElementById('number-line-feedback');

    const MIN_NUM = -5;
    const MAX_NUM = 5;
    let targetNumber;

    function generateNumberLine() {
        numberLineContainer.innerHTML = '';
        for (let i = MIN_NUM; i <= MAX_NUM; i++) {
            const marker = document.createElement('div');
            marker.className = 'number-marker';
            if (i === 0) marker.classList.add('zero');
            marker.dataset.value = i;
            const numberSpan = document.createElement('span');
            numberSpan.textContent = i;
            marker.appendChild(numberSpan);
            marker.addEventListener('click', () => handleAnswer(marker, i));
            numberLineContainer.appendChild(marker);
        }
    }

    function generateNewChallenge() {
        // Clear old feedback styles
        const oldCorrect = numberLineContainer.querySelector('.correct-answer');
        if (oldCorrect) oldCorrect.classList.remove('correct-answer');
        feedbackDisplay.textContent = '';
        feedbackDisplay.className = 'quiz-feedback';

        targetNumber = Math.floor(Math.random() * (MAX_NUM - MIN_NUM + 1)) + MIN_NUM;
        targetNumberDisplay.textContent = targetNumber;
        // Re-enable clicks on all markers
        document.querySelectorAll('.number-marker').forEach(m => m.style.pointerEvents = 'auto');
    }

    function handleAnswer(clickedMarker, selectedValue) {
        // Disable all markers to prevent multiple clicks
        document.querySelectorAll('.number-marker').forEach(m => m.style.pointerEvents = 'none');

        if (selectedValue === targetNumber) {
            feedbackDisplay.textContent = 'Correct! Great job!';
            feedbackDisplay.className = 'quiz-feedback correct';

            // IMPROVEMENT: Flash the whole line green
            numberLineContainer.classList.add('success-flash');
            setTimeout(() => numberLineContainer.classList.remove('success-flash'), 500);

            setTimeout(generateNewChallenge, 1500);
        } else {
            feedbackDisplay.textContent = `Not quite. That was ${selectedValue}. The correct answer is pulsing.`;
            feedbackDisplay.className = 'quiz-feedback incorrect';

            // IMPROVEMENT: Shake the incorrect marker and pulse the correct one
            clickedMarker.classList.add('shake');
            const correctMarker = numberLineContainer.querySelector(`.number-marker[data-value="${targetNumber}"]`);
            if (correctMarker) {
                correctMarker.classList.add('correct-answer');
            }

            setTimeout(() => {
                clickedMarker.classList.remove('shake');
                // Re-enable clicks after incorrect feedback animation
                document.querySelectorAll('.number-marker').forEach(m => m.style.pointerEvents = 'auto');
            }, 800);
        }
    }

    generateNumberLine();
    generateNewChallenge();
}

// --- Universal Helper: Draws Fraction Bars ---
function drawFractionBars(container, num, den) {
    container.innerHTML = ''; if (den <= 0 || isNaN(den) || isNaN(num)) return;
    const wholeParts = Math.floor(num / den); const remainderNum = num % den;
    if (num === 0) {
        const bar = document.createElement('div'); bar.className = 'bar-whole';
        for (let j = 0; j < den; j++) {
            const segment = document.createElement('div'); segment.className = 'bar-segment unshaded';
            segment.style.width = `${100 / den}%`; bar.appendChild(segment);
        } container.appendChild(bar); return;
    }
    for (let i = 0; i < wholeParts; i++) {
        const bar = document.createElement('div'); bar.className = 'bar-whole';
        for (let j = 0; j < den; j++) {
            const segment = document.createElement('div'); segment.className = 'bar-segment shaded';
            segment.style.width = `${100 / den}%`; bar.appendChild(segment);
        } container.appendChild(bar);
    }
    if (remainderNum > 0) {
        const bar = document.createElement('div'); bar.className = 'bar-whole';
        for (let j = 0; j < den; j++) {
            const segment = document.createElement('div');
            segment.className = j < remainderNum ? 'bar-segment shaded' : 'bar-segment unshaded';
            segment.style.width = `${100 / den}%`; bar.appendChild(segment);
        } container.appendChild(bar);
    }
}

// --- Game 1: Fraction Pizza Shop ---
function initializePizzaShop() {
    const gameContainer = document.querySelector('.pizza-shop-game'); if (!gameContainer) return;
    const orderTextEl = document.getElementById('pizza-order-text');
    const pizzaContainer = document.getElementById('pizza-visual-container');
    const feedbackEl = document.getElementById('pizza-feedback');
    const submitBtn = document.getElementById('submit-pizza-btn');
    const newOrderBtn = document.getElementById('new-pizza-order-btn');
    let requiredSlices = 0;
    function getSlicePathD(cx, cy, r, sa, ea) {
        const start = { x: cx + r * Math.cos(sa * Math.PI / 180), y: cy + r * Math.sin(sa * Math.PI / 180) };
        const end = { x: cx + r * Math.cos(ea * Math.PI / 180), y: cy + r * Math.sin(ea * Math.PI / 180) };
        return `M ${cx},${cy} L ${start.x},${start.y} A ${r},${r} 0 ${ea - sa <= 180 ? "0" : "1"} 1 ${end.x},${end.y} Z`;
    }
    function drawPizza(denominator) {
        pizzaContainer.innerHTML = ''; const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 200 200");
        const sliceAngle = 360 / denominator;
        for (let i = 0; i < denominator; i++) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", getSlicePathD(100, 100, 100, i * sliceAngle, (i + 1) * sliceAngle));
            path.classList.add('pizza-slice');
            path.addEventListener('click', () => path.classList.toggle('selected'));
            svg.appendChild(path);
        } pizzaContainer.appendChild(svg);
    }
    function generateNewOrder() {
        feedbackEl.className = 'quiz-feedback'; feedbackEl.textContent = ''; submitBtn.disabled = false;
        const simpleDenominators = [2, 3, 4];
        const baseDen = simpleDenominators[Math.floor(Math.random() * simpleDenominators.length)];
        const baseNum = Math.ceil(Math.random() * (baseDen - 1));
        const multiplier = Math.ceil(Math.random() * 2) + 1;
        const finalDen = baseDen * multiplier;
        requiredSlices = baseNum * multiplier;
        orderTextEl.innerHTML = `I'd like <strong>${baseNum}/${baseDen}</strong> of a pizza, cut into <strong>${finalDen}ths</strong>, please!`;
        drawPizza(finalDen);
    }
    submitBtn.addEventListener('click', () => {
        const selectedSlices = pizzaContainer.querySelectorAll('.pizza-slice.selected').length;
        const totalSlices = pizzaContainer.querySelectorAll('.pizza-slice').length;
        if (selectedSlices === requiredSlices) {
            feedbackEl.textContent = `Perfect! You shaded ${selectedSlices}/${totalSlices}, which is the same as the order!`;
            feedbackEl.className = 'quiz-feedback correct';
        } else {
            feedbackEl.textContent = `Not quite. You shaded ${selectedSlices} slices, but ${requiredSlices} were needed. Try again!`;
            feedbackEl.className = 'quiz-feedback incorrect';
        }
        submitBtn.disabled = true;
    });
    newOrderBtn.addEventListener('click', generateNewOrder);
    generateNewOrder();
}

// --- Game 2: Fraction Simplifier ---
function initializeFractionSimplifier() {
    const gameContainer = document.querySelector('.fraction-simplifier-game');
    if (!gameContainer) return;
    const numEl = document.getElementById('simp-numerator');
    const denEl = document.getElementById('simp-denominator');
    const fractionDisplay = document.getElementById('simplifier-fraction-display');
    const divisorButtonsContainer = document.getElementById('divisor-buttons');
    const feedbackEl = document.getElementById('simplifier-feedback');
    let currentNum, currentDen, gcf;
    function findGCF(a, b) { return b === 0 ? a : findGCF(b, a % b); }
    function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function generateProblem() {
        feedbackEl.className = 'quiz-feedback'; feedbackEl.textContent = '';
        fractionDisplay.classList.remove('simplified');
        const multiplier = getRandomInt(2, 5);
        let simpleNum, simpleDen;
        do {
            simpleNum = getRandomInt(1, 5); simpleDen = getRandomInt(simpleNum + 1, 7);
        } while (findGCF(simpleNum, simpleDen) !== 1);
        currentNum = simpleNum * multiplier; currentDen = simpleDen * multiplier;
        gcf = multiplier;
        numEl.textContent = currentNum; denEl.textContent = currentDen;
        generateButtons();
    }
    function generateButtons() {
        divisorButtonsContainer.innerHTML = '';
        const options = new Set([gcf]);
        while (options.size < 4) { options.add(getRandomInt(2, 9)); }
        Array.from(options).sort(() => Math.random() - 0.5).forEach(val => {
            const btn = document.createElement('button');
            btn.className = 'divisor-btn'; btn.textContent = `÷ ${val}`;
            btn.onclick = () => handleChoice(val, btn);
            divisorButtonsContainer.appendChild(btn);
        });
    }
    function handleChoice(divisor, btn) {
        if (divisor === gcf) {
            feedbackEl.textContent = 'Correct! That\'s the simplest form!'; feedbackEl.className = 'quiz-feedback correct';
            numEl.textContent = currentNum / gcf; denEl.textContent = currentDen / gcf;
            fractionDisplay.classList.add('simplified');
            divisorButtonsContainer.innerHTML = '';
            setTimeout(generateProblem, 2000);
        } else {
            feedbackEl.textContent = 'Not the largest common factor. Try another number.';
            feedbackEl.className = 'quiz-feedback incorrect';
            btn.disabled = true;
        }
    }
    generateProblem();
}

// --- Game 3: Fraction Number Line Challenge ---
function initializeNumberLineChallenge() {
    const gameContainer = document.querySelector('.number-line-challenge');
    if (!gameContainer) return;
    const challengeFractionEl = document.getElementById('nlc-challenge-fraction');
    const lineContainer = document.getElementById('nlc-line-container');
    const optionsContainer = document.getElementById('nlc-options');
    const feedbackEl = document.getElementById('nlc-feedback');
    let correctLetter = '';

    function generateProblem() {
        feedbackEl.className = 'quiz-feedback'; feedbackEl.textContent = '';
        lineContainer.innerHTML = ''; optionsContainer.innerHTML = '';
        ['0', '1/2', '1'].forEach((label, i) => {
            const tick = document.createElement('div'); tick.className = 'nlc-tick';
            const tickLabel = document.createElement('div'); tickLabel.className = 'nlc-tick-label';
            tick.style.left = `${i * 50}%`; tickLabel.style.left = `${i * 50}%`;
            tickLabel.textContent = label; lineContainer.appendChild(tick); lineContainer.appendChild(tickLabel);
        });
        const denominators = [3, 4, 5, 6, 8, 10];
        const den = denominators[Math.floor(Math.random() * denominators.length)];
        const num = Math.ceil(Math.random() * (den - 1));
        const targetValue = num / den;
        challengeFractionEl.textContent = `${num}/${den}`;
        const options = [{ value: targetValue, letter: '' }];
        while (options.length < 3) {
            const d = denominators[Math.floor(Math.random() * denominators.length)];
            const n = Math.ceil(Math.random() * (d - 1));
            const v = n / d;
            if (options.every(opt => Math.abs(opt.value - v) > 0.05)) { options.push({ value: v, letter: '' }); }
        }
        options.sort(() => Math.random() - 0.5);
        options.forEach((opt, i) => {
            const letter = String.fromCharCode(65 + i); opt.letter = letter;
            if (opt.value === targetValue) correctLetter = letter;
            const marker = document.createElement('div'); marker.className = 'nlc-marker';
            marker.textContent = letter; marker.style.left = `${opt.value * 100}%`;
            lineContainer.appendChild(marker);
            const btn = document.createElement('button'); btn.className = 'nav-btn nlc-option-btn';
            btn.textContent = letter;
            btn.onclick = () => handleChoice(letter, btn);
            optionsContainer.appendChild(btn);
        });
    }

    function handleChoice(chosenLetter, btn) {
        optionsContainer.querySelectorAll('button').forEach(b => b.disabled = true);
        if (chosenLetter === correctLetter) {
            feedbackEl.textContent = "Correct! Exactly right!"; feedbackEl.className = 'quiz-feedback correct';
        } else {
            feedbackEl.textContent = `Not quite. The correct answer was ${correctLetter}.`;
            feedbackEl.className = 'quiz-feedback incorrect';
            const correctBtnIndex = correctLetter.charCodeAt(0) - 65;
            optionsContainer.querySelectorAll('button')[correctBtnIndex].classList.add('correct-answer-highlight');
        }
        setTimeout(generateProblem, 2500);
    }
    generateProblem();
}

// --- NEW Game 4: Fraction Showdown ---
function initializeFractionShowdown() {
    const gameContainer = document.querySelector('.fraction-showdown-game');
    if (!gameContainer) return;

    const visualLeft = document.getElementById('showdown-visual-left');
    const textLeft = document.getElementById('showdown-text-left');
    const optionLeft = document.getElementById('showdown-left');
    
    const visualRight = document.getElementById('showdown-visual-right');
    const textRight = document.getElementById('showdown-text-right');
    const optionRight = document.getElementById('showdown-right');

    const feedbackEl = document.getElementById('showdown-feedback');
    let fractionLeft, fractionRight;

    function generateProblem() {
        feedbackEl.className = 'quiz-feedback'; feedbackEl.textContent = '';
        optionLeft.style.pointerEvents = 'auto'; optionRight.style.pointerEvents = 'auto';
        optionLeft.classList.remove('correct-choice', 'incorrect-choice', 'correct-answer-highlight');
        optionRight.classList.remove('correct-choice', 'incorrect-choice', 'correct-answer-highlight');

        let num1, den1, num2, den2;
        do {
            num1 = Math.ceil(Math.random() * 8); den1 = Math.ceil(Math.random() * 8) + 1;
            num2 = Math.ceil(Math.random() * 8); den2 = Math.ceil(Math.random() * 8) + 1;
        } while (Math.abs((num1 / den1) - (num2 / den2)) < 0.001);

        fractionLeft = { num: num1, den: den1 };
        fractionRight = { num: num2, den: den2 };

        drawFractionBars(visualLeft, num1, den1); textLeft.textContent = `${num1}/${den1}`;
        drawFractionBars(visualRight, num2, den2); textRight.textContent = `${num2}/${den2}`;
    }

    function handleChoice(chosenSide) {
        optionLeft.style.pointerEvents = 'none'; optionRight.style.pointerEvents = 'none';
        const valLeft = fractionLeft.num / fractionLeft.den;
        const valRight = fractionRight.num / fractionRight.den;
        const leftIsGreater = valLeft > valRight;
        
        const correctOption = leftIsGreater ? optionLeft : optionRight;
        const chosenOption = chosenSide === 'left' ? optionLeft : optionRight;

        const wasCorrect = (chosenSide === 'left' && leftIsGreater) || (chosenSide === 'right' && !leftIsGreater);
        
        if (wasCorrect) {
            feedbackEl.textContent = "Correct!"; feedbackEl.className = 'quiz-feedback correct';
            chosenOption.classList.add('correct-choice');
        } else {
            feedbackEl.textContent = "Not quite, the other fraction was bigger.";
            feedbackEl.className = 'quiz-feedback incorrect';
            chosenOption.classList.add('incorrect-choice');
            correctOption.classList.add('correct-answer-highlight');
        }
        setTimeout(generateProblem, 2000);
    }
    
    optionLeft.addEventListener('click', () => handleChoice('left'));
    optionRight.addEventListener('click', () => handleChoice('right'));
    generateProblem();
}
// --- Run all initialization functions ---
initializeLessonNavigation(document.getElementById('fundamentals'));
initializeNaturalNumberQuiz();
initializeWholeNumberInteractive();
initializeFactorFinderGame();
initializePrimeSorterGame();
initializeOppositesStepper();
initializeNumberLineGame();

initializePizzaShop();
initializeFractionSimplifier();
initializeNumberLineChallenge();
initializeFractionShowdown();