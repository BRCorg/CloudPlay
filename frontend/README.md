# CloudPlay Frontend

Interface utilisateur de l'application CloudPlay, construite avec React, TypeScript et Vite.

## 🛠️ Technologies

- **Framework**: React 19
- **Langage**: TypeScript
- **Build Tool**: Vite 7
- **State Management**: Redux
- **Linting**: ESLint

## 📁 Structure du projet

```
frontend/
├── public/               # Assets statiques
├── src/
│   ├── api/              # Services et appels API
│   ├── app/              # Configuration de l'application
│   ├── assets/           # Images, icônes, etc.
│   ├── components/       # Composants réutilisables (Atomic Design)
│   │   ├── atoms/        # Composants de base (boutons, inputs...)
│   │   ├── molecules/    # Groupes d'atomes
│   │   ├── organismes/   # Sections complexes
│   │   └── templates/    # Layouts de pages
│   ├── pages/            # Pages de l'application
│   │   ├── LoginPage/
│   │   ├── SignupPage/
│   │   ├── PostsPage/
│   │   └── PostsDetailPage/
│   ├── redux/            # Store et slices Redux
│   ├── routes/           # Configuration du routing
│   ├── utils/            # Fonctions utilitaires
│   ├── App.tsx           # Composant racine
│   ├── App.css           # Styles globaux
│   ├── main.tsx          # Point d'entrée
│   └── index.css         # Styles de base
├── index.html            # Template HTML
├── vite.config.ts        # Configuration Vite
├── tsconfig.json         # Configuration TypeScript
├── eslint.config.js      # Configuration ESLint
└── package.json
```

## 🚀 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn

### Étapes

1. **Installer les dépendances**
   ```bash
   cd frontend
   npm install
   ```

2. **Configurer les variables d'environnement**
   
   Créer un fichier `.env` à la racine du dossier frontend :
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Lancer en mode développement**
   ```bash
   npm run dev
   ```

4. **Build pour la production**
   ```bash
   npm run build
   npm run preview
   ```

## 📜 Scripts disponibles

`npm run dev` - Lance le serveur de développement avec HMR 

`npm run build` - Compile TypeScript et build pour la production 

`npm run preview` - Prévisualise le build de production 

`npm run lint` - Vérifie le code avec ESLint 

## 🎨 Architecture des composants (Atomic Design)

Le projet utilise l'architecture **Atomic Design** pour organiser les composants :

- **Atoms** : Composants de base indivisibles (Button, Input, Label...)
- **Molecules** : Combinaisons d'atoms (SearchBar, FormField...)
- **Organismes** : Sections complètes (Header, PostCard, CommentList...)
- **Templates** : Layouts et structures de pages

## 📄 Pages

| Page | Description |
|------|-------------|
| `LoginPage` | Page de connexion |
| `SignupPage` | Page d'inscription |
| `PostsPage` | Liste des posts |
| `PostsDetailPage` | Détail d'un post avec commentaires |

## 📦 Dépendances principales

- `react` - Bibliothèque UI
- `react-dom` - Rendu DOM pour React
- `vite` - Build tool et serveur de développement
- `typescript` - Typage statique
- `eslint` - Linting du code

## 🖼️ Upload d'images (flux recommandé)

Le frontend suit le pattern suivant pour les images (avatar ou image de post) :

1. Uploader l'image séparément en `POST` vers l'endpoint d'upload (`/api/upload/avatar` ou `/api/upload/post`) avec un `FormData` contenant le champ `file`.
2. Le backend renvoie `201` et un objet `{ url, filename }` (URL publique vers `/uploads/<filename>`).
3. Inclure la `url` reçue dans le payload JSON lors de la création de l'entité (ex: `avatar` pour l'inscription, `image` pour le post).

Exemple minimal (axios) :
```ts
const form = new FormData()
form.append('file', file)
const uploadRes = await axios.post(`${import.meta.env.VITE_API_URL}/upload/avatar`, form)
const avatarUrl = uploadRes.data.url
await axios.post(`${import.meta.env.VITE_API_URL}/register`, { username, email, password, avatar: avatarUrl })
```

Remarques :
- L'API attend le champ `file` (middleware `.single('file')`).
- Le code client peut aussi envoyer directement un `FormData` contenant tous les champs (champs textes + `file`) si le backend applique le middleware d'upload sur la route cible.
- Pour la redirection côté client, utilisez `react-router` (`useNavigate`) ou `window.location.href`.

## 🔧 Configuration ESLint

Le projet utilise ESLint avec les plugins suivants :
- `eslint-plugin-react-hooks` - Règles pour les hooks React
- `eslint-plugin-react-refresh` - Support du Fast Refresh

## 📝 License

ISC  

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
