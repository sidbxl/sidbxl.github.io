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
    const galleryContainer = document.getElementById('gallery-container');
    const modal = document.getElementById('card-modal');
    const modalImage = document.getElementById('modal-image');
    const modalNameCosmic = document.getElementById('modal-nameCosmic');
    const modalNumberRoman = document.getElementById('modal-numberRoman');
    const modalNameMarseille = document.getElementById('modal-nameMarseille');
    const modalDescription = document.getElementById('modal-description');
    const closeModalButton = modal.querySelector('.modal-close-button');
    const galleryLoadingIndicator = document.getElementById('gallery-loading-indicator');
    const galleryErrorLoadingDiv = document.getElementById('gallery-error-loading');

    let allCardsData = [];

    async function loadAndDisplayCards() {
        galleryLoadingIndicator.classList.remove('hidden');
        galleryContainer.classList.add('hidden');
        try {
            const response = await fetch('cards_data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allCardsData = await response.json();
            displayCards(allCardsData);
            galleryErrorLoadingDiv.classList.add('hidden');
        } catch (error) {
            console.error("Erreur lors du chargement de cards_data.json pour la galerie:", error);
            galleryErrorLoadingDiv.textContent = `Erreur: Impossible de charger les données des cartes. (${error.message})`;
            galleryErrorLoadingDiv.classList.remove('hidden');
        } finally {
            galleryLoadingIndicator.classList.add('hidden');
            if (allCardsData.length > 0) {
                 galleryContainer.classList.remove('hidden');
            }
        }
    }

    function displayCards(cards) {
        galleryContainer.innerHTML = ''; // Clear previous content
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('gallery-card-item');
            cardElement.dataset.cardIndex = index; // Store index to retrieve full data

            const img = document.createElement('img');
            img.src = `img/${card.imageFile}`;
            img.alt = card.nameCosmic;
            img.classList.add('gallery-card-image');

            const name = document.createElement('p');
            name.classList.add('gallery-card-name');
            name.textContent = card.nameCosmic;

            cardElement.appendChild(img);
            cardElement.appendChild(name);

            cardElement.addEventListener('click', () => openModalWithCard(card));
            galleryContainer.appendChild(cardElement);
        });
    }

    function openModalWithCard(cardData) {
        modalImage.src = `img/${cardData.imageFile}`;
        modalImage.alt = `Carte: ${cardData.nameCosmic}`;
        modalNameCosmic.textContent = cardData.nameCosmic;
        modalNumberRoman.textContent = cardData.numberRoman;
        modalNameMarseille.textContent = `(${cardData.nameMarseille})`;
        modalDescription.textContent = cardData.description;
        modal.classList.remove('hidden');
        // Ensure description scroll is at the top
        if (modalDescription.parentElement) {
            modalDescription.parentElement.scrollTop = 0;
        }
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    closeModalButton.addEventListener('click', closeModal);
    // Optional: Close modal if clicking outside the content
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    // Optional: Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape" && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    loadAndDisplayCards();
});