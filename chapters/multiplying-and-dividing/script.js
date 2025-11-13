// chapters/multiplying-and-dividing/script.js

// --- Navigation logic specifically for the Multiplying and Dividing lesson ---
const chapterContainer = document.getElementById('lesson-multiplying-and-dividing');

if (chapterContainer) {
    const pages = chapterContainer.querySelectorAll('.page');
    const tocLinks = chapterContainer.querySelectorAll('.table-of-contents a');
    const startBtn = chapterContainer.querySelector('.start-now-btn');

    // --- STATE FLAG ---
    // This flag ensures our builder only gets initialized ONCE.
    let isBuilderInitialized = false;

    function setupPageNavigation(pageIndex) {
        pages.forEach((page, i) => page.classList.toggle('hidden', i !== pageIndex));

        // --- THE FIX IS HERE ---
        // We check if the user has navigated to the builder's page (index 2).
        // If they have, AND we haven't initialized it yet, we run the setup function.
        if (pageIndex === 2 && !isBuilderInitialized) {
            initializeMDEquationBuilder();
            isBuilderInitialized = true; // Set the flag so we don't run it again.
        }

        const currentPage = pages[pageIndex];
        if (currentPage) {
            const prevBtn = currentPage.querySelector('.prev-page');
            const nextBtn = currentPage.querySelector('.next-page');

            if (prevBtn) {
                 if (pageIndex === 1) {
                    prevBtn.textContent = "< Back to Contents";
                    prevBtn.onclick = () => setupPageNavigation(0);
                } else {
                    prevBtn.textContent = "< Previous";
                    prevBtn.onclick = () => setupPageNavigation(pageIndex - 1);
                }
            }
           
            if (nextBtn) {
                if (pageIndex === pages.length - 1) {
                    nextBtn.textContent = "Next Project >";
                    nextBtn.disabled = true;
                } else {
                    nextBtn.textContent = "Next >";
                    nextBtn.onclick = () => setupPageNavigation(pageIndex + 1);
                }
            }
        }
    }

    // Event Listeners for TOC and Start Button
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                const pageIndex = parseInt(targetPage.dataset.pageIndex, 10);
                setupPageNavigation(pageIndex);
            }
        });
    });

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            setupPageNavigation(1);
        });
    }

    // Initial state: show the TOC page
    setupPageNavigation(0);
}


// --- Multiplication/Division Equation Builder Logic ---
// This function now only runs when called by the navigation logic above.
function initializeMDEquationBuilder() {
    const workbench = document.getElementById('md-equation-workbench');
    const tileSource = document.getElementById('md-tile-source');
    // The 'if' check is still good practice as a fallback.
    if (!workbench || !tileSource) return;

    console.log("Builder Initialized!"); // You can use this to see it only runs once.

    const tiles = tileSource.querySelectorAll('.tile');
    let slots = workbench.querySelectorAll('.equation-slot');

    function addDragListenersToTiles() { /* ... same as before ... */ }
    function addDropListenersToSlots() { /* ... same as before ... */ }
    function checkAndSolve() { /* ... same as before ... */ }

    // (Copy the full functions from your previous version here)
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

            if (operator === '×') result = num1 * num2;
            if (operator === '÷') {
                if (num2 === 0) {
                    result = 'Error';
                } else {
                    result = num1 / num2;
                }
            }
            
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

// --- REMOVED ---
// We NO LONGER call the function automatically down here.
// initializeMDEquationBuilder();