# Exam Hub — Backend API

API REST du projet **Exam Hub** (examen de WEB2). Elle gère l'authentification, les cours, les examens, les questions, les tentatives d'examen et les résultats. Backend pensé pour être consommé par le frontend **Web-2_Exam_Hub_Frontend_Repo** (React + Vite).

## Stack technique

- Node.js (≥ 18)
- TypeScript 7
- Express 5
- PostgreSQL (driver `pg`)
- JWT (authentification)
- bcrypt (hachage des mots de passe)

## Prérequis

- Node.js ≥ 18 installé
- PostgreSQL ou Docker disponible

## Installation

```bash
npm install
```

## Configuration des variables d'environnement

Copiez le fichier `.env.example` vers `.env` puis adaptez les valeurs :

```bash
cp .env.example .env
```

| Variable           | Description                                  | Défaut               |
| ------------------ | -------------------------------------------- | -------------------- |
| `DB_HOST`          | Hôte PostgreSQL                              | `localhost`          |
| `DB_PORT`          | Port PostgreSQL                              | `5432`               |
| `DB_NAME`          | Nom de la base                               | `examhub`            |
| `DB_USER`          | Utilisateur de la base                       | `examhub`            |
| `DB_PASSWORD`      | Mot de passe de la base                      | `examhub123`         |
| `JWT_SECRET`       | Secret de signature des JWT                  | `dev_secret_change_me` |
| `JWT_EXPIRES_IN`   | Durée de validité du token                   | `24h`                |
| `PORT`             | Port du serveur API                          | `3001`               |

> ⚠️ En production, changez absolument `JWT_SECRET`.

## Base de données

### 1. Démarrage de PostgreSQL (option Docker)

```bash
docker compose up -d
```

### 2. Création du schéma

Appliquez les scripts SQL dans cet ordre :

1. `database.sql` — création des tables
2. `alters.sql` — contraintes (clés étrangères, unicité, checks)
3. `inserts.sql` — jeux de données de démonstration (optionnel)

Exemple :

```bash
psql -h localhost -U examhub -d examhub -f database.sql
psql -h localhost -U examhub -d examhub -f alters.sql
psql -h localhost -U examhub -d examhub -f inserts.sql
```

### 3. Comptes de démonstration (seed)

```bash
npm run seed
```

Le script crée :

| Rôle    | Email                          | Mot de passe |
| ------- | ------------------------------ | ------------ |
| Admin   | `admin@examhub.local`          | `admin123`   |
| Étudiant| `jean.rakoto@examhub.local`    | `student123` |
| Étudiant| `miora.andry@examhub.local`    | `student123` |

> Les emails/mots de passe peuvent être surchargés via `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`.

## Lancement du serveur

```bash
# Développement (rechargement automatique)
npm run dev

# Compilation TypeScript
npm run build

# Production (après build)
npm start
```

Le serveur écoute par défaut sur **http://localhost:3001**, préfixe `http://localhost:3001/api`.

## Authentification

La plupart des routes exigent un JWT dans l'en-tête :

```
Authorization: Bearer <token>
```

Les rôles sont vérifiés côté serveur :

- **admin** : gestion des étudiants, cours, examens, questions et résultats
- **student** : examens disponibles, soumission des tentatives, résultats personnels

Les erreurs sont renvoyées au format `{ "message": "..." }` avec le bon code HTTP (400, 401, 403, 404, 409, 500).

## Endpoints de l'API

### Authentification (publique)

| Méthode | Route           | Description                        |
| ------- | --------------- | ---------------------------------- |
| POST    | `/api/auth/login` | Connexion (email + password) → `{ token, user }` |

### Étudiants (admin uniquement)

| Méthode | Route             | Description                          |
| ------- | ----------------- | ------------------------------------ |
| GET     | `/api/students`     | Liste des étudiants                  |
| POST    | `/api/students`     | Créer un étudiant `{ name, email, password }` |
| PUT     | `/api/students/:id` | Modifier `{ name, email, is_active, password? }` |
| DELETE  | `/api/students/:id` | Désactiver le compte                 |

### Cours (admin uniquement)

| Méthode | Route           | Description                          |
| ------- | --------------- | ------------------------------------ |
| GET     | `/api/courses`    | Liste des cours (avec `exam_count`)  |
| POST    | `/api/courses`    | Créer `{ code, name, description? }` |
| PUT     | `/api/courses/:id`| Modifier un cours                    |
| DELETE  | `/api/courses/:id`| Supprimer (refusée si examens liés)  |

### Examens (admin uniquement)

| Méthode | Route                   | Description                                    |
| ------- | ----------------------- | ---------------------------------------------- |
| GET     | `/api/exams`              | Liste des examens (cours, nb questions, nb tentatives) |
| GET     | `/api/exams/:id`          | Détail d'un examen                           |
| POST    | `/api/exams`              | Créer `{ course_id, title, description?, starts_at, ends_at }` |
| PUT     | `/api/exams/:id`          | Modifier un examen                            |
| DELETE  | `/api/exams/:id`          | Supprimer (refusée si tentatives)             |
| GET     | `/api/exams/:id/questions`| Questions d'un examen avec les choix         |
| POST    | `/api/exams/:id/questions`| Ajouter une question `{ statement, points, choices[] }` |
| GET     | `/api/exams/:id/results`  | Résultats de l'examen (moyenne, tentatives)   |

### Questions (admin uniquement)

| Méthode | Route               | Description                 |
| ------- | ------------------- | --------------------------- |
| PUT     | `/api/questions/:id`  | Modifier une question       |
| DELETE  | `/api/questions/:id`  | Supprimer une question      |

### Espace étudiant (étudiant uniquement)

| Méthode | Route                     | Description                                   |
| ------- | ------------------------- | --------------------------------------------- |
| GET     | `/api/my/exams`             | Examens disponibles (à passer)                |
| GET     | `/api/my/exams/:id`         | Détail d'un examen (choix **sans** `is_correct`) |
| POST    | `/api/my/exams/:id/submit`  | Soumettre `{ answers: [{ question_id, choice_id }] }` → `{ score, total_points, correction }` |
| GET     | `/api/my/results`           | Résultats de l'étudiant connecté              |

## Règles métier (RG)

- `RG-06` : la note est calculée uniquement côté serveur à la soumission.
- `RG-07` : un étudiant ne voit jamais la bonne réponse avant soumission.
- `RG-08` : un examen ayant des tentatives verrouille ses questions.
- Un étudiant ne peut passer un même examen qu'une seule fois.
- Une question doit avoir entre 2 et 6 choix, dont exactement 1 correct.

## Association avec le frontend

Le frontend (React/Vite) doit appeler `http://localhost:3001/api`.

Dans le frontend, configurez la variable Vite :

```
VITE_API_URL=http://localhost:3001/api
```

Toutes les routes du frontend sont couvertes par cette API : login, étudiants, cours, examens, questions, soumission d'examen et résultats.