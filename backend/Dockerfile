# Use Tomcat 9 with JDK 11
FROM tomcat:9-jdk11

# Remove default Tomcat applications
RUN rm -rf /usr/local/tomcat/webapps/*

# Set working directory
WORKDIR /app

# Copy pom.xml first (for better Docker layer caching)
COPY pom.xml ./

# Copy Maven wrapper if it exists, otherwise use system Maven
RUN apt-get update && apt-get install -y maven

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -f pom.xml

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Copy the built WAR to Tomcat webapps as ROOT.war (context path = /)
RUN cp target/*.war /usr/local/tomcat/webapps/ROOT.war

# Configure Tomcat to run on port 8081
RUN sed -i 's/8080/8081/g' /usr/local/tomcat/conf/server.xml

# Expose port 8081
EXPOSE 8081

# Start Tomcat
CMD ["catalina.sh", "run"]