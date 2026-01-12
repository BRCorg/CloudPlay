# CloudPlay - Documentation

## 📊 Schéma de la Base de Données

```
+----------------+       +------------------+
|     User       |       |      Post        |
+----------------+       +------------------+
| _id: ObjectId  |<----->| author: ObjectId (ref User)
| email: string  |       | title: string
| password: string       | content: string
| username: string       | image?: string
| avatar?: string        | likes: [ObjectId] (ref User)
| createdAt: Date|       | createdAt: Date
+----------------+       | updatedAt: Date
                         +------------------+
                                  |
                                  |
                         +------------------+
                         |    Comment       |
                         +------------------+
                         | _id: ObjectId    |
                         | content: string  |
                         | author: ObjectId (ref User)
                         | post: ObjectId (ref Post)
                         | createdAt: Date  |
                         +------------------+
```

## 🔗 Relations

| Relation | Description |
|----------|-------------|
| **User → Post** | Un utilisateur peut créer plusieurs posts (1:N) |
| **User → Comment** | Un utilisateur peut écrire plusieurs commentaires (1:N) |
| **Post → Comment** | Un post peut avoir plusieurs commentaires (1:N) |
| **User → Post (likes)** | Un utilisateur peut liker plusieurs posts (N:N) |

## 📋 Modèles

### User
| Champ | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Identifiant unique |
| `email` | string | Email de l'utilisateur (unique) |
| `password` | string | Mot de passe hashé |
| `username` | string | Nom d'utilisateur |
| `avatar` | string? | URL de l'avatar (optionnel) |
| `createdAt` | Date | Date de création du compte |

### Post
| Champ | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Identifiant unique |
| `author` | ObjectId | Référence vers l'utilisateur auteur |
| `title` | string | Titre du post |
| `content` | string | Contenu du post |
| `image` | string? | URL de l'image (optionnel) |
| `likes` | ObjectId[] | Liste des utilisateurs ayant liké |
| `createdAt` | Date | Date de création |
| `updatedAt` | Date | Date de dernière modification |

### Comment
| Champ | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Identifiant unique |
| `content` | string | Contenu du commentaire |
| `author` | ObjectId | Référence vers l'utilisateur auteur |
| `post` | ObjectId | Référence vers le post commenté |
| `createdAt` | Date | Date de création |