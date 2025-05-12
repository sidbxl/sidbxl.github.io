document.addEventListener('DOMContentLoaded', () => {
    // --- Card Data (Updated with number and description) ---
    const cards = [
        { index: 0, number: "0/∞", name: "Big Bang", suit: "Épées", marseille: "Fou", icon: "💥", description: "Commencement, innocence, premier et dernier cycle, néophyte, naïveté, émerveillement, regarder avec des yeux neufs." },
        { index: 1, number: "1", name: "Espace", suit: "Épées", marseille: "Bateleur / Magicien", icon: "🌌", description: "Unité, capacité, intention." },
        { index: 2, number: "2", name: "Conscience", suit: "Coupes", marseille: "Papesse", icon: "🧘‍♀️", description: "Observation, passivité, intérieur, lucidité, amour inconditionnel." },
        { index: 3, number: "3", name: "Lumière", suit: "Deniers", marseille: "Impératrice", icon: "💡", description: "Sincérité, dynamique, limpidité, compréhension, pose de limites, raison, vérité, apprentissage." },
        { index: 4, number: "4", name: "Gravité", suit: "Bâtons", marseille: "Empereur", icon: "🍎", description: "Propriété, lourdeur, stagnation, stabilité." },
        { index: 5, number: "5", name: "Temps", suit: "Deniers", marseille: "Pape", icon: "⏳", description: "Maturation, mûrissement, sagesse, cycle." },
        { index: 6, number: "6", name: "Humain·e", suit: "Épées", marseille: "Amoureux", icon: "🧑‍🤝‍🧑", description: "Hasard, imprévisibilité, solidarité, symbiose, conflit, connections." },
        { index: 7, number: "7", name: "Inertie", suit: "Coupes", marseille: "Chariot", icon: "🚀", description: "Questionnement, trajectoire, im/mobilité, rigueur, discipline, précision, focus, hyper focus, décider de son destin." },
        { index: 8, number: "8", name: "Électromagnétisme", suit: "Épées", marseille: "Justice", icon: "⚡", description: "Réalisme, puissance, impuissance, implacable, être à la juste place." },
        // Corrected name: "Vide interstellaire" instead of "Espace interstellaire" based on CSV
        { index: 9, number: "9", name: "Vide interstellaire", suit: "Deniers", marseille: "Ermite", icon: "🔭", description: "Occulte, sagesse, solitude choisie, méditation, introspection." },
        { index: 10, number: "10", name: "Galaxie", suit: "Bâtons", marseille: "Roue de Fortune", icon: "🌀", description: "Imprévisible, cycles, chamboulement." },
        { index: 11, number: "11", name: "Vie", suit: "Bâtons", marseille: "Force", icon: "🌿", description: "Sensorialité, corporalité, soin du corps." },
        { index: 12, number: "12", name: "Révolution", suit: "Coupes", marseille: "Pendu", icon: "🔄", description: "Renversement, changement de point de vue, initiation, choix, sacrifice/abnégation, 3e voie, innovation, sortie des sentiers battus." },
        { index: 13, number: "13", name: "Collision", suit: "Coupes", marseille: "Mort / Sans Nom", icon: "☄️", description: "Deuil, renaissance, d'un stade à un autre, changement, transformation radicale, acceptation." },
        { index: 14, number: "14", name: "Atmosphère", suit: "Bâtons", marseille: "Tempérance", icon: "🌍", description: "Equilibre, symbiose, protection, cocoon, porosité." },
        { index: 15, number: "15", name: "Vaisseau", suit: "Deniers", marseille: "Diable", icon: "🛸", description: "Décisionnel, aller vers l'inconnu.e, (dé)pactiser, demander de l'aide, atterrir, décoller, rencontre." },
        // Corrected spelling: expérimentations, effondrement
        { index: 16, number: "16", name: "Supernova", suit: "Bâtons", marseille: "Maison-Dieu / Tour", icon: "🌟", description: "Humilité, essai-erreur, expérimentations, tentatives // phare dans la nuit // accident // destruction, effondrement ce qui tenait sur des bases foireuses." },
        // Corrected spelling: empouvoirante
        { index: 17, number: "17", name: "Étoile·s", suit: "Épées", marseille: "Étoile", icon: "✨", description: "Confiance, espoir, rêverie empouvoirante, fuite dans l'imaginaire." },
        { index: 18, number: "18", name: "Lune", suit: "Coupes", marseille: "Lune", icon: "🌙", description: "Recherche de ressources, occulte, lumière dans le noir, réflectivité, très vieille amitié, les cycles biologiques." },
        { index: 19, number: "19", name: "Soleil", suit: "Bâtons", marseille: "Soleil", icon: "☀️", description: "Centre, recentrer, ancrage." },
        // Corrected spelling: apprendre, apparente
        { index: 20, number: "20", name: "Entropie", suit: "Bâtons", marseille: "Jugement", icon: "📈", description: "Sortir du narratif, hasard, apprendre à naviguer dans le chaos, désorganisation apparente, dispersion, célébration, fête, grandes retrouvailles." },
        { index: 21, number: "21", name: "Univers", suit: "Deniers", marseille: "Monde", icon: "♾️", description: "Contextualisation, relativisation, prise de recul, ouverture." }
    ];


    // --- DOM Elements ---
    const questionInput = document.getElementById('question');
    const drawButton = document.getElementById('draw-button');
    const readingDiv = document.getElementById('tarot-reading');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Updated to include number and description elements
    const cardElements = {
        force: {
            number: document.getElementById('number-force'),
            icon: document.getElementById('icon-force'),
            name: document.getElementById('name-force'),
            marseille: document.getElementById('marseille-force'),
            description: document.getElementById('description-force'),
            // Reference to the scrollable content div if needed later
            content: document.getElementById('card-force').querySelector('.card-content')
        },
        main: {
            number: document.getElementById('number-main'),
            icon: document.getElementById('icon-main'),
            name: document.getElementById('name-main'),
            marseille: document.getElementById('marseille-main'),
            description: document.getElementById('description-main'),
            content: document.getElementById('card-main').querySelector('.card-content')
        },
        faille: {
            number: document.getElementById('number-faille'),
            icon: document.getElementById('icon-faille'),
            name: document.getElementById('name-faille'),
            marseille: document.getElementById('marseille-faille'),
            description: document.getElementById('description-faille'),
            content: document.getElementById('card-faille').querySelector('.card-content')
        }
    };

    // --- Core Logic (Hashing, PRNG, Shuffle - unchanged) ---

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
             // Return a simple string representation as fallback
             return 'fallback' + Math.abs(hash).toString(16).padStart(8,'0');
        }
    }

    // --- Draw Function ---
    async function performDraw() {
        const question = questionInput.value.trim().toLowerCase();
        const date = getFormattedDate();

        if (!question) {
            alert("Veuillez entrer une question pour initier l'analyse cosmique.");
            return;
        }

        loadingIndicator.classList.remove('hidden');
        readingDiv.classList.add('hidden');
        // Ensure button is not spammed while loading
        drawButton.disabled = true;

        // Small delay to ensure loading is visible even with fast hashing
        await new Promise(resolve => setTimeout(resolve, 50));

        const seedString = `${question}|${date}`;
        const hash = await getHash(seedString);
        const seed = parseInt(hash.substring(0, 8), 16); // Use first 8 hex chars for seed

        const seededRandom = mulberry32(seed);
        const cardIndices = Array.from({ length: cards.length }, (_, i) => i);
        const shuffledIndices = shuffleArray(cardIndices, seededRandom);
        const drawnIndices = shuffledIndices.slice(0, 3);

        const mainCard = cards.find(c => c.index === drawnIndices[0]);
        const forceCard = cards.find(c => c.index === drawnIndices[1]);
        const failleCard = cards.find(c => c.index === drawnIndices[2]);

        // Update the DOM with all card details
        updateCardElement(cardElements.main, mainCard);
        updateCardElement(cardElements.force, forceCard);
        updateCardElement(cardElements.faille, failleCard);

        // Reset scroll position for descriptions
        Object.values(cardElements).forEach(elements => {
            if (elements.content) {
                elements.content.scrollTop = 0;
            }
        });


        loadingIndicator.classList.add('hidden');
        readingDiv.classList.remove('hidden');
        drawButton.disabled = false; // Re-enable button
    }

    // --- Helper Function to Update DOM (Updated) ---
    function updateCardElement(elements, cardData) {
        if (cardData) {
            elements.number.textContent = cardData.number; // Set number
            elements.icon.textContent = cardData.icon;
            elements.name.textContent = cardData.name;
            elements.marseille.textContent = cardData.marseille;
            elements.description.textContent = cardData.description; // Set description
        } else {
            // Basic error display
            elements.number.textContent = '?';
            elements.icon.textContent = '❓';
            elements.name.textContent = 'Erreur Carte';
            elements.marseille.textContent = '';
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

}); // End DOMContentLoaded
