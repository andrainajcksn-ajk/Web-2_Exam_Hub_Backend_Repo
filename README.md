
## Installation

```bash
npm install
```

## Configuration

```bash
cp .env.example .env
# adaptez les valeurs (DB_*, JWT_SECRET, PORT)
```

## Base de données

```bash
docker compose up -d
psql -h localhost -U examhub -d examhub -f database.sql
psql -h localhost -U examhub -d examhub -f alters.sql
psql -h localhost -U examhub -d examhub -f inserts.sql
```

Comptes de démo :

```bash
npm run seed
```

## Lancement

```bash
npm run dev        
npm run build      
npm start         
```

API accessible sur `http://localhost:3001/api`.

## Liste des endpoints

| Méthode | Route | Rôle |
| ------- | ----- | ---- |
| POST | `/api/auth/login` | public |
| GET/POST/PUT/DELETE | `/api/students[/:id]` | admin |
| GET/POST/PUT/DELETE | `/api/courses[/:id]` | admin |
| GET/POST/PUT/DELETE | `/api/exams[/:id]` | admin |
| POST | `/api/exams/:id/questions` | admin |
| PUT/DELETE | `/api/questions/:id` | admin |
| GET | `/api/exams/:id/results` | admin |
| GET | `/api/my/exams` | student |
| GET | `/api/my/exams/:id` | student |
| POST | `/api/my/exams/:id/submit` | student |
| GET | `/api/my/results` | student |

Authentification : en-tête `Authorization: Bearer <token>`.