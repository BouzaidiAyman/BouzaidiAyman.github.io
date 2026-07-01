// App State Management
const AppState = {
    currentUser: null,
    users: [],
    items: [],
    currentFilter: 'all',
    
    init() {
        this.loadFromStorage();
        if (!this.items.length) {
            this.seedData();
        }
    },
    
    loadFromStorage() {
        const usersData = localStorage.getItem('cultural_users');
        const itemsData = localStorage.getItem('cultural_items');
        const currentUserData = localStorage.getItem('cultural_current_user');
        
        if (usersData) this.users = JSON.parse(usersData);
        if (itemsData) this.items = JSON.parse(itemsData);
        if (currentUserData) this.currentUser = JSON.parse(currentUserData);
    },
    
    saveToStorage() {
        localStorage.setItem('cultural_users', JSON.stringify(this.users));
        localStorage.setItem('cultural_items', JSON.stringify(this.items));
        if (this.currentUser) {
            localStorage.setItem('cultural_current_user', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('cultural_current_user');
        }
    },
    
    seedData() {
        this.items = [
            {
                id: 1,
                type: 'book',
                title: 'One Hundred Years of Solitude',
                author: 'Gabriel García Márquez',
                description: 'A landmark novel of magical realism that tells the multi-generational story of the Buendía family in the fictional town of Macondo.',
                icon: '📚',
                ratings: []
            },
            {
                id: 2,
                type: 'book',
                title: 'The Great Gatsby',
                author: 'F. Scott Fitzgerald',
                description: 'A critique of the American Dream set in the Jazz Age, following the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.',
                icon: '📖',
                ratings: []
            },
            {
                id: 3,
                type: 'book',
                title: '1984',
                author: 'George Orwell',
                description: 'A dystopian social science fiction novel that has become synonymous with totalitarian surveillance and political manipulation.',
                icon: '📕',
                ratings: []
            },
            {
                id: 4,
                type: 'movie',
                title: 'The Shawshank Redemption',
                author: 'Frank Darabont',
                description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
                icon: '🎬',
                ratings: []
            },
            {
                id: 5,
                type: 'movie',
                title: 'Pulp Fiction',
                author: 'Quentin Tarantino',
                description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
                icon: '🎥',
                ratings: []
            },
            {
                id: 6,
                type: 'movie',
                title: 'Inception',
                author: 'Christopher Nolan',
                description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
                icon: '🎞️',
                ratings: []
            },
            {
                id: 7,
                type: 'series',
                title: 'Breaking Bad',
                author: 'Vince Gilligan',
                description: 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student.',
                icon: '📺',
                ratings: []
            },
            {
                id: 8,
                type: 'series',
                title: 'Stranger Things',
                author: 'The Duffer Brothers',
                description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.',
                icon: '📡',
                ratings: []
            },
            {
                id: 9,
                type: 'series',
                title: 'The Crown',
                author: 'Peter Morgan',
                description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century.',
                icon: '👑',
                ratings: []
            },
            {
                id: 10,
                type: 'book',
                title: 'To Kill a Mockingbird',
                author: 'Harper Lee',
                description: 'A gripping tale of racial injustice and childhood innocence in the American South during the 1930s.',
                icon: '🕊️',
                ratings: []
            },
            {
                id: 11,
                type: 'movie',
                title: 'The Godfather',
                author: 'Francis Ford Coppola',
                description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
                icon: '🎭',
                ratings: []
            },
            {
                id: 12,
                type: 'series',
                title: 'Game of Thrones',
                author: 'David Benioff & D.B. Weiss',
                description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.',
                icon: '⚔️',
                ratings: []
            }
        ];
        this.saveToStorage();
    },
    
    register(name, email, password) {
        const existingUser = this.users.find(u => u.email === email);
        if (existingUser) {
            return { success: false, message: 'Email already registered' };
        }
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            borrowedBooks: [],
            watchedMovies: [],
            watchedSeries: [],
            joinedDate: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveToStorage();
        return { success: true, message: 'Registration successful!' };
    },
    
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            this.saveToStorage();
            return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid email or password' };
    },
    
    logout() {
        this.currentUser = null;
        this.saveToStorage();
    },
    
    addRating(itemId, rating) {
        const item = this.items.find(i => i.id === itemId);
        if (!item || !this.currentUser) return false;
        
        const existingRatingIndex = item.ratings.findIndex(r => r.userId === this.currentUser.id);
        if (existingRatingIndex !== -1) {
            item.ratings[existingRatingIndex].rating = rating;
        } else {
            item.ratings.push({
                userId: this.currentUser.id,
                rating: rating,
                date: new Date().toISOString()
            });
        }
        
        this.saveToStorage();
        return true;
    },
    
    addToProfile(itemId, type) {
        if (!this.currentUser) return false;
        
        const user = this.users.find(u => u.id === this.currentUser.id);
        if (!user) return false;
        
        const item = this.items.find(i => i.id === itemId);
        if (!item) return false;
        
        const profileItem = {
            itemId: item.id,
            title: item.title,
            author: item.author,
            type: item.type,
            addedDate: new Date().toISOString()
        };
        
        if (type === 'book' && !user.borrowedBooks.find(b => b.itemId === itemId)) {
            user.borrowedBooks.push(profileItem);
        } else if (type === 'movie' && !user.watchedMovies.find(m => m.itemId === itemId)) {
            user.watchedMovies.push(profileItem);
        } else if (type === 'series' && !user.watchedSeries.find(s => s.itemId === itemId)) {
            user.watchedSeries.push(profileItem);
        }
        
        this.currentUser = user;
        this.saveToStorage();
        return true;
    },
    
    getAverageRating(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (!item || !item.ratings.length) return 0;
        
        const sum = item.ratings.reduce((acc, r) => acc + r.rating, 0);
        return sum / item.ratings.length;
    },
    
    getUserRating(itemId) {
        if (!this.currentUser) return 0;
        
        const item = this.items.find(i => i.id === itemId);
        if (!item) return 0;
        
        const userRating = item.ratings.find(r => r.userId === this.currentUser.id);
        return userRating ? userRating.rating : 0;
    }
};

