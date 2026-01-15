# Révision React CloudPlay

## 1. Authentification

**Q : Comment l’état d’authentification est-il géré côté front ?**
R : Via Redux (`authSlice`), qui stocke l’utilisateur, le statut d’authentification et gère les actions asynchrones (login, logout, fetchMe).

**Q : Comment le front vérifie si l’utilisateur est connecté ?**
R : Il lit `isAuthenticated` et `user` dans le state Redux. Après chaque action (login, logout, fetchMe), ces valeurs sont mises à jour.

**Q : Que fait la fonction de logout ?**
R : Elle appelle l’API `/api/auth/logout`, supprime le cookie côté backend, puis rafraîchit l’état utilisateur avec `fetchMe`.

**Q : Pourquoi faut-il que les options du cookie soient identiques pour login et logout ?**
R : Sinon, le cookie n’est pas supprimé correctement et l’utilisateur reste connecté.

---

## 2. Navigation et Routing

**Q : Comment la navigation est-elle gérée ?**
R : Avec `react-router-dom` (`useNavigate`, `<Routes>`, `<Route>`). Les pages sont dans `src/pages/`.

**Q : Comment protéger une route ?**
R : Avec le composant `ProtectedRoute`, qui vérifie l’état d’authentification avant d’afficher la page.

---

## 3. Composants et Structure

**Q : Quelle est la structure des composants ?**
R :
- Atoms : éléments UI simples (Button, Input, Avatar...)
- Molecules : combinaisons d’atoms (CommentForm, LikeButton...)
- Organisms : sections complètes (Header, Footer, CommentList...)
- Templates : layouts de page (MainLayout, ProfileLayout)

**Q : Comment passer des props à un composant ?**
R : En définissant les props dans le composant et en les passant lors de l’utilisation, ex : `<Header user={user} onLogout={handleLogout} />`

---

## 4. Appels API

**Q : Comment sont faits les appels API ?**
R : Avec Axios, via le fichier `apiGlobal.ts`. Les requêtes incluent `withCredentials: true` pour les cookies.

**Q : Comment gérer les erreurs d’API ?**
R : Les erreurs sont capturées dans les thunks Redux et stockées dans le state (`error`).

---

## 5. Gestion des formulaires

**Q : Comment valider un formulaire côté front ?**
R : Avec des fonctions utilitaires (ex : `getFieldError.ts`) et la gestion des erreurs dans le state Redux.

**Q : Comment afficher une erreur de champ ?**
R : En lisant l’objet `error.details` du state et en affichant le message sous le champ concerné.

---

## 6. Backend Express

**Q : Comment le backend gère l’authentification ?**
R : Avec JWT stocké dans un cookie HttpOnly. Les routes protégées utilisent le middleware `authMiddleware`.

**Q : Comment le backend valide les données ?**
R : Avec Zod (`.parse()`), qui lance une erreur en cas de données invalides.

**Q : Comment le backend gère la déconnexion ?**
R : Il supprime le cookie avec `res.clearCookie("token", cookieOptions)`.

---

## 7. Pratique : Scénarios

**Q : Que faire si le logout ne fonctionne pas ?**
R : Vérifier que les options du cookie sont identiques pour la création et la suppression, et que le front rafraîchit bien l’état après logout.

**Q : Comment ajouter une nouvelle page ?**
R : Créer un dossier dans `src/pages/`, ajouter le composant, puis ajouter la route dans `AppRoutes.tsx`.

**Q : Comment ajouter un nouveau champ à l’utilisateur ?**
R : Modifier le modèle Mongoose, adapter le contrôleur backend, puis mettre à jour le Redux et les composants front.

---

## 8. Debug

**Q : Comment déboguer un problème d’authentification ?**
R :
- Vérifier le cookie dans le navigateur
- Vérifier le state Redux
- Vérifier la réponse de l’API
- Vérifier les options du cookie côté backend

---

## 9. Conseils

- Toujours synchroniser le front et le backend sur la gestion des cookies
- Utiliser des middlewares pour la validation et la gestion des erreurs
- Organiser les composants par atomic design pour la réutilisabilité
- Utiliser Redux pour centraliser l’état global

---

**Bonne révision !**
