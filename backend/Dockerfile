# Simple backend setup - no hot reload
FROM tomcat:9-jdk11

# Install Maven and remove default apps
RUN apt-get update && apt-get install -y maven && rm -rf /usr/local/tomcat/webapps/*

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline -f pom.xml

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Deploy to Tomcat
RUN cp target/*.war /usr/local/tomcat/webapps/ROOT.war

# Configure Tomcat port
RUN sed -i 's/8080/8081/g' /usr/local/tomcat/conf/server.xml

EXPOSE 8081

# Start Tomcat normally
CMD ["catalina.sh", "run"]