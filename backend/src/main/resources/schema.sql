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
('Kultura', 'Kulturni dogadjaji, izlozbe i predstave'),
('Edukacija', 'Edukativni dogadjaji, kursevi i radionice'),
('Hrana i Lifestyle', 'Gastronomski dogadjaji, wellness i lifestyle aktivnosti'),
('Zajednica', 'Drustveni i humanitarni dogadjaji');

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

-- Insert additional 20+ events for comprehensive testing (reaching 30+ total)
INSERT INTO event (title, description, created_at, event_date, location, views, like_count, dislike_count, author_id, category_id, max_capacity) VALUES 
-- Tech events
('Vue.js Masterclass', 'Advanced Vue.js techniques for professional developers. Learn composition API, Pinia state management, and testing strategies.', '2025-08-05 09:00:00', '2025-08-25 10:00:00', 'Innovation Hub, Novi Sad', 45, 12, 1, 3, 1, 40),
('Blockchain Workshop', 'Hands-on blockchain development with Ethereum and Solidity. Build your first DApp from scratch.', '2025-08-06 10:30:00', '2025-08-28 14:00:00', 'TechPark, Kragujevac', 38, 15, 0, 3, 1, 25),
('Cybersecurity Summit', 'Latest trends in cybersecurity, ethical hacking demonstrations, and network security best practices.', '2025-08-07 11:00:00', '2025-09-05 09:00:00', 'SecureTech Center, Belgrade', 67, 23, 2, 4, 1, 100),

-- Sports events  
('Tennis Tournament', 'Amateur tennis tournament for all skill levels. Registration includes equipment rental and refreshments.', '2025-08-08 12:00:00', '2025-08-30 08:00:00', 'Partizan Tennis Club, Belgrade', 89, 34, 3, 2, 2, 32),
('Swimming Competition', 'Regional swimming championship with multiple categories. Professional timing and medals for winners.', '2025-08-09 13:00:00', '2025-09-10 09:00:00', 'Aqua Center, Novi Sad', 56, 19, 1, 2, 2, 150),
('Volleyball League Finals', 'Championship match between top regional teams. Food trucks and live music before the game.', '2025-08-10 14:00:00', '2025-09-15 19:00:00', 'Sports Arena, Niš', 78, 28, 4, 2, 2, 500),

-- Cultural events
('Shakespeare Festival', 'Three-day festival featuring Romeo and Juliet, Macbeth, and Othello performed by local theater groups.', '2025-08-11 15:00:00', '2025-09-20 18:00:00', 'National Theater, Belgrade', 123, 45, 2, 1, 3, 200),
('Modern Art Exhibition', 'Contemporary Serbian artists showcase their latest works. Interactive installations and artist talks included.', '2025-08-12 16:00:00', '2025-09-25 17:00:00', 'Gallery of Fine Arts, Novi Sad', 67, 22, 1, 1, 3, 80),
('Poetry Reading Night', 'Local poets present their work in an intimate coffee shop setting. Open mic session for attendees.', '2025-08-13 17:00:00', '2025-08-26 20:00:00', 'Literary Café, Belgrade', 34, 11, 0, 1, 3, 30),

-- Music events
('Classical Symphony', 'Belgrade Philharmonic performs Beethoven\'s 9th Symphony with guest soloists from Vienna Opera.', '2025-08-14 18:00:00', '2025-09-12 20:00:00', 'Sava Center, Belgrade', 145, 67, 3, 1, 4, 800),
('Indie Rock Festival', 'Three stages featuring local indie bands, food vendors, and art installations in the park setting.', '2025-08-15 19:00:00', '2025-09-18 16:00:00', 'Kalemegdan Park, Belgrade', 234, 89, 12, 1, 4, 1000),
('Acoustic Guitar Workshop', 'Learn fingerpicking techniques and chord progressions from professional guitarist Ana Popović.', '2025-08-16 20:00:00', '2025-08-27 15:00:00', 'Music School, Novi Sad', 23, 8, 0, 3, 4, 15),

-- Business & Networking
('Startup Pitch Night', 'Local entrepreneurs present their business ideas to investors and mentors. Networking dinner included.', '2025-08-17 09:30:00', '2025-09-08 18:00:00', 'Business Incubator, Belgrade', 78, 25, 1, 4, 5, 60),
('Digital Marketing Seminar', 'Social media strategies, SEO optimization, and content creation for small businesses.', '2025-08-18 10:30:00', '2025-09-22 14:00:00', 'Chamber of Commerce, Novi Sad', 56, 18, 2, 4, 5, 45),
('Women in Tech Meetup', 'Panel discussion with successful women in technology, followed by networking and mentorship opportunities.', '2025-08-19 11:30:00', '2025-09-03 17:00:00', 'Co-working Space, Belgrade', 67, 29, 0, 3, 5, 50),

