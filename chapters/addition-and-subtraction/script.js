// --- Navigation logic specifically for the Mental Addition lesson ---
const additionLesson = document.getElementById('addition-and-subtraction');
if (additionLesson) {
    const additionPages = additionLesson.querySelectorAll('.page');
    const tocLinks = additionLesson.querySelectorAll('.table-of-contents a');
    const startBtn = additionLesson.querySelector('.start-now-btn');

    function setupAdditionLessonNav(pageIndex) {
        additionPages.forEach((page, i) => page.classList.toggle('hidden', i !== pageIndex));

        if (pageIndex >= 0) { // Apply to all pages with controls
            const currentPage = additionPages[pageIndex];
            const prevBtn = currentPage.querySelector('.prev-page');
            const nextBtn = currentPage.querySelector('.next-page');

            // Handle Prev button
            if (prevBtn) {
                if (pageIndex === 1) { // First content page
                    prevBtn.textContent = "< Back to Contents";
                    prevBtn.onclick = () => setupAdditionLessonNav(0);
                } else {
                    prevBtn.textContent = "< Previous";
                    prevBtn.onclick = () => setupAdditionLessonNav(pageIndex - 1);
                }
            }

            // Handle Next button
            if (nextBtn) {
                // This logic is tricky without access to the main scope's `switchLesson`
                // For now, we disable the 'Next Project' buttons. A more advanced solution
                // would use custom events to communicate back to the main script.
                if (pageIndex === additionPages.length - 1) { // Last page
                    nextBtn.textContent = "Next Project >";
                    nextBtn.disabled = true; // Simple solution
                } else {
                    nextBtn.textContent = "Next >";
                    nextBtn.onclick = () => setupAdditionLessonNav(pageIndex + 1);
                }
            }
        }
    }

    // Event Listeners
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                const pageIndex = parseInt(targetPage.dataset.pageIndex, 10);
                setupAdditionLessonNav(pageIndex);
            }
        });
    });

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            setupAdditionLessonNav(1); // Go to the first content page
        });
    }

    // Initial state: show the TOC page
    setupAdditionLessonNav(0);
}


// --- Interactive Equation Builder Logic ---
function initializeEquationBuilder() {
    // Logic is scoped to the current chapter to avoid errors
    const workbench = document.getElementById('equation-workbench');
    const tileSource = document.getElementById('tile-source');
    if (!workbench || !tileSource) return;

    const tiles = tileSource.querySelectorAll('.tile');
    let slots = workbench.querySelectorAll('.equation-slot');

    function addDragListenersToTiles() {
        tiles.forEach(tile => {
            tile.addEventListener('dragstart', e => {
                tile.classList.add('dragging');
                e.dataTransfer.setData('text/plain', tile.id);
            });
            tile.addEventListener('dragend', () => tile.classList.remove('dragging'));
        });
    }

    function addDropListenersToSlots() {
        slots.forEach(slot => {
            slot.addEventListener('dragover', e => {
                const draggingTile = document.querySelector('.dragging');
                if (draggingTile && slot.dataset.slotType === draggingTile.dataset.tileType && !slot.hasChildNodes()) {
                    e.preventDefault();
                    slot.classList.add('drag-over');
                }
            });
            slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
            slot.addEventListener('drop', e => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                const tileId = e.dataTransfer.getData('text/plain');
                const droppedTile = document.getElementById(tileId);
                if (droppedTile && !slot.hasChildNodes()) {
                    slot.appendChild(droppedTile);
                    droppedTile.classList.add('placed');
                    checkAndSolve();
                }
            });
        });
    }

    function checkAndSolve() {
        if (slots[0].hasChildNodes() && slots[1].hasChildNodes() && slots[2].hasChildNodes()) {
            const num1 = parseInt(slots[0].firstChild.dataset.value, 10);
            const operator = slots[1].firstChild.dataset.value;
            const num2 = parseInt(slots[2].firstChild.dataset.value, 10);
            let result;

            if (operator === '+') result = num1 + num2;
            if (operator === '-') result = num1 - num2;

            setTimeout(() => {
                const equals = document.createElement('div');
                equals.className = 'equation-slot';
                equals.textContent = '=';

                const resultSlot = document.createElement('div');
                resultSlot.className = 'equation-slot result-slot';
                resultSlot.textContent = result;

                const resetButton = document.createElement('button');
                resetButton.id = 'reset-builder-btn';
                resetButton.textContent = 'Reset';

                workbench.append(equals, resultSlot, resetButton);
            }, 500);
        }
    }

    workbench.addEventListener('click', e => {
        if (e.target.id === 'reset-builder-btn') {
            workbench.innerHTML = `
                <div class="equation-slot" data-slot-type="number"></div>
                <div class="equation-slot" data-slot-type="operator"></div>
                <div class="equation-slot" data-slot-type="number"></div>`;

            tiles.forEach(tile => {
                tile.classList.remove('placed');
                tileSource.appendChild(tile);
            });

            slots = workbench.querySelectorAll('.equation-slot');
            addDropListenersToSlots();
        }
    });

    addDragListenersToTiles();
    addDropListenersToSlots();
}
initializeEquationBuilder();


