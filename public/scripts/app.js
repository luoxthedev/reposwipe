// Configuration et variables globales
const API_BASE_URL = '/api/github'; // Utiliser notre proxy au lieu de l'API GitHub directe
let currentRepos = [];
let currentIndex = 0;
let favorites = JSON.parse(localStorage.getItem('repoSwipeFavorites')) || [];
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let currentCard = null;
let githubRateLimit = { remaining: 5000, limit: 5000 };

// Paramètres de recherche
let searchParams = {
    language: '',
    sort: 'stars',
    minStars: 100,
    page: 1
};

// Mots-clés aléatoires pour varier les résultats
const randomKeywords = [
    'awesome', 'framework', 'library', 'tool', 'api', 'app', 'web', 
    'mobile', 'game', 'bot', 'cli', 'ui', 'data', 'ml', 'ai',
    'react', 'vue', 'angular', 'node', 'python', 'java', 'go',
    'docker', 'kubernetes', 'cloud', 'serverless', 'microservices'
];

// Fonction pour obtenir un mot-clé aléatoire
function getRandomKeyword() {
    return randomKeywords[Math.floor(Math.random() * randomKeywords.length)];
}

// Couleurs des langages
const languageColors = {
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    TypeScript: '#2b7489',
    Go: '#00ADD8',
    Rust: '#dea584',
    'C++': '#f34b7d',
    'C#': '#178600',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    Vue: '#4fc08d',
    React: '#61dafb'
};

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'authentification
    const auth = await checkAuth();
    if (!auth) {
        window.location.href = '/';
        return;
    }
    
    // Vérifier le rate limit GitHub
    await checkGitHubRateLimit();
    
    loadRepos();
    loadFavoritesFromServer();
    updateFavoritesCount();
    setupEventListeners();
});

// Vérifier le rate limit GitHub
async function checkGitHubRateLimit() {
    try {
        const response = await fetch('/api/github/rate-limit');
        const data = await response.json();
        
        githubRateLimit = {
            remaining: data.core.remaining,
            limit: data.core.limit,
            reset: data.core.reset
        };
        
        console.log(`✅ GitHub API Core: ${data.core.remaining}/${data.core.limit} requêtes restantes`);
        console.log(`ℹ️  Note: La recherche a une limite séparée de 30 requêtes/minute`);
        
        if (data.core.remaining < 100) {
            const resetDate = new Date(data.core.reset);
            showNotification(
                `⚠️ Attention: Plus que ${data.core.remaining} requêtes GitHub. Reset à ${resetDate.toLocaleTimeString()}`,
                'warning'
            );
        }
        
        if (!data.authenticated) {
            console.warn('⚠️ GitHub API non authentifiée. Limite: 60 requêtes/heure.');
            console.warn('💡 Ajoute un GITHUB_TOKEN dans .env pour 5000 requêtes/heure !');
            showNotification('⚠️ Ajoute un token GitHub pour éviter les limites', 'warning');
        } else {
            console.log('✅ GitHub API authentifiée avec token');
        }
    } catch (error) {
        console.error('Erreur vérification rate limit:', error);
    }
}

// Vérifier l'authentification
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        return false;
    }
}

