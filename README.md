# FixManager

## Demarrage avec Docker

Prerequis : Docker et Docker Compose.

1. Creer le fichier local de variables d'environnement :

	```bash
	cp .env.example .env
	```

2. Modifier les mots de passe dans `.env` si necessaire. Le fichier `.env` reste local et ne doit pas etre pousse sur GitHub.

3. Construire et demarrer MySQL et le backend :

	```bash
	docker compose up -d --build
	```

	Le backend attend que MySQL soit healthy avant de demarrer. Il est accessible sur `http://localhost:8080`.

4. Verifier l'etat des services et les logs :

	```bash
	docker compose ps
	docker compose logs -f backend
	```

La base est conservee dans le volume Docker `fixmanager_mysql_data`. Arreter les conteneurs avec `docker compose down` ne supprime donc pas les donnees. Pour repartir d'une base vide, utiliser explicitement `docker compose down -v`.

## Developpement du backend hors Docker

MySQL peut rester dans Docker :

```bash
docker compose up -d mysql
cd backend/fixmanager-backend
./mvnw spring-boot:run
```

Les valeurs par defaut de Spring utilisent `localhost:3306`. Si le port defini dans `.env` est different (par exemple `3307` lorsque MySQL local occupe `3306`), surcharger `SPRING_DATASOURCE_URL` avec le port choisi. Les identifiants peuvent aussi etre surchargees avec `SPRING_DATASOURCE_USERNAME` et `SPRING_DATASOURCE_PASSWORD`.

## Travail en equipe

Apres clonage du projet, chaque developpeur doit copier `.env.example` vers `.env`, puis lancer `docker compose up -d --build`. Les donnees MySQL sont locales a chaque machine ; le volume n'est pas versionne dans Git.