// Router
const Router = {
    routes: {},
    
    init() {
        this.registerRoutes();
        this.handleNavigation();
        this.setupEventListeners();
    },
    
    registerRoutes() {
        this.routes = {
            home: Pages.home,
            login: Pages.login,
            register: Pages.register,
            library: Pages.library,
            profile: Pages.profile,
            contact: Pages.contact
        };
    },
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigate(page);
            }
        });
        
        window.addEventListener('popstate', () => {
            this.handleNavigation();
        });
    },
    
    navigate(page) {
        history.pushState({ page }, '', `#${page}`);
        this.handleNavigation();
    },
    
    handleNavigation() {
        const hash = window.location.hash.slice(1) || 'home';
        this.render(hash);
        this.updateNav(hash);
    },
    
    render(page) {
        const app = document.getElementById('app');
        const route = this.routes[page] || this.routes.home;
        app.innerHTML = route();
        this.attachPageEvents(page);
    },
    
    updateNav(page) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
        
        // Update nav based on login status
        const loginLink = document.querySelector('.nav-login');
        const registerLink = document.querySelector('.nav-register');
        
        if (AppState.currentUser) {
            loginLink.textContent = 'Profile';
            loginLink.dataset.page = 'profile';
            registerLink.textContent = 'Logout';
            registerLink.dataset.page = 'logout';
            registerLink.addEventListener('click', (e) => {
                if (registerLink.textContent === 'Logout') {
                    e.preventDefault();
                    AppState.logout();
                    this.navigate('home');
                    showToast('Logged out successfully', 'success');
                }
            });
        } else {
            loginLink.textContent = 'Login';
            loginLink.dataset.page = 'login';
            registerLink.textContent = 'Register';
            registerLink.dataset.page = 'register';
        }
    },
    
    attachPageEvents(page) {
        switch(page) {
            case 'login':
                this.attachLoginEvents();
                break;
            case 'register':
                this.attachRegisterEvents();
                break;
            case 'library':
                this.attachLibraryEvents();
                break;
            case 'contact':
                this.attachContactEvents();
                break;
        }
    },
    
    attachLoginEvents() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                const result = AppState.login(email, password);
                showToast(result.message, result.success ? 'success' : 'error');
                
                if (result.success) {
                    setTimeout(() => {
                        this.navigate('profile');
                    }, 1000);
                }
            });
        }
    },
    
    attachRegisterEvents() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                
                const result = AppState.register(name, email, password);
                showToast(result.message, result.success ? 'success' : 'error');
                
                if (result.success) {
                    setTimeout(() => {
                        this.navigate('login');
                    }, 1000);
                }
            });
        }
    },
    
    attachLibraryEvents() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                AppState.currentFilter = e.target.dataset.filter;
                this.renderLibraryItems();
            });
        });
        
        // Item cards
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = parseInt(card.dataset.itemId);
                this.showItemModal(itemId);
            });
        });
    },
    
    renderLibraryItems() {
        const grid = document.querySelector('.items-grid');
        if (!grid) return;
        
        const filteredItems = AppState.currentFilter === 'all' 
            ? AppState.items 
            : AppState.items.filter(item => item.type === AppState.currentFilter);
        
        grid.innerHTML = filteredItems.map(item => {
            const avgRating = AppState.getAverageRating(item.id);
            const ratingCount = item.ratings.length;
            
            return `
                <div class="item-card" data-item-id="${item.id}">
                    <div class="item-image">${item.icon}</div>
                    <div class="item-content">
                        <div class="item-type">${item.type}</div>
                        <h3 class="item-title">${item.title}</h3>
                        <p class="item-author">${item.author}</p>
                        <div class="item-rating">
                            <div class="stars">
                                ${generateStars(avgRating)}
                            </div>
                            <span class="rating-count">(${ratingCount})</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Reattach events
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = parseInt(card.dataset.itemId);
                this.showItemModal(itemId);
            });
        });
    },
    
    showItemModal(itemId) {
        const item = AppState.items.find(i => i.id === itemId);
        if (!item) return;
        
        const avgRating = AppState.getAverageRating(itemId);
        const userRating = AppState.getUserRating(itemId);
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
                <div class="modal-image">${item.icon}</div>
                <div class="modal-body">
                    <div class="modal-type">${item.type}</div>
                    <h2 class="modal-title">${item.title}</h2>
                    <p class="modal-author">by ${item.author}</p>
                    <p class="modal-description">${item.description}</p>
                    
                    <div class="item-rating">
                        <div class="stars">
                            ${generateStars(avgRating)}
                        </div>
                        <span class="rating-count">(${item.ratings.length} ratings)</span>
                    </div>
                    
                    ${AppState.currentUser ? `
                        <div class="rating-section">
                            <h3 class="rating-header">Your Rating</h3>
                            <div class="user-rating">
                                <div class="interactive-stars" data-item-id="${itemId}">
                                    ${generateInteractiveStars(userRating)}
                                </div>
                            </div>
                            <button class="btn btn-primary btn-small submit-rating" data-item-id="${itemId}" data-type="${item.type}">
                                Add to My ${item.type === 'book' ? 'Reading List' : 'Watched List'}
                            </button>
                        </div>
                    ` : `
                        <p style="text-align: center; margin-top: 2rem; color: var(--text-secondary);">
                            <a href="#" data-page="login" onclick="this.closest('.modal').remove()" style="color: var(--accent-gold); text-decoration: none;">Login</a> to rate and add to your profile
                        </p>
                    `}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Interactive stars
        if (AppState.currentUser) {
            const stars = modal.querySelectorAll('.interactive-star');
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const rating = index + 1;
                    AppState.addRating(itemId, rating);
                    
                    // Update stars display
                    stars.forEach((s, i) => {
                        if (i < rating) {
                            s.classList.add('filled');
                        } else {
                            s.classList.remove('filled');
                        }
                    });
                    
                    showToast('Rating saved!', 'success');
                });
            });
            
            // Add to profile button
            const addBtn = modal.querySelector('.submit-rating');
            addBtn.addEventListener('click', () => {
                const success = AppState.addToProfile(itemId, item.type);
                if (success) {
                    showToast(`Added to your ${item.type} list!`, 'success');
                } else {
                    showToast('Already in your list', 'error');
                }
            });
        }
    },
    
    attachContactEvents() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                showToast('Message sent successfully!', 'success');
                form.reset();
            });
        }
    }
};

// Pages
const Pages = {
    home() {
        return `
            <div class="page">
                <section class="home-hero">
                    <div class="hero-pattern"></div>
                    <div class="hero-content">
                        <p class="hero-subtitle">University Cultural Club</p>
                        <h1 class="hero-title">Discover, Read, Watch & Share</h1>
                        <p class="hero-description">
                            Join our vibrant community of culture enthusiasts. Access our curated library 
                            of books, movies, and series. Rate, review, and connect with fellow members.
                        </p>
                        <div class="hero-cta">
                            <a href="#" data-page="library" class="btn btn-primary">Explore Library</a>
                            <a href="#" data-page="register" class="btn btn-secondary">Join Now</a>
                        </div>
                    </div>
                </section>
                
                <section class="features-section">
                    <div class="section-header">
                        <h2 class="section-title">Why Join Our Club?</h2>
                        <p class="section-subtitle">
                            Experience culture in all its forms with like-minded individuals
                        </p>
                    </div>
                    
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">📚</div>
                            <h3 class="feature-title">Curated Library</h3>
                            <p class="feature-description">
                                Access our carefully selected collection of books, movies, and series. 
                                From classics to contemporary works, discover content that inspires.
                            </p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">⭐</div>
                            <h3 class="feature-title">Rate & Review</h3>
                            <p class="feature-description">
                                Share your thoughts and ratings. Help the community discover great content 
                                through your honest reviews and recommendations.
                            </p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">👥</div>
                            <h3 class="feature-title">Community</h3>
                            <p class="feature-description">
                                Connect with fellow culture enthusiasts. Engage in discussions, 
                                share insights, and build lasting friendships.
                            </p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">📊</div>
                            <h3 class="feature-title">Track Progress</h3>
                            <p class="feature-description">
                                Keep track of your reading and watching journey. View your personal 
                                statistics and celebrate your cultural exploration.
                            </p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">🎭</div>
                            <h3 class="feature-title">Monthly Events</h3>
                            <p class="feature-description">
                                Participate in exclusive monthly events, discussions, and cultural 
                                activities designed for engaged members.
                            </p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">💎</div>
                            <h3 class="feature-title">Member Benefits</h3>
                            <p class="feature-description">
                                Enjoy exclusive member benefits including early access to new content, 
                                special recommendations, and priority event registration.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        `;
    },
    
    login() {
        return `
            <div class="page">
                <div class="auth-container">
                    <div class="auth-box">
                        <div class="auth-header">
                            <h1 class="auth-title">Welcome Back</h1>
                            <p class="auth-subtitle">Login to continue your cultural journey</p>
                        </div>
                        
                        <form id="loginForm">
                            <div class="form-group">
                                <label class="form-label" for="loginEmail">Email Address</label>
                                <input 
                                    type="email" 
                                    id="loginEmail" 
                                    class="form-input" 
                                    placeholder="your.email@university.edu"
                                    required
                                />
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="loginPassword">Password</label>
                                <input 
                                    type="password" 
                                    id="loginPassword" 
                                    class="form-input" 
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-full">
                                Login
                            </button>
                        </form>
                        
                        <div class="auth-footer">
                            Don't have an account? 
                            <a href="#" data-page="register">Register here</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    register() {
        return `
            <div class="page">
                <div class="auth-container">
                    <div class="auth-box">
                        <div class="auth-header">
                            <h1 class="auth-title">Join Our Club</h1>
                            <p class="auth-subtitle">Create your account and start exploring</p>
                        </div>
                        
                        <form id="registerForm">
                            <div class="form-group">
                                <label class="form-label" for="registerName">Full Name</label>
                                <input 
                                    type="text" 
                                    id="registerName" 
                                    class="form-input" 
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="registerEmail">Email Address</label>
                                <input 
                                    type="email" 
                                    id="registerEmail" 
                                    class="form-input" 
                                    placeholder="your.email@university.edu"
                                    required
                                />
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="registerPassword">Password</label>
                                <input 
                                    type="password" 
                                    id="registerPassword" 
                                    class="form-input" 
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-full">
                                Create Account
                            </button>
                        </form>
                        
                        <div class="auth-footer">
                            Already have an account? 
                            <a href="#" data-page="login">Login here</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    library() {
        const items = AppState.items;
        const filteredItems = AppState.currentFilter === 'all' 
            ? items 
            : items.filter(item => item.type === AppState.currentFilter);
        
        return `
            <div class="page">
                <div class="library-header">
                    <h1 class="library-title">Our Library</h1>
                    <p class="library-subtitle">Explore our collection of books, movies, and series</p>
                </div>
                
                <div class="library-container">
                    <div class="library-filters">
                        <button class="filter-btn ${AppState.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
                            All
                        </button>
                        <button class="filter-btn ${AppState.currentFilter === 'book' ? 'active' : ''}" data-filter="book">
                            Books
                        </button>
                        <button class="filter-btn ${AppState.currentFilter === 'movie' ? 'active' : ''}" data-filter="movie">
                            Movies
                        </button>
                        <button class="filter-btn ${AppState.currentFilter === 'series' ? 'active' : ''}" data-filter="series">
                            Series
                        </button>
                    </div>
                    
                    <div class="items-grid">
                        ${filteredItems.map(item => {
                            const avgRating = AppState.getAverageRating(item.id);
                            const ratingCount = item.ratings.length;
                            
                            return `
                                <div class="item-card" data-item-id="${item.id}">
                                    <div class="item-image">${item.icon}</div>
                                    <div class="item-content">
                                        <div class="item-type">${item.type}</div>
                                        <h3 class="item-title">${item.title}</h3>
                                        <p class="item-author">${item.author}</p>
                                        <div class="item-rating">
                                            <div class="stars">
                                                ${generateStars(avgRating)}
                                            </div>
                                            <span class="rating-count">(${ratingCount})</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    },
    
    profile() {
        if (!AppState.currentUser) {
            Router.navigate('login');
            return '';
        }
        
        const user = AppState.users.find(u => u.id === AppState.currentUser.id) || AppState.currentUser;
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        const totalItems = (user.borrowedBooks?.length || 0) + 
                          (user.watchedMovies?.length || 0) + 
                          (user.watchedSeries?.length || 0);
        
        const userRatings = AppState.items.reduce((count, item) => {
            return count + (item.ratings.filter(r => r.userId === user.id).length);
        }, 0);
        
        return `
            <div class="page">
                <div class="profile-container">
                    <div class="profile-header">
                        <div class="profile-avatar">${initials}</div>
                        <h1 class="profile-name">${user.name}</h1>
                        <p class="profile-email">${user.email}</p>
                    </div>
                    
                    <div class="profile-stats">
                        <div class="stat-card">
                            <div class="stat-number">${user.borrowedBooks?.length || 0}</div>
                            <div class="stat-label">Books Read</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${user.watchedMovies?.length || 0}</div>
                            <div class="stat-label">Movies Watched</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${user.watchedSeries?.length || 0}</div>
                            <div class="stat-label">Series Watched</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${userRatings}</div>
                            <div class="stat-label">Ratings Given</div>
                        </div>
                    </div>
                    
                    ${user.borrowedBooks?.length > 0 ? `
                        <div class="profile-section">
                            <h2 class="profile-section-title">My Reading List</h2>
                            <div class="profile-items-grid">
                                ${user.borrowedBooks.map(book => `
                                    <div class="profile-item">
                                        <h3 class="profile-item-title">${book.title}</h3>
                                        <p class="profile-item-type">Book by ${book.author}</p>
                                        <p class="profile-item-date">Added: ${new Date(book.addedDate).toLocaleDateString()}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${user.watchedMovies?.length > 0 ? `
                        <div class="profile-section">
                            <h2 class="profile-section-title">Movies I've Watched</h2>
                            <div class="profile-items-grid">
                                ${user.watchedMovies.map(movie => `
                                    <div class="profile-item">
                                        <h3 class="profile-item-title">${movie.title}</h3>
                                        <p class="profile-item-type">Movie by ${movie.author}</p>
                                        <p class="profile-item-date">Added: ${new Date(movie.addedDate).toLocaleDateString()}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${user.watchedSeries?.length > 0 ? `
                        <div class="profile-section">
                            <h2 class="profile-section-title">Series I've Watched</h2>
                            <div class="profile-items-grid">
                                ${user.watchedSeries.map(series => `
                                    <div class="profile-item">
                                        <h3 class="profile-item-title">${series.title}</h3>
                                        <p class="profile-item-type">Series by ${series.author}</p>
                                        <p class="profile-item-date">Added: ${new Date(series.addedDate).toLocaleDateString()}</p>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${totalItems === 0 ? `
                        <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                            <p style="font-size: 1.2rem; margin-bottom: 1rem;">Your profile is empty</p>
                            <a href="#" data-page="library" class="btn btn-primary">Start Exploring</a>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },
    
    contact() {
        return `
            <div class="page">
                <div class="contact-container">
                    <div class="contact-header">
                        <h1 class="contact-title">Get In Touch</h1>
                        <p class="contact-subtitle">We'd love to hear from you</p>
                    </div>
                    
                    <div class="contact-content">
                        <div class="contact-info">
                            <div class="info-item">
                                <div class="info-icon">📧</div>
                                <h3 class="info-title">Email</h3>
                                <p class="info-text">culturalclub@university.edu</p>
                            </div>
                            
                            <div class="info-item">
                                <div class="info-icon">📍</div>
                                <h3 class="info-title">Location</h3>
                                <p class="info-text">Student Center, Room 301<br>University Campus</p>
                            </div>
                            
                            <div class="info-item">
                                <div class="info-icon">🕐</div>
                                <h3 class="info-title">Office Hours</h3>
                                <p class="info-text">Monday - Friday<br>9:00 AM - 5:00 PM</p>
                            </div>
                        </div>
                        
                        <div class="contact-form">
                            <form id="contactForm">
                                <div class="form-group">
                                    <label class="form-label" for="contactName">Name</label>
                                    <input 
                                        type="text" 
                                        id="contactName" 
                                        class="form-input" 
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label" for="contactEmail">Email</label>
                                    <input 
                                        type="email" 
                                        id="contactEmail" 
                                        class="form-input" 
                                        placeholder="your.email@university.edu"
                                        required
                                    />
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label" for="contactMessage">Message</label>
                                    <textarea 
                                        id="contactMessage" 
                                        class="form-textarea" 
                                        placeholder="How can we help you?"
                                        required
                                    ></textarea>
                                </div>
                                
                                <button type="submit" class="btn btn-primary btn-full">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// Utility Functions
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star">★</span>';
    }
    if (hasHalfStar) {
        stars += '<span class="star">★</span>';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star empty">★</span>';
    }
    
    return stars;
}

function generateInteractiveStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        const filled = i < rating ? 'filled' : '';
        stars += `<span class="interactive-star ${filled}">★</span>`;
    }
    return stars;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});

// Initialize App
AppState.init();
Router.init();