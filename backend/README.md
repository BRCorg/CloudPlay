# CloudPlay Backend

API REST pour l'application CloudPlay, construite avec Node.js, Express et TypeScript.

## 🛠️ Technologies

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Langage**: TypeScript
- **Base de données**: MongoDB (Mongoose)
- **Authentification**: JWT (JSON Web Tokens)
- **Sécurité**: bcryptjs pour le hachage des mots de passe
- **Upload de fichiers**: Multer

## 📁 Structure du projet

```
backend/
├── config/           # Configuration (DB, variables d'environnement)
├── controllers/      # Logique métier
│   ├── authController.ts
│   └── postsController.ts
├── middlewares/      # Middlewares Express
├── models/           # Modèles Mongoose
│   ├── User.ts
│   ├── Post.ts
│   └── Commentaire.ts
├── routes/           # Définition des routes API
│   ├── authRoutes.ts
│   ├── postsRoutes.ts
│   └── commentsRoutes.ts
├── utils/            # Utilitaires et helpers
├── server.ts         # Point d'entrée de l'application
├── tsconfig.json     # Configuration TypeScript
└── package.json
```

## 🚀 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MongoDB (local ou Atlas)

### Étapes

1. **Installer les dépendances**
   ```bash
   cd backend
   npm install
   ```

2. **Configurer les variables d'environnement**
   
   Créer un fichier `.env` à la racine du dossier backend :
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cloudplay
   JWT_SECRET=votre_secret_jwt
   ```

3. **Lancer en mode développement**
   ```bash
   npm run dev
   ```

4. **Build pour la production**
   ```bash
   npm run build
   npm start
   ```

## 📜 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Lance le serveur en mode développement avec hot-reload |
| `npm run build` | Compile le TypeScript en JavaScript |
| `npm start` | Lance le serveur de production |
| `npm test` | Lance les tests |

## 🔗 Endpoints API

### Authentification (`/api/auth`)
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/register` | Inscription d'un nouvel utilisateur |
| POST | `/login` | Connexion utilisateur |
| POST | `/logout` | Déconnexion |

### Posts (`/api/posts`)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Récupérer tous les posts |
| GET | `/:id` | Récupérer un post par ID |
| POST | `/` | Créer un nouveau post |
| PUT | `/:id` | Modifier un post |
| DELETE | `/:id` | Supprimer un post |

### Commentaires (`/api/comments`)
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/:postId` | Récupérer les commentaires d'un post |
| POST | `/` | Ajouter un commentaire |
| DELETE | `/:id` | Supprimer un commentaire |

## 📦 Dépendances principales

- `express` - Framework web
- `mongoose` - ODM MongoDB
- `jsonwebtoken` - Gestion des tokens JWT
- `bcryptjs` - Hachage de mots de passe
- `cors` - Gestion des requêtes cross-origin
- `dotenv` - Variables d'environnement
- `multer` - Upload de fichiers
- `axios` - Client HTTP
- `cookie-parser` - Parsing des cookies

## 🔐 Sécurité

- Mots de passe hashés avec bcryptjs
- Authentification via JWT
- Protection CORS configurée
- Variables sensibles dans `.env` (non versionnées)

## 📝 License

ISC