// Chargement des repos depuis l'API GitHub
async function loadRepos() {
    const loader = document.getElementById('loader');
    const cardsStack = document.getElementById('cardsStack');
    const noMoreCards = document.getElementById('noMoreCards');
    
    loader.style.display = 'flex';
    cardsStack.innerHTML = '';
    noMoreCards.style.display = 'none';
    
    try {
        // Construction de la requête de recherche avec randomisation
        let query = `stars:>${searchParams.minStars}`;
        
        // Ajouter un mot-clé aléatoire pour varier les résultats
        const randomKeyword = getRandomKeyword();
        query += ` ${randomKeyword}`;
        
        if (searchParams.language) {
            query += ` language:${searchParams.language}`;
        }
        
        // Page aléatoire entre 1 et 10 pour plus de variété
        const randomPage = Math.floor(Math.random() * 10) + 1;
        
        const response = await fetch(
            `${API_BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&sort=${searchParams.sort}&order=desc&per_page=30&page=${randomPage}`
        );
        
        if (!response.ok) {
            // Si rate limit GitHub
            if (response.status === 429) {
                const errorData = await response.json();
                const resetDate = new Date(errorData.resetAt);
                throw new Error(`Limite API GitHub atteinte. Réessaye à ${resetDate.toLocaleTimeString()}`);
            }
            throw new Error('Erreur lors du chargement des repos');
        }
        
        const data = await response.json();
        
        // Mettre à jour le rate limit
        if (data.rateLimit) {
            githubRateLimit = data.rateLimit;
            console.log(`GitHub API: ${data.rateLimit.remaining}/${data.rateLimit.limit} requêtes restantes`);
        }
        
        // Mélanger les résultats pour plus de variété
        currentRepos = shuffleArray(data.items);
        currentIndex = 0;
        
        if (currentRepos.length === 0) {
            loader.style.display = 'none';
            noMoreCards.style.display = 'block';
            return;
        }
        
        // Afficher les 3 premières cartes
        displayCards();
        
    } catch (error) {
        console.error('Erreur lors du chargement des repos:', error);
        loader.innerHTML = `<p style="color: white;">${error.message}</p>`;
    }
}

// Fonction pour mélanger un tableau (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Affichage des cartes
function displayCards() {
    const cardsStack = document.getElementById('cardsStack');
    const loader = document.getElementById('loader');
    const noMoreCards = document.getElementById('noMoreCards');
    
    cardsStack.innerHTML = '';
    loader.style.display = 'none';
    
    // Afficher jusqu'à 3 cartes
    const cardsToShow = Math.min(3, currentRepos.length - currentIndex);
    
    if (cardsToShow === 0) {
        noMoreCards.style.display = 'block';
        return;
    }
    
    for (let i = cardsToShow - 1; i >= 0; i--) {
        const repo = currentRepos[currentIndex + i];
        const card = createCard(repo, i);
        cardsStack.appendChild(card);
    }
    
    // Ajouter les événements de drag à la première carte
    const topCard = cardsStack.firstElementChild;
    if (topCard) {
        setupCardDrag(topCard);
    }
}

