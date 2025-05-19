if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/tarot/sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(error => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
    let allCardsData = []; // Pour stocker les données chargées depuis cards_data.json

    // --- DOM Elements ---
    const questionInput = document.getElementById('question');
    const drawButton = document.getElementById('draw-button');
    const readingDiv = document.getElementById('tarot-reading');
    const loadingIndicator = document.getElementById('loading-indicator');
    const errorLoadingDiv = document.getElementById('error-loading');

    const cardElements = {
        force: {
            image: document.getElementById('image-force'),
            nameCosmic: document.getElementById('nameCosmic-force'),
            numberRoman: document.getElementById('numberRoman-force'),
            nameMarseille: document.getElementById('nameMarseille-force'),
            description: document.getElementById('description-force'),
            infoContainer: document.getElementById('description-force').parentElement // Pour le scroll
        },
        main: {
            image: document.getElementById('image-main'),
            nameCosmic: document.getElementById('nameCosmic-main'),
            numberRoman: document.getElementById('numberRoman-main'),
            nameMarseille: document.getElementById('nameMarseille-main'),
            description: document.getElementById('description-main'),
            infoContainer: document.getElementById('description-main').parentElement
        },
        faille: {
            image: document.getElementById('image-faille'),
            nameCosmic: document.getElementById('nameCosmic-faille'),
            numberRoman: document.getElementById('numberRoman-faille'),
            nameMarseille: document.getElementById('nameMarseille-faille'),
            description: document.getElementById('description-faille'),
            infoContainer: document.getElementById('description-faille').parentElement
        }
    };

    // --- Function to load card data ---
    async function loadCardData() {
        try {
            const response = await fetch('cards_data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allCardsData = await response.json();
            // Enable interactions once data is loaded
            drawButton.disabled = false;
            questionInput.disabled = false;
            errorLoadingDiv.classList.add('hidden');
        } catch (error) {
            console.error("Erreur lors du chargement de cards_data.json:", error);
            errorLoadingDiv.classList.remove('hidden');
            // Disable interactions if data fails to load
            drawButton.disabled = true;
            questionInput.disabled = true;
        }
    }

    // --- Core Logic (Hashing, PRNG, Shuffle - unchanged from V2) ---
    function getFormattedDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function mulberry32(seed) {
        return function() {
          var t = seed += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    function shuffleArray(array, prng) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(prng() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    async function getHash(inputString) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(inputString);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        } catch (error) {
            console.error("Erreur de hachage (fallback utilisé):", error);
            let hash = 0;
             for (let i = 0; i < inputString.length; i++) {
                const char = inputString.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0; // Convert to 32bit integer
            }
             return 'fallback' + Math.abs(hash).toString(16).padStart(8,'0');
        }
    }

    // --- Draw Function ---
    async function performDraw() {
        if (allCardsData.length === 0) {
            alert("Les données des cartes ne sont pas encore chargées. Veuillez patienter ou vérifier la console pour les erreurs.");
            return;
        }

        const question = questionInput.value.trim().toLowerCase();
        const date = getFormattedDate();

        if (!question) {
            alert("Veuillez entrer une question pour initier l'analyse cosmique.");
            return;
        }

        loadingIndicator.classList.remove('hidden');
        readingDiv.classList.add('hidden');
        drawButton.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for UX

        const seedString = `${question}|${date}`;
        const hash = await getHash(seedString);
        const seed = parseInt(hash.substring(0, 8), 16);

        const seededRandom = mulberry32(seed);
        // Create an array of indices from allCardsData
        const cardIndices = Array.from({ length: allCardsData.length }, (_, i) => i);
        const shuffledIndices = shuffleArray([...cardIndices], seededRandom); // Use a copy for shuffling

        // Ensure we have at least 3 cards to draw
        if (shuffledIndices.length < 3) {
            console.error("Pas assez de cartes disponibles pour le tirage.");
            loadingIndicator.classList.add('hidden');
            drawButton.disabled = false;
            return;
        }
        const drawnIndices = shuffledIndices.slice(0, 3);

        const mainCardData = allCardsData[drawnIndices[0]];
        const forceCardData = allCardsData[drawnIndices[1]];
        const failleCardData = allCardsData[drawnIndices[2]];

        updateCardElement(cardElements.main, mainCardData);
        updateCardElement(cardElements.force, forceCardData);
        updateCardElement(cardElements.faille, failleCardData);

        // Reset scroll position for descriptions
        Object.values(cardElements).forEach(elements => {
            if (elements.infoContainer) {
                elements.infoContainer.scrollTop = 0;
            }
        });

        loadingIndicator.classList.add('hidden');
        readingDiv.classList.remove('hidden');
        drawButton.disabled = false;
    }

    function updateCardElement(elements, cardData) {
        if (cardData) {
            elements.image.src = `img/${cardData.imageFile}`;
            elements.image.alt = `Carte: ${cardData.nameCosmic}`;
            elements.nameCosmic.textContent = cardData.nameCosmic;
            elements.numberRoman.textContent = cardData.numberRoman;
            elements.nameMarseille.textContent = `(${cardData.nameMarseille})`;
            elements.description.textContent = cardData.description;
        } else {
            elements.image.src = '';
            elements.image.alt = 'Erreur Carte';
            elements.nameCosmic.textContent = 'Erreur Carte';
            elements.numberRoman.textContent = '?';
            elements.nameMarseille.textContent = '';
            elements.description.textContent = 'Impossible de charger les données de cette carte.';
        }
    }

    // --- Event Listeners ---
    drawButton.addEventListener('click', performDraw);
    questionInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            performDraw();
        }
    });

    drawButton.disabled = true;
    questionInput.disabled = true;
    loadCardData();

});