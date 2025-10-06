# 🧪 Guide de Tests - RepoSwipe

## 📦 Installation des dépendances de test

```bash
npm install
```

Les dépendances de test sont déjà incluses dans `package.json` :
- **Jest** : Framework de test
- **Supertest** : Tests d'API HTTP
- **@types/jest** : Types TypeScript pour Jest

---

## 🚀 Lancer les tests

### Tous les tests
```bash
npm test
```

### Tests en mode watch (développement)
```bash
npm run test:watch
```

### Tests unitaires uniquement
```bash
npm run test:unit
```

### Tests d'intégration uniquement
```bash
npm run test:integration
```

---

## 📊 Coverage

Les tests génèrent automatiquement un rapport de couverture dans `coverage/`.

Pour voir le rapport HTML :
```bash
# Windows
start coverage/lcov-report/index.html

# macOS
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html
```

---

## 📁 Structure des tests

```
tests/
├── unit/              # Tests unitaires
│   ├── utils.test.js  # Tests des fonctions utilitaires
│   └── auth.test.js   # Tests d'authentification
└── integration/       # Tests d'intégration
    └── api.test.js    # Tests des endpoints API
```

---

## ✍️ Écrire des tests

### Test unitaire exemple

```javascript
// tests/unit/myFunction.test.js
describe('My Function', () => {
    it('should do something', () => {
        const result = myFunction(input);
        expect(result).toBe(expected);
    });
});
```

### Test d'intégration exemple

```javascript
// tests/integration/api.test.js
const request = require('supertest');
const app = require('../../server/server');

describe('API Endpoint', () => {
    it('should return 200', async () => {
        const response = await request(app)
            .get('/api/endpoint')
            .expect(200);
        
        expect(response.body).toHaveProperty('data');
    });
});
```

---

## 🎯 Tests actuels

### Tests unitaires

#### `utils.test.js`
- ✅ `formatNumber()` - Formatage des nombres (1.5k, 2.0M)
- ✅ `shuffleArray()` - Mélange de tableau (Fisher-Yates)

#### `auth.test.js`
- ✅ Hashage de mot de passe avec bcrypt
- ✅ Vérification de mot de passe
- ✅ Validation de longueur de mot de passe

### Tests d'intégration

#### `api.test.js`
- 🚧 Health check endpoint
- 🚧 Authentication endpoints (register, login)
- 🚧 Swipes endpoints (save, get, stats)

*Note: Les tests d'intégration sont des placeholders. Ils nécessitent une base de données de test.*

---

## 🔧 Configuration Jest

La configuration Jest est dans `package.json` :

```json
{
  "jest": {
    "testEnvironment": "node",
    "coverageDirectory": "coverage",
    "collectCoverageFrom": [
      "server/**/*.js",
      "!server/server.js",
      "!**/node_modules/**"
    ],
    "testMatch": [
      "**/tests/**/*.test.js"
    ]
  }
}
```

---

## 🐛 Debugging des tests

### Lancer un seul fichier de test
```bash
npm test -- tests/unit/utils.test.js
```

### Lancer un seul test
```bash
npm test -- -t "should format millions correctly"
```

### Mode verbose
```bash
npm test -- --verbose
```

### Voir les logs
```bash
npm test -- --silent=false
```

---

## 🔄 CI/CD

Les tests sont automatiquement lancés sur GitHub Actions lors de chaque push ou pull request.

Voir `.github/workflows/ci.yml` pour la configuration.

### Pipeline CI/CD

1. **Test** : Lance les tests sur Node 18 et 20
2. **Build** : Construit l'image Docker
3. **Deploy** : Déploie en production (si sur main)

---

## 📈 Bonnes pratiques

### 1. Tester les cas limites
```javascript
it('should handle empty array', () => {
    expect(myFunction([])).toEqual([]);
});

it('should handle null input', () => {
    expect(myFunction(null)).toBeNull();
});
```

### 2. Tester les erreurs
```javascript
it('should throw error for invalid input', () => {
    expect(() => myFunction('invalid')).toThrow();
});
```

### 3. Utiliser des mocks
```javascript
jest.mock('../config/supabase');

it('should call supabase', async () => {
    const mockSupabase = require('../config/supabase');
    mockSupabase.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: [] })
    });
    
    // Test...
});
```

### 4. Nettoyer après les tests
```javascript
afterEach(() => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await closeDatabase();
});
```

---

## 🎓 Ressources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

## 🚧 TODO Tests

- [ ] Tests d'intégration complets avec base de données de test
- [ ] Tests E2E avec Playwright ou Cypress
- [ ] Tests de performance
- [ ] Tests de sécurité
- [ ] Augmenter la couverture à 80%+

---

## 💡 Contribuer

Pour ajouter des tests :

1. Crée un fichier `*.test.js` dans `tests/unit/` ou `tests/integration/`
2. Écris tes tests avec Jest
3. Lance `npm test` pour vérifier
4. Commit et push

Les tests sont automatiquement lancés par la CI !
