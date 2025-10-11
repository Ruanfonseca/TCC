# ======================================================
# Etapa de build - Maven + Java 11
# ======================================================
FROM maven:3.9.4-eclipse-temurin-11 AS build
WORKDIR /app

# Garante ambiente com UTF-8
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Copia apenas o POM primeiro para aproveitar cache de dependências
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia o código-fonte e faz o build sem rodar testes
COPY src ./src
RUN mvn clean package -DskipTests

# ======================================================
# Etapa de execução - Imagem leve com JRE 11
# ======================================================
FROM eclipse-temurin:11-jre
WORKDIR /app

# Copia o JAR gerado da etapa de build
COPY --from=build /app/target/*.jar consumer.jar

# Define variáveis padrão (podem ser sobrescritas)
ENV JAVA_OPTS=""
ENV SERVER_PORT=9191

# Expõe a porta do Spring Boot
EXPOSE 9191

# Executa a aplicação com Java 11 usando exec para gerenciamento correto de sinais
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar consumer.jar --server.port=$SERVER_PORT"]
