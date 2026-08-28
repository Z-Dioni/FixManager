# Étape 1 : build avec Maven
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copie des fichiers de définition du projet
COPY pom.xml .
# Si tu as un pom.xml, sinon adapte (ex: build.gradle)

# Copie du code source
COPY src ./src

# Build sans tests (pour aller vite en dev)
RUN mvn -DskipTests clean package

# Étape 2 : image légère pour l'exécution
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copie du jar généré
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]