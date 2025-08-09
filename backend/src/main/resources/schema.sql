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
VALUES ('admin@raf.rs', 'Admin', 'User', 'admin', 'active', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');

-- Insert sample event creators
INSERT INTO user (email, first_name, last_name, user_type, status, hashed_password) VALUES 
('marko@raf.rs', 'Marko', 'Petrovic', 'event creator', 'active', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'),
('ana@raf.rs', 'Ana', 'Milic', 'event creator', 'active', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'),
('stefan@raf.rs', 'Stefan', 'Jovanovic', 'event creator', 'active', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'),
('milica@raf.rs', 'Milica', 'Nikolic', 'event creator', 'inactive', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9');

-- Insert sample categories
INSERT INTO category (name, description) VALUES 
('Koncerti', 'Muzicki dogadjaji, koncerti i festivali'),
('Konferencije', 'Poslovne konferencije, seminari i predavanja'),
('Radionice', 'Edukativne radionice i kursevi'),
('Sport', 'Sportski dogadjaji i takmicenja'),
('Kultura', 'Kulturni dogadjaji, izlozbe i predstave');

-- Insert sample tags
INSERT INTO tag (name) VALUES 
('muzika'), ('rock'), ('pop'), ('jazz'), ('elektronska'),
('IT'), ('startup'), ('networking'), ('edukacija'), ('poslovanje'),
('fotografija'), ('kuvanje'), ('umetnost'), ('dizajn'), ('programiranje'),
('fudbal'), ('kosarka'), ('tenis'), ('trcanje'), ('fitness'),
('teatar'), ('film'), ('knjizevnost'), ('istorija'), ('nauka');

-- Insert sample events with varied data for testing
INSERT INTO event (title, description, created_at, event_date, location, views, like_count, dislike_count, author_id, category_id, max_capacity) VALUES 
('Rock Koncert - The Best Band', 'Nezaboravan rock koncert sa najboljim hitovima. Podrska bend ce otvoriti vecer sa neverovatnim repertoarom. Ocekujte energicnu atmosferu i nezaboravan muzicki dozivljaj koji ce vas ostaviti bez daha.', '2025-08-01 10:00:00', '2025-08-15 20:00:00', 'Arena Belgrade', 150, 45, 3, 2, 1, 500),
('IT Konferencija 2025', 'Najveca IT konferencija u regionu. Predavanja o najnovijim tehnologijama, AI, blockchain i mnogo vise. Prisustvovace eksperti iz celog sveta koji ce podeliti svoja iskustva i najnovije trendove u industriji.', '2025-07-28 14:30:00', '2025-09-10 09:00:00', 'Sava Centar', 320, 78, 5, 1, 2, NULL),
('Radionica fotografije', 'Naucite osnove fotografije sa profesionalnim fotografom. Prakticne vezbe i saveti za bolje slike. Radionica pokriva osnovne tehnike, kompoziciju, rad sa svetlom i postprodukciju fotografija.', '2025-07-25 09:15:00', '2025-08-20 14:00:00', 'Kulturni centar Belgrade', 85, 32, 1, 2, 3, 20),
('Fudbalska utakmica - Crvena Zvezda vs Partizan', 'Veciti derbi! Najveca utakmica u srpskom fudbalu. Atmosfera stadiona, strast navijaca i borba za pobedu. Ne propustite priliku da budete deo ovog istorijskog dogadjaja.', '2025-07-20 16:45:00', '2025-08-25 18:00:00', 'Stadion Rajko Mitic', 520, 95, 12, 3, 4, 45000),
('Jazz vecer sa Vojislav Aralica Trio', 'Intimna jazz atmosfera u srcu Beograda. Vojislav Aralica i njegov trio ce vas odvesti na putovanje kroz klasicne jazz standarde i originalne kompozicije. Perfektan spoj tradicionalnog i modernog jazza.', '2025-07-22 11:20:00', '2025-08-18 21:00:00', 'Jazz Cafe', 67, 28, 2, 2, 1, 80),
('Startup Meetup Belgrade', 'Mesecni susret preduzetnika i developera. Networking, prezentacije najnovijih startapa i diskusije o buducnosti biznisa. Prilika za pronalazenje partnera, investitora ili novih clanova tima.', '2025-07-30 13:10:00', '2025-08-12 17:30:00', 'Hub 3.0', 145, 52, 3, 4, 2, 100),
('Radionica kuvanja - Italijanska kuhinja', 'Savladajte tajne autenticne italijanske kuhinje. Chef Marco ce vas nauciti kako da pripremite pasta, picu i deserte kao pravi Italijani. Uključeni svi sastojci i recept knjiga.', '2025-07-18 08:30:00', '2025-08-22 16:00:00', 'Culinary School Belgrade', 92, 41, 1, 3, 3, 25),
('Kosarkaska utakmica - Partizan vs Crvena Zvezda', 'Kosarkaska verzija vecitog derbija! Gledajte najbolje srpske kosarkase u akciji. Dinamicna igra, neverovatni potezi i borba do poslednjeg sekunda.', '2025-07-26 15:40:00', '2025-08-28 19:00:00', 'Stark Arena', 298, 67, 8, 3, 4, 18000),
('Pozorišna predstava - Hamlet', 'Klasicna Sekspirbva drama u modernoj interpretaciji. Narodno pozoriste predstavlja Hamleta u novom ruhu, sa savremenom scenografijom i kostimima. Nezaboravan kulturni dozivljaj.', '2025-07-15 12:45:00', '2025-08-30 20:00:00', 'Narodno pozorište', 134, 38, 4, 4, 5, 400),
('Elektronska muzika festival - EXIT 2025', 'Najveci muzicki festival u regionu! Tri dana nezaboravne elektronske muzike sa svetskim DJ-ovima. Dance, techno, house i svi ostali elektronski žanrovi na jednom mestu.', '2025-06-15 09:00:00', '2025-07-10 18:00:00', 'Petrovaradinska tvrđava', 1250, 234, 15, 1, 1, NULL),
('Programiranje za pocetnike - Python kurs', 'Intenzivni vikend kurs Python programiranja. Za potpune pocetnike bez prethodnog znanja. Pokrivamo osnove, rad sa bibliotekama i kreiranje prvog projekta. Sertifikat uključen.', '2025-07-29 10:15:00', '2025-08-16 10:00:00', 'IT Academy', 73, 19, 0, 2, 3, 30),
('Maraton Beograda 2025', 'Godisnji beogradski maraton! 21km kroz centar grada. Ruta prolazi pored najvažnijih znamenitosti. Registracija obavezna. Medalje za sve učesnike koji završe trku.', '2025-07-12 07:30:00', '2025-09-15 08:00:00', 'Kalemegdan - start', 456, 112, 6, 3, 4, 5000);

-- Insert event-tag relationships to create realistic tag associations
INSERT INTO event_tag (event_id, tag_id) VALUES 
-- Rock Concert tags
(1, 1), (1, 2), 
-- IT Conference tags  
(2, 6), (2, 7), (2, 8), (2, 15),
-- Photography Workshop tags
(3, 11), (3, 13), (3, 9),
-- Football Match tags
(4, 16), (4, 20),
-- Jazz Evening tags
(5, 1), (5, 4),
-- Startup Meetup tags
(6, 6), (6, 7), (6, 8), (6, 10),
-- Cooking Workshop tags
(7, 12), (7, 9),
-- Basketball Match tags
(8, 17), (8, 20),
-- Theater Play tags
(9, 21), (9, 13), (9, 23),
-- Electronic Festival tags
(10, 1), (10, 5),
-- Python Course tags
(11, 15), (11, 6), (11, 9),
-- Marathon tags
(12, 19), (12, 20);

-- Insert sample comments with realistic content
INSERT INTO comment (author_name, text, created_at, event_id, like_count, dislike_count) VALUES 
('Petar Stojanović', 'Odličan koncert! Bend je bio fantastičan, atmosfera nezaboravna. Definitivno preporučujem svima koji vole rock muziku.', '2025-08-02 14:20:00', 1, 12, 1),
('Marija Radović', 'Baš sam se zabavila na ovom događaju. Organizacija je bila perfektna, zvuk odličan. Jedva čekam sledeći koncert!', '2025-08-02 16:45:00', 1, 8, 0),
('Nikola Jovanović', 'IT konferencija godine! Predavanja su bila veoma korisna, naučio sam mnogo novih stvari o AI i blockchain tehnologijama.', '2025-07-29 09:30:00', 2, 15, 0),
('Sandra Milić', 'Odličan networking, upoznao sam mnoge zanimljive ljude iz IT industrije. Organizatori su se baš potrudili.', '2025-07-29 11:15:00', 2, 9, 0),
('Ana Petrović', 'Radionica fotografije je prevazišla sva moja očekivanja! Instruktor je bio veoma stručan i strpljiv.', '2025-07-26 10:00:00', 3, 6, 0),
('Milan Stojanović', 'Večiti derbi kakav treba da bude! Atmosfera je bila neverovatna, navijanje do poslednjeg minuta.', '2025-07-21 08:00:00', 4, 23, 2),
('Dragana Nikolić', 'Nisam očekivala da će jazz muzika biti ovako opuštajuća. Trio je bio fantastičan!', '2025-07-23 12:30:00', 5, 11, 0),
('Stefan Marković', 'Startup meetup je bio vrlo koristan. Dobre prezentacije, kvalitetne diskusije i odličan networking.', '2025-07-31 10:00:00', 6, 7, 0),
('Jovana Đorđević', 'Naučila sam mnogo o italijanskoj kuhinji. Chef Marco je bio odličan instruktor, atmosfera vrlo prijatna.', '2025-07-19 09:15:00', 7, 13, 0),
('Miloš Simić', 'Kosarkaška utakmica je bila napeta do kraja. Odličan sport i vrhunska atmosfera u hali.', '2025-07-27 11:00:00', 8, 18, 1),
('Jelena Vasić', 'Hamlet u modernoj interpretaciji - genijalno! Gluma je bila na visokom nivou, scenografija prekrasna.', '2025-07-16 15:20:00', 9, 14, 0),
('Aleksandar Milošević', 'EXIT festival je bio nezaboravan! Tri dana sjajne muzike, odlična organizacija i fantastična atmosfera.', '2025-06-16 14:00:00', 10, 45, 2),
('Tamara Jovanović', 'Python kurs je bio veoma koristan za pocetnike. Instruktor je objasnio sve jasno i razumljivo.', '2025-07-30 12:00:00', 11, 5, 0),
('Marko Đurić', 'Maraton je bio izazovan ali vredan truda. Organizacija je bila odlična, ruta kroz centar grada prekrasna.', '2025-07-13 16:30:00', 12, 8, 0),
('Sanja Popović', 'Verujem da će ovaj koncert biti još bolji od prethodnog. Jedva čekam!', '2025-08-03 18:00:00', 1, 3, 0);

-- Insert sample RSVP registrations to test capacity and registration features
INSERT INTO rsvp (user_identifier, event_id, registration_date) VALUES 
('petar.stojanovic@gmail.com', 1, '2025-08-02 10:00:00'),
('marija.radovic@yahoo.com', 1, '2025-08-02 11:30:00'),
('nikola.jovanovic@hotmail.com', 2, '2025-07-28 15:00:00'),
('sandra.milic@gmail.com', 2, '2025-07-28 16:20:00'),
('ana.petrovic@raf.rs', 3, '2025-07-25 12:00:00'),
('milan.stojanovic@gmail.com', 4, '2025-07-20 18:30:00'),
('dragana.nikolic@yahoo.com', 5, '2025-07-22 14:00:00'),
('stefan.markovic@gmail.com', 6, '2025-07-30 15:45:00'),
('jovana.djordjevic@hotmail.com', 7, '2025-07-18 10:30:00'),
('milos.simic@gmail.com', 8, '2025-07-26 17:00:00'),
('jelena.vasic@raf.rs', 9, '2025-07-15 13:20:00'),
('aleksandar.milosevic@gmail.com', 10, '2025-06-15 11:00:00'),
('tamara.jovanovic@yahoo.com', 11, '2025-07-29 12:30:00'),
('marko.djuric@gmail.com', 12, '2025-07-12 09:15:00'),
('sanja.popovic@hotmail.com', 1, '2025-08-03 19:00:00'),
-- Additional registrations for testing capacity (Photography workshop has max 20)
('student1@raf.rs', 3, '2025-07-25 13:00:00'),
('student2@raf.rs', 3, '2025-07-25 14:00:00'),
('student3@raf.rs', 3, '2025-07-25 15:00:00'),
('student4@raf.rs', 3, '2025-07-25 16:00:00'),
('student5@raf.rs', 3, '2025-07-26 09:00:00'),
-- Python course registrations (max 30)
('developer1@gmail.com', 11, '2025-07-29 13:00:00'),
('developer2@gmail.com', 11, '2025-07-29 14:00:00'),
('developer3@gmail.com', 11, '2025-07-29 15:00:00'),
('developer4@gmail.com', 11, '2025-07-30 09:00:00'),
('developer5@gmail.com', 11, '2025-07-30 10:00:00');