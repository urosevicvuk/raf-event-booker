# Database Setup Guide

## Prerequisites
- MySQL Server 8.0+ installed and running
- MySQL client or workbench for running SQL scripts

## Setup Steps

### 1. Create Database
```sql
CREATE DATABASE raf_event_booker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Create Database User (Optional but recommended)
```sql
CREATE USER 'raf_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON raf_event_booker.* TO 'raf_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Run Schema Script
```sql
USE raf_event_booker;
SOURCE backend/src/main/resources/schema.sql;
```

### 4. Configure Database Connection
1. Copy the template: 
   ```bash
   cp backend/src/main/resources/database.properties.example backend/src/main/resources/database.properties
   ```

2. Edit `database.properties` with your credentials:
   ```properties
   db.host=localhost
   db.port=3306
   db.name=raf_event_booker
   db.username=raf_user
   db.password=your_secure_password
   ```

### 5. Verify Setup
After running the schema, you should have:
- ✅ Admin user: `admin@raf.rs` / `admin123`
- ✅ 5 sample categories
- ✅ 25 sample tags
- ✅ All required tables with proper relationships

## Security Notes
- **NEVER** commit `database.properties` to git
- Change the default admin password after first login
- Use strong passwords for database users
- Consider using environment variables in production

## Troubleshooting
- If connection fails, check MySQL service is running
- Verify firewall settings allow connection to port 3306
- Check MySQL error logs for detailed error messages