// Création d'une carte
function createCard(repo, stackPosition) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.zIndex = 3 - stackPosition;
    card.style.transform = `scale(${1 - stackPosition * 0.05}) translateY(${stackPosition * 10}px)`;
    card.style.opacity = stackPosition === 0 ? 1 : 0.9 - stackPosition * 0.1;
    
    const languageColor = languageColors[repo.language] || '#333';
    
    // Récupérer les topics (limité à 5)
    const topics = repo.topics ? repo.topics.slice(0, 5) : [];
    
    card.innerHTML = `
        <div class="card-content">
            <div class="repo-header">
                <img src="${repo.owner.avatar_url}" alt="${repo.owner.login}" class="repo-avatar">
                <div class="repo-info">
                    <h2>${repo.name}</h2>
                    <span class="owner">@${repo.owner.login}</span>
                </div>
            </div>
            
            <div class="repo-description">
                ${repo.description || 'Aucune description disponible'}
            </div>
            
            <div class="repo-stats">
                <div class="stat">
                    <i class="fas fa-star" style="color: #f59e0b;"></i>
                    <span>${formatNumber(repo.stargazers_count)}</span>
                    <small>Stars</small>
                </div>
                <div class="stat">
                    <i class="fas fa-code-branch" style="color: #6366f1;"></i>
                    <span>${formatNumber(repo.forks_count)}</span>
                    <small>Forks</small>
                </div>
                <div class="stat">
                    <i class="fas fa-eye" style="color: #10b981;"></i>
                    <span>${formatNumber(repo.watchers_count)}</span>
                    <small>Watchers</small>
                </div>
            </div>
            
            ${repo.language ? `
                <div class="repo-language">
                    <span class="language-color" style="background: ${languageColor};"></span>
                    ${repo.language}
                </div>
            ` : ''}
            
            ${topics.length > 0 ? `
                <div class="repo-topics">
                    ${topics.map(topic => `<span class="topic">${topic}</span>`).join('')}
                </div>
            ` : ''}
            
            <div class="repo-footer">
                <a href="${repo.html_url}" target="_blank" class="card-btn primary">
                    <i class="fab fa-github"></i> Voir sur GitHub
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" class="card-btn secondary">
                        <i class="fas fa-external-link-alt"></i> Site Web
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    // Ajouter les indicateurs de swipe
    const indicators = document.createElement('div');
    indicators.className = 'swipe-indicators';
    indicators.innerHTML = `
        <div class="nope-indicator">
            <i class="fas fa-times"></i>
            <span>SKIP</span>
        </div>
        <div class="like-indicator">
            <i class="fas fa-heart"></i>
            <span>LIKE</span>
        </div>
        <div class="super-indicator">
            <i class="fas fa-star"></i>
            <span>SUPER</span>
        </div>
    `;
    card.appendChild(indicators);
    
    return card;
}

// Configuration du drag pour une carte
function setupCardDrag(card) {
    // Mouse events
    card.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    // Touch events
    card.addEventListener('touchstart', handleStart);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
}

// Gestion du début du drag
function handleStart(e) {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
    
    isDragging = true;
    currentCard = e.currentTarget;
    currentCard.classList.add('dragging');
    
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    e.preventDefault();
}

// Gestion du mouvement
function handleMove(e) {
    if (!isDragging || !currentCard) return;
    
    currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const rotation = deltaX * 0.1;
    
    currentCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
    
    // Ajouter les classes pour les indicateurs
    currentCard.classList.remove('going-left', 'going-right', 'going-up');
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
            currentCard.classList.add('going-right');
        } else if (deltaX < -50) {
            currentCard.classList.add('going-left');
        }
    } else if (deltaY < -50) {
        currentCard.classList.add('going-up');
    }
}

// Gestion de la fin du drag
function handleEnd(e) {
    if (!isDragging || !currentCard) return;
    
    isDragging = false;
    currentCard.classList.remove('dragging');
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const threshold = 100;
    
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        let action = '';
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            action = deltaX > 0 ? 'like' : 'reject';
        } else if (deltaY < -threshold) {
            action = 'super';
        }
        
        if (action) {
            handleSwipe(action);
            return;
        }
    }
    
    // Retour à la position initiale
    currentCard.style.transform = '';
    currentCard.classList.remove('going-left', 'going-right', 'going-up');
    currentCard = null;
}

// Gestion du swipe
function handleSwipe(action) {
    const card = currentCard || document.querySelector('.cards-stack .card');
    if (!card) return;
    
    const repo = currentRepos[currentIndex];
    
    // Sauvegarder le swipe sur le serveur
    saveSwipe(repo, action);
    
    // Animation de sortie
    card.classList.add('removed');
    
    switch(action) {
        case 'reject':
            card.style.transform = 'translateX(-150%) rotate(-30deg)';
            break;
        case 'like':
            card.style.transform = 'translateX(150%) rotate(30deg)';
            addToFavorites(repo);
            break;
        case 'super':
            card.style.transform = 'translateY(-150%) rotate(10deg) scale(0.5)';
            addToFavorites(repo, true);
            break;
    }
    
    card.style.opacity = '0';
    
    // Supprimer la carte et afficher la suivante
    setTimeout(() => {
        currentIndex++;
        displayCards();
        
        // Charger plus de repos si nécessaire
        if (currentIndex >= currentRepos.length - 5) {
            searchParams.page++;
            loadMoreRepos();
        }
    }, 300);
    
    currentCard = null;
}

// Sauvegarder un swipe sur le serveur
async function saveSwipe(repo, action) {
    try {
        const response = await fetch('/api/swipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                repoId: repo.id,
                action: action,
                repoData: {
                    name: repo.name,
                    owner: repo.owner.login,
                    description: repo.description,
                    stars: repo.stargazers_count,
                    language: repo.language,
                    url: repo.html_url
                }
            })
        });
        
        // Gérer le rate limiting
        if (response.status === 429) {
            const data = await response.json();
            showNotification(`⏱️ ${data.error}`, 'warning');
            
            // Bloquer les swipes pendant 10 secondes
            disableSwipes(10);
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du swipe:', error);
    }
}

// Désactiver les swipes temporairement
function disableSwipes(seconds) {
    const buttons = document.querySelectorAll('.action-btn');
    const cards = document.querySelectorAll('.card');
    
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    });
    
    cards.forEach(card => {
        card.style.pointerEvents = 'none';
    });
    
    let countdown = seconds;
    const interval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(interval);
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            });
            cards.forEach(card => {
                card.style.pointerEvents = 'auto';
            });
            showNotification('✅ Tu peux continuer à swiper !', 'success');
        }
    }, 1000);
}

// Charger les favoris depuis le serveur
async function loadFavoritesFromServer() {
    try {
        const response = await fetch('/api/swipes/favorites');
        const data = await response.json();
        
        if (data.favorites) {
            favorites = data.favorites.map(f => ({
                id: f.repoId,
                ...f.repoData,
                isSuper: f.action === 'super'
            }));
            localStorage.setItem('repoSwipeFavorites', JSON.stringify(favorites));
            updateFavoritesCount();
        }
    } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
    }
}

// Charger plus de repos en arrière-plan
async function loadMoreRepos() {
    try {
        let query = `stars:>${searchParams.minStars}`;
        
        // Ajouter un mot-clé aléatoire différent
        const randomKeyword = getRandomKeyword();
        query += ` ${randomKeyword}`;
        
        if (searchParams.language) {
            query += ` language:${searchParams.language}`;
        }
        
        // Page aléatoire pour plus de variété
        const randomPage = Math.floor(Math.random() * 10) + 1;
        
        const response = await fetch(
            `${API_BASE_URL}/search/repositories?q=${encodeURIComponent(query)}&sort=${searchParams.sort}&order=desc&per_page=30&page=${randomPage}`
        );
        
        if (response.ok) {
            const data = await response.json();
            
            // Mettre à jour le rate limit
            if (data.rateLimit) {
                githubRateLimit = data.rateLimit;
            }
            
            // Mélanger et ajouter les nouveaux repos
            const shuffledNewRepos = shuffleArray(data.items);
            currentRepos = currentRepos.concat(shuffledNewRepos);
        }
    } catch (error) {
        console.error('Erreur lors du chargement de plus de repos:', error);
    }
}

// Ajouter aux favoris
function addToFavorites(repo, isSuper = false) {
    const existingIndex = favorites.findIndex(fav => fav.id === repo.id);
    
    if (existingIndex === -1) {
        favorites.unshift({
            id: repo.id,
            name: repo.name,
            owner: repo.owner.login,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            url: repo.html_url,
            isSuper: isSuper
        });
        
        // Limiter à 50 favoris
        if (favorites.length > 50) {
            favorites = favorites.slice(0, 50);
        }
        
        localStorage.setItem('repoSwipeFavorites', JSON.stringify(favorites));
        updateFavoritesCount();
        
        // Animation de feedback
        showNotification(isSuper ? '⭐ Super Like!' : '❤️ Ajouté aux favoris!');
    }
}

// Afficher une notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    const colors = {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: 'white'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type] || 'white'};
        color: ${type === 'info' ? '#1f2937' : 'white'};
        padding: 1rem 2rem;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideDown 0.3s ease;
        font-weight: 600;
        max-width: 90%;
        text-align: center;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    const duration = type === 'warning' ? 3000 : 2000;
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Mise à jour du compteur de favoris
function updateFavoritesCount() {
    const count = document.querySelector('.favorites-count');
    count.textContent = favorites.length;
    count.style.display = favorites.length > 0 ? 'flex' : 'none';
}

// Afficher les favoris
function displayFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p style="text-align: center; color: #6b7280;">Aucun favori pour le moment</p>';
        return;
    }
    
    favoritesList.innerHTML = favorites.map(fav => `
        <div class="favorite-item">
            ${fav.isSuper ? '<span style="float: right;">⭐</span>' : ''}
            <h4>${fav.name}</h4>
            <p>@${fav.owner}</p>
            <p style="font-size: 0.85rem;">${fav.description || 'Pas de description'}</p>
            <div class="favorite-item-footer">
                <div class="favorite-item-stats">
                    <span><i class="fas fa-star"></i> ${formatNumber(fav.stars)}</span>
                    ${fav.language ? `<span>${fav.language}</span>` : ''}
                </div>
                <button class="remove-favorite" onclick="removeFavorite(${fav.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <a href="${fav.url}" target="_blank" class="card-btn primary" style="margin-top: 0.5rem; font-size: 0.9rem;">
                <i class="fab fa-github"></i> Voir le repo
            </a>
        </div>
    `).join('');
}

// Supprimer un favori
function removeFavorite(id) {
    favorites = favorites.filter(fav => fav.id !== id);
    localStorage.setItem('repoSwipeFavorites', JSON.stringify(favorites));
    updateFavoritesCount();
    displayFavorites();
}

// Configuration des événements
function setupEventListeners() {
    // Boutons d'action
    document.getElementById('rejectBtn').addEventListener('click', () => handleSwipe('reject'));
    document.getElementById('likeBtn').addEventListener('click', () => handleSwipe('like'));
    document.getElementById('superBtn').addEventListener('click', () => handleSwipe('super'));
    
    // Raccourcis clavier
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                handleSwipe('reject');
                break;
            case 'ArrowRight':
                handleSwipe('like');
                break;
            case 'ArrowUp':
                handleSwipe('super');
                break;
        }
    });
    
    // Panneau des filtres
    document.getElementById('filtersBtn').addEventListener('click', () => {
        document.getElementById('filtersPanel').classList.toggle('active');
    });
    
    // Appliquer les filtres
    document.getElementById('applyFilters').addEventListener('click', () => {
        searchParams.language = document.getElementById('languageFilter').value;
        searchParams.sort = document.getElementById('sortFilter').value;
        searchParams.minStars = parseInt(document.getElementById('minStars').value) || 100;
        searchParams.page = 1;
        
        document.getElementById('filtersPanel').classList.remove('active');
        loadRepos();
    });
    
    // Panneau des favoris
    document.getElementById('favoritesBtn').addEventListener('click', () => {
        document.getElementById('favoritesPanel').classList.add('active');
        displayFavorites();
    });
    
    document.getElementById('closeFavorites').addEventListener('click', () => {
        document.getElementById('favoritesPanel').classList.remove('active');
    });
    
    // Bouton refresh
    document.getElementById('refreshBtn').addEventListener('click', () => {
        searchParams.page = 1;
        loadRepos();
    });
    
    // Bouton déconnexion
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/';
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    });
    
    // Panneau des statistiques
    document.getElementById('statsBtn').addEventListener('click', () => {
        document.getElementById('statsPanel').classList.add('active');
        loadStats();
    });
    
    document.getElementById('closeStats').addEventListener('click', () => {
        document.getElementById('statsPanel').classList.remove('active');
    });
    
    // Mode sombre
    const darkModeBtn = document.getElementById('darkModeBtn');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark);
        darkModeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// Charger les statistiques
async function loadStats() {
    try {
        const response = await fetch('/api/swipes/stats');
        const data = await response.json();
        
        if (data.stats) {
            const { total, likes, rejects, supers } = data.stats;
            
            document.getElementById('totalSwipes').textContent = total;
            document.getElementById('totalLikes').textContent = likes;
            document.getElementById('totalSupers').textContent = supers;
            document.getElementById('totalRejects').textContent = rejects;
            
            // Calculer le taux d'appréciation
            const likeRate = total > 0 ? Math.round(((likes + supers) / total) * 100) : 0;
            document.getElementById('likeRate').style.width = `${likeRate}%`;
            document.getElementById('likeRateText').textContent = `${likeRate}%`;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
    }
}

// Fonction utilitaire pour formater les nombres
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Styles pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translate(-50%, -20px);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);