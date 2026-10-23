FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

COPY . .

RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw -DskipTests clean package

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
