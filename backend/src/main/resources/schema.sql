-- RAF Event Booker Database Schema
-- Drop existing tables in correct order (reverse foreign key dependencies)
DROP TABLE IF EXISTS rsvp;
DROP TABLE IF EXISTS comment;
DROP TABLE IF EXISTS event_tag;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS tag;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS user;

-- Create Users table
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_type ENUM('event creator', 'admin') NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    hashed_password VARCHAR(255) NOT NULL,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_status (status)
);

-- Create Categories table
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    INDEX idx_name (name)
);

-- Create Tags table
CREATE TABLE tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    INDEX idx_name (name)
);

-- Create Events table
CREATE TABLE event (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_date TIMESTAMP NULL,
    location VARCHAR(255) NOT NULL,
    views INT DEFAULT 0,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    author_id INT NOT NULL,
    category_id INT NOT NULL,
    max_capacity INT NULL, -- NULL means unlimited capacity
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT,
    INDEX idx_author (author_id),
    INDEX idx_category (category_id),
    INDEX idx_created_at (created_at),
    INDEX idx_event_date (event_date),
    INDEX idx_views (views),
    INDEX idx_reactions (like_count, dislike_count)
);

-- Create Event-Tag junction table (many-to-many relationship)
CREATE TABLE event_tag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_tag (event_id, tag_id),
    INDEX idx_event (event_id),
    INDEX idx_tag (tag_id)
);

-- Create Comments table
CREATE TABLE comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_id INT NOT NULL,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
    INDEX idx_event (event_id),
    INDEX idx_created_at (created_at)
);

-- Create RSVP table
CREATE TABLE rsvp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_identifier VARCHAR(255) NOT NULL, -- Can be email or user ID
    event_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (user_identifier, event_id),
    INDEX idx_event (event_id),
    INDEX idx_user (user_identifier),
    INDEX idx_registration_date (registration_date)
);

-- Insert initial admin user (as required by specification)
-- Password is hashed version of "admin123" - you should change this
INSERT INTO user (email, first_name, last_name, user_type, status, hashed_password) 
VALUES ('admin@raf.rs', 'Admin', 'User', 'admin', 'active', '$2a$10$Xl0yhvzLIaJCDdKBS.Wc4eLjdHnlDTGNxd5YWr6DYfg6mh6VfNyNa');

-- Insert some sample categories
INSERT INTO category (name, description) VALUES 
('Koncerti', 'Muzicki dogadjaji, koncerti i festivali'),
('Konferencije', 'Poslovne konferencije, seminari i predavanja'),
('Radionice', 'Edukativne radionice i kursevi'),
('Sport', 'Sportski dogadjaji i takmicenja'),
('Kultura', 'Kulturni dogadjaji, izlozbe i predstave');

-- Insert some sample tags
INSERT INTO tag (name) VALUES 
('muzika'), ('rock'), ('pop'), ('jazz'), ('elektronska'),
('IT'), ('startup'), ('networking'), ('edukacija'), ('poslovanje'),
('fotografija'), ('kuvanje'), ('umetnost'), ('dizajn'), ('programiranje'),
('fudbal'), ('kosarka'), ('tenis'), ('trcanje'), ('fitness'),
('teatar'), ('film'), ('knjizevnost'), ('istorija'), ('nauka');