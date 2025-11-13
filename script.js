document.addEventListener('DOMContentLoaded', () => {
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    const lessonDisplay = document.querySelector('.lesson-display');
    const chapterStyleLink = document.getElementById('chapter-style');
    const gameModalOverlay = document.getElementById('game-modal-overlay');
    let currentChapterScript = null;

    // --- Chapter Loading Logic ---
    async function loadChapter(chapterId) {
        try {
            // 1. Fetch the chapter's HTML content
            const response = await fetch(`chapters/${chapterId}/content.html`);
            if (!response.ok) throw new Error(`Chapter not found: ${chapterId}`);
            const content = await response.text();

            // 2. Inject the HTML into the display area
            lessonDisplay.innerHTML = content;

            // 3. Update the stylesheet link for the chapter
            chapterStyleLink.href = `chapters/${chapterId}/style.css`;

            // 4. Remove the old chapter's script if it exists
            if (currentChapterScript) {
                document.body.removeChild(currentChapterScript);
            }

            // 5. Create and append the new chapter's script
            currentChapterScript = document.createElement('script');
            currentChapterScript.src = `chapters/${chapterId}/script.js`;
            currentChapterScript.defer = true; // Ensures it runs after HTML is parsed
            document.body.appendChild(currentChapterScript);

            // Update active button state
            lessonButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lessonId === chapterId);
            });

        } catch (error) {
            console.error('Error loading chapter:', error);
            lessonDisplay.innerHTML = `<p style="color:red; text-align:center;">Error: Could not load chapter content.</p>`;
        }
    }

    // Sidebar button event listeners
    lessonButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const chapterId = btn.dataset.lessonId;
            loadChapter(chapterId);
        });
    });

    // --- Global Game Modal Logic ---
    // Use event delegation since the buttons are loaded dynamically
    lessonDisplay.addEventListener('click', (e) => {
        if (e.target.classList.contains('play-game-btn')) {
            openModal(e.target.dataset.strategy);
        }
    });

    function openModal(strategyKey) {
        loadGame(strategyKey);
        gameModalOverlay.classList.remove('hidden');
    }

    function closeModal() {
        gameModalOverlay.classList.add('hidden');
        gameModalOverlay.innerHTML = '';
    }

    function loadGame(strategyKey) {
        const modalHTML = `
        <div id="game-modal">
            <button id="close-modal-btn">&times;</button>
            <div id="game-content">
                <h2 id="strategy-title"></h2>
                <p class="game-p">Analyzing Schematic...</p>
                <div id="equation-workspace"></div>
                <div id="challenge-area" class="hidden">
                    <p class="game-p" style="margin-top:1rem; border-top:1px solid var(--border-color); padding-top:1rem;"><strong>Challenge:</strong> Compute the following...</p>
                    <div id="challenge-problem" style="font-size: 1.8em; font-weight: 700; margin: 10px 0; text-align:center; font-family:'Chakra Petch',sans-serif; color: var(--text-light);"></div>
                    <div id="input-area">
                        <input type="number" id="user-answer" placeholder="Output">
                        <button id="submit-btn">Execute</button>
                    </div>
                    <div id="feedback"></div>
                </div>
                <div id="game-controls">
                    <button id="back-to-lesson-btn">Abort</button>
                    <button id="next-problem-btn" class="hidden">New Data Set</button>
                </div>
            </div>
        </div>`;
        gameModalOverlay.innerHTML = modalHTML;

        const strategyTitle = document.getElementById('strategy-title');
        const equationWorkspace = document.getElementById('equation-workspace');
        const challengeArea = document.getElementById('challenge-area');
        const challengeProblemEl = document.getElementById('challenge-problem');
        const userAnswer = document.getElementById('user-answer');
        const feedback = document.getElementById('feedback');
        const submitBtn = document.getElementById('submit-btn');
        const nextProblemBtn = document.getElementById('next-problem-btn');

        document.getElementById('close-modal-btn').addEventListener('click', closeModal);
        document.getElementById('back-to-lesson-btn').addEventListener('click', closeModal);

        const strategies = {};
        Object.assign(strategies, {
            partitioning: { title: "Partitioning", guide: [171, 23], generateProblem: () => [100 + Math.floor(Math.random() * 90) + 10, Math.floor(Math.random() * 80) + 10], runGuide: function (nums) { const [n1, n2] = nums; const n1_h = Math.floor(n1 / 100) * 100; const n1_t = Math.floor((n1 % 100) / 10) * 10; const n1_o = n1 % 10; const n2_t = Math.floor(n2 / 10) * 10; const n2_o = n2 % 10; const t_sum = n1_t + n2_t; const o_sum = n1_o + n2_o; const final_sum = n1 + n2; const steps = [[{ val: n1, type: 'num' }, { val: '+', type: 'op' }, { val: n2, type: 'num' }], [{ val: n1_h, type: 'num' }, { val: '+', type: 'op' }, { val: `(${n1_t} + ${n2_t})`, type: 'group' }, { val: '+', type: 'op' }, { val: `(${n1_o} + ${n2_o})`, type: 'group' }], [{ val: n1_h, type: 'num' }, { val: '+', type: 'op' }, { val: t_sum, type: 'result' }, { val: '+', type: 'op' }, { val: o_sum, type: 'result' }], [{ val: final_sum, type: 'result' }]]; animateEquation(steps); } },
            compensating: { title: "Compensating", guide: [46, 9], generateProblem: () => [Math.floor(Math.random() * 80) + 20, Math.random() > 0.5 ? 9 : 8], runGuide: function (nums) { const [n1, n2] = nums; const compensation = 10 - n2; const final_sum = n1 + n2; const steps = [[{ val: n1, type: 'num' }, { val: '+', type: 'op' }, { val: n2, type: 'num' }], [{ val: n1, type: 'num' }, { val: '+', type: 'op' }, { val: `(10 - ${compensation})`, type: 'group' }], [{ val: `(${n1} + 10)`, type: 'group' }, { val: `- ${compensation}`, type: 'op' }], [{ val: n1 + 10, type: 'result' }, { val: `- ${compensation}`, type: 'op' }], [{ val: final_sum, type: 'result' }]]; animateEquation(steps); } },
            doubling: { title: "Doubling", guide: [75, 78], generateProblem: () => { const n1 = Math.floor(Math.random() * 50) + 25; const n2 = n1 + (Math.floor(Math.random() * 4) + 2); return [n1, n2]; }, runGuide: function (nums) { const [n1, n2] = nums; const leftover = n2 - n1; const final_sum = n1 + n2; const steps = [[{ val: n1, type: 'num' }, { val: '+', type: 'op' }, { val: n2, type: 'num' }], [{ val: `(${n1} + ${n1})`, type: 'group' }, { val: `+ ${leftover}`, type: 'op' }], [{ val: n1 * 2, type: 'result' }, { val: `+ ${leftover}`, type: 'op' }], [{ val: final_sum, type: 'result' }]]; animateEquation(steps); } }
        });

        let currentProblem = [];

        function renderStep(parts) { const stepDiv = document.createElement('div'); stepDiv.className = 'equation-step'; parts.forEach(part => { const token = document.createElement('span'); token.className = `token ${part.type}`; token.textContent = part.val; stepDiv.appendChild(token); }); equationWorkspace.appendChild(stepDiv); }
        function animateEquation(steps) { equationWorkspace.innerHTML = ''; let i = 0; function next() { if (i < steps.length) { renderStep(steps[i]); i++; setTimeout(next, 1200); } } next(); }
        function startChallenge() { challengeArea.classList.remove('hidden'); nextProblemBtn.classList.add('hidden'); feedback.textContent = ''; userAnswer.value = ''; currentProblem = strategies[strategyKey].generateProblem(); challengeProblemEl.textContent = `${currentProblem[0]} + ${currentProblem[1]}`; userAnswer.focus(); }
        function checkAnswer() { const userNum = parseInt(userAnswer.value, 10); const correctAnswer = currentProblem[0] + currentProblem[1]; if (userNum === correctAnswer) { feedback.textContent = "Calculation Correct"; feedback.className = 'success'; nextProblemBtn.classList.remove('hidden'); } else { feedback.textContent = "Calculation Error"; feedback.className = 'error'; } }

        const strategy = strategies[strategyKey];
        strategyTitle.textContent = strategy.title;
        strategy.runGuide(strategy.guide);
        const guideDuration = (strategy.guide.length + 1) * 1200 + 300;
        setTimeout(startChallenge, guideDuration);

        submitBtn.addEventListener('click', checkAnswer);
        userAnswer.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkAnswer(); });
        nextProblemBtn.addEventListener('click', () => {
            equationWorkspace.innerHTML = '';
            startChallenge();
        });
    }

    // --- Initial Load ---
    // Load the first chapter by default when the page opens
    loadChapter('fundamentals');
});