// --- Interactive Revision Quiz Logic ---
const revisionPage = document.getElementById('section-revision');
if (revisionPage) {
    
    // This function sets up the entire quiz from scratch
    function setupQuiz() {
        let score = 0;
        const totalQuestions = 7;
        const answeredQuestions = {}; // Tracks which questions are answered

        const resultsDiv = revisionPage.querySelector('#revision-results');
        const scoreDisplay = revisionPage.querySelector('#score-display');
        const badgeContainer = revisionPage.querySelector('#badge-container');
        const seeScoreBtn = revisionPage.querySelector('#see-score-btn');
        const allButtons = revisionPage.querySelectorAll('.check-btn, .tf-btn');
        const allInputs = revisionPage.querySelectorAll('.answer-input, .vocab-checklist input');
        
        // --- Event Listener for all interactions inside the quiz ---
        revisionPage.addEventListener('click', handleQuizClick);

        function handleQuizClick(e) {
            let isCorrect = false;
            let correctFeedback = 'Correct!';
            let incorrectFeedback = 'Incorrect. Please try again.';
            let questionDiv = null;
            let questionId = null;

            // --- Logic for different question types ---

            // Check if a CHECK button was clicked (for vocab and calculation)
            if (e.target.matches('.check-btn')) {
                questionDiv = e.target.closest('.revision-question');
                questionId = questionDiv.dataset.questionId;
                if (answeredQuestions[questionId]) return; // Prevent re-answering
                
                if (questionId === 'q1') {
                    const correct = ['sum', 'plus'];
                    const selected = Array.from(questionDiv.querySelectorAll('input:checked')).map(cb => cb.value);
                    isCorrect = correct.length === selected.length && correct.every(val => selected.includes(val));
                    if (!isCorrect) incorrectFeedback = 'Incorrect. Addition words are "Sum" and "Plus".';
                }
                if (questionId === 'q4') {
                    const correct = ['take away', 'difference'];
                    const selected = Array.from(questionDiv.querySelectorAll('input:checked')).map(cb => cb.value);
                    isCorrect = correct.length === selected.length && correct.every(val => selected.includes(val));
                    if (!isCorrect) incorrectFeedback = 'Incorrect. Try "Take Away" and "Difference".';
                }
                if (questionId === 'q8') { isCorrect = (parseInt(questionDiv.querySelector('input').value, 10) === 21); }
                if (questionId === 'q10') { isCorrect = (parseInt(questionDiv.querySelector('input').value, 10) === 90); }

                e.target.disabled = true; // Disable check button after use

            // Check if a TRUE/FALSE button was clicked
            } else if (e.target.matches('.tf-btn')) {
                questionDiv = e.target.closest('.revision-question');
                questionId = questionDiv.dataset.questionId;
                if (answeredQuestions[questionId]) return;

                const allTfBtns = questionDiv.querySelectorAll('.tf-btn');
                allTfBtns.forEach(b => { b.classList.remove('selected'); b.disabled = true; });
                e.target.classList.add('selected');

                if (questionId === 'q2') { isCorrect = (e.target.dataset.answer === 'true'); incorrectFeedback = 'Incorrect. 50-21+5 = 34, which is less than 35.'; }
                if (questionId === 'q6') { isCorrect = (e.target.dataset.answer === 'true'); incorrectFeedback = 'Incorrect. 11+19 = 30, which is equal to 30.'; }
                if (questionId === 'q9') { isCorrect = (e.target.dataset.answer === 'false'); incorrectFeedback = 'Incorrect. 101-11 = 90. 90 is not less than 90.'; }

            // Check for the SCORE and RESET buttons
            } else if (e.target.matches('#see-score-btn')) {
                showFinalScore();
                return;
            } else if (e.target.matches('#reset-revision-btn')) {
                resetQuiz();
                return;
            } else {
                return; // If anything else was clicked (like text), do nothing
            }

            // --- Update score and provide feedback for the answered question ---
            const feedbackEl = questionDiv.querySelector('.feedback-text');
            if (isCorrect) {
                feedbackEl.textContent = correctFeedback;
                feedbackEl.className = 'feedback-text feedback-correct';
                score++;
            } else {
                feedbackEl.textContent = incorrectFeedback;
                feedbackEl.className = 'feedback-text feedback-incorrect';
            }
            answeredQuestions[questionId] = true;
        }

        function showFinalScore() {
            const percentage = (score / totalQuestions) * 100;
            scoreDisplay.textContent = `${score} / ${totalQuestions}`;
            badgeContainer.innerHTML = ''; // Clear previous badges

            if (percentage >= 99) { // 7/7
                badgeContainer.innerHTML = `<div class="badge platinum"><div class="badge-icon">✪</div><div class="badge-text">PERFECT</div></div>`;
            } else if (percentage >= 80) { // 6/7
                badgeContainer.innerHTML = `<div class="badge gold"><div class="badge-icon">★</div><div class="badge-text">EXCELLENT</div></div>`;
            }

            resultsDiv.classList.remove('hidden');
            seeScoreBtn.disabled = true;
        }

        function resetQuiz() {
            // Remove the main listener to avoid conflicts while resetting
            revisionPage.removeEventListener('click', handleQuizClick);

            allButtons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('selected');
            });
            allInputs.forEach(input => {
                input.disabled = false;
                if (input.type === 'checkbox') input.checked = false;
                if (input.type === 'number') input.value = '';
            });
            
            revisionPage.querySelectorAll('.feedback-text').forEach(fb => fb.textContent = '');
            resultsDiv.classList.add('hidden');
            badgeContainer.innerHTML = '';
            seeScoreBtn.disabled = false;
            
            // Re-run the main setup function to reset state and re-attach the listener
            setupQuiz();
        }
    }
    
    // Initial call to set up the quiz
    setupQuiz();
}