-- Educational workshops  
('3D Printing Workshop', 'Introduction to 3D modeling and printing. Create your own objects using professional equipment.', '2025-08-20 12:30:00', '2025-08-29 10:00:00', 'Maker Space, Kragujevac', 45, 16, 1, 3, 6, 20),
('Language Exchange', 'Practice English, German, and French with native speakers in casual conversation groups.', '2025-08-21 13:30:00', '2025-09-07 16:00:00', 'Language Center, Belgrade', 34, 12, 0, 3, 6, 40),
('Robotics for Kids', 'Children aged 8-14 learn basic robotics and programming using LEGO Mindstorms kits.', '2025-08-22 14:30:00', '2025-09-14 11:00:00', 'Science Center, Novi Sad', 67, 23, 1, 3, 6, 25),

-- Food & Lifestyle
('Wine Tasting Evening', 'Sample premium Serbian wines paired with local cheeses and traditional appetizers.', '2025-08-23 15:30:00', '2025-09-06 19:00:00', 'Vinoteka, Belgrade', 89, 31, 2, 1, 7, 35),
('Yoga in the Park', 'Morning yoga session for all levels in beautiful park setting. Mats and props provided.', '2025-08-24 16:30:00', '2025-08-31 07:00:00', 'Tašmajdan Park, Belgrade', 56, 24, 1, 2, 7, 50),
('Craft Beer Festival', 'Local craft breweries showcase their specialty beers with live music and food trucks.', '2025-08-25 17:30:00', '2025-09-21 17:00:00', 'Beton Hala, Belgrade', 123, 45, 8, 1, 7, 300),

-- Community events
('Charity Marathon', '10K run to raise funds for local animal shelter. Registration includes t-shirt and post-race meal.', '2025-08-26 18:30:00', '2025-09-28 08:00:00', 'Ada Ciganlija, Belgrade', 145, 67, 2, 2, 8, 500),
('Book Club Meeting', 'Monthly discussion of "The Forty Rules of Love" by Elif Shafak. Coffee and pastries provided.', '2025-08-27 19:30:00', '2025-09-04 18:00:00', 'City Library, Novi Sad', 23, 9, 0, 1, 8, 20),
('Community Garden Workshop', 'Learn sustainable gardening techniques and help plant vegetables for local food bank.', '2025-08-28 20:30:00', '2025-09-11 10:00:00', 'Green Space, Zemun', 34, 14, 1, 3, 8, 30);

-- Insert additional tags for new events
INSERT INTO tag (name) VALUES 
('vue.js'), ('blockchain'), ('solidity'), ('cybersecurity'), ('tennis'), ('swimming'), 
('volleyball'), ('shakespeare'), ('contemporary-art'), ('poetry'), ('symphony'), 
('indie-rock'), ('acoustic'), ('digital-marketing'), ('women-in-tech'),
('3d-printing'), ('language-exchange'), ('robotics'), ('wine-tasting'), ('yoga'),
('craft-beer'), ('charity'), ('book-club'), ('gardening');

-- Link new events with appropriate tags (continuing from event ID 13)
INSERT INTO event_tag (event_id, tag_id) VALUES 
-- Vue.js Masterclass (13)
(13, 26), (13, 6), (13, 15),
-- Blockchain Workshop (14) 
(14, 27), (14, 28), (14, 6),
-- Cybersecurity Summit (15)
(15, 29), (15, 7), (15, 6),
-- Tennis Tournament (16)
(16, 30), (16, 20),
-- Swimming Competition (17)
(17, 31), (17, 20), (17, 19),
-- Volleyball League Finals (18)  
(18, 32), (18, 20),
-- Shakespeare Festival (19)
(19, 33), (19, 21), (19, 13),
-- Modern Art Exhibition (20)
(20, 34), (20, 13), (20, 11),
-- Poetry Reading Night (21)
(21, 35), (21, 13), (21, 23),
-- Classical Symphony (22)
(22, 36), (22, 1), (22, 4),
-- Indie Rock Festival (23)
(23, 37), (23, 1), (23, 5),
-- Acoustic Guitar Workshop (24)
(24, 38), (24, 1), (24, 9),
-- Startup Pitch Night (25)
(25, 39), (25, 10), (25, 6),
-- Digital Marketing Seminar (26)
(26, 40), (26, 10), (26, 7),
-- Women in Tech Meetup (27)
(27, 41), (27, 6), (27, 10),
-- 3D Printing Workshop (28)
(28, 42), (28, 15), (28, 9),
-- Language Exchange (29)
(29, 43), (29, 9), (29, 23),
-- Robotics for Kids (30)
(30, 44), (30, 15), (30, 9),
-- Wine Tasting Evening (31)
(31, 45), (31, 12), (31, 4),
-- Yoga in the Park (32)
(32, 46), (32, 19), (32, 18),
-- Craft Beer Festival (33)
(33, 47), (33, 1), (33, 5),
-- Charity Marathon (34)
(34, 48), (34, 19), (34, 20),
-- Book Club Meeting (35)
(35, 49), (35, 23), (35, 13),
-- Community Garden Workshop (36)
(36, 49), (36, 9), (36, 18);

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