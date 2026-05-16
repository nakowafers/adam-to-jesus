-- Migration: Create disciples table
CREATE TABLE IF NOT EXISTS disciples (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT,
  location_of_death TEXT,
  year_of_death TEXT,
  method_of_death TEXT,
  narrative TEXT,
  reliability_score REAL,
  certainty_level TEXT,
  scripture_reference TEXT,
  sources TEXT -- JSON array
);

-- Seed Disciples Data
INSERT INTO disciples (id, name, symbol, location_of_death, year_of_death, method_of_death, narrative, reliability_score, certainty_level, scripture_reference, sources) VALUES
('peter', 'Simon Peter', 'Keys', 'Rome, Italy', '64-67 AD', 'Crucifixion (Upside Down)', 'Tradition holds that Peter was crucified in Rome during Nero’s persecution. At his own request, he was crucified head downward, as he felt unworthy to die in the same position as Jesus.', 92, 'High (Early Tradition)', 'John 21:18-19', '["Eusebius, Church History", "John 21:18-19", "Clement of Rome"]'),
('andrew', 'Andrew', 'X-shaped Cross', 'Patras, Greece', '60 AD', 'Crucifixion', 'Brother of Peter, Andrew preached in Scythia and Greece. He was reportedly bound, not nailed, to an X-shaped cross (St. Andrew’s Cross) to prolong his suffering.', 75, 'Moderate-High', 'Matthew 4:18', '["Acts of Andrew", "Foxe''s Book of Martyrs"]'),
('james-greater', 'James (Son of Zebedee)', 'Scallop Shell', 'Jerusalem', '44 AD', 'Beheading', 'The first of the twelve to be martyred. King Herod Agrippa I had him executed by the sword, as recorded in the book of Acts.', 100, 'Scriptural', 'Acts 12:2', '["Acts 12:2", "New Living Translation"]'),
('john', 'John (Son of Zebedee)', 'Eagle', 'Patmos / Ephesus', 'c. 100 AD', 'Natural Causes', 'The only apostle to likely die of old age. After being exiled to Patmos (where he wrote Revelation), he returned to Ephesus where he died at a very advanced age.', 95, 'Very High', 'Revelation 1:9', '["Irenaeus", "Revelation 1:9"]'),
('philip', 'Philip', 'Cross with Loaves', 'Phrygia', '80 AD', 'Crucifixion', 'Philip preached in Phrygia and was reportedly martyred in Hierapolis. Some accounts say he was crucified, others say he was stoned or hung.', 65, 'Tradition', 'John 1:43', '["Eusebius", "Acts of Philip"]'),
('bartholomew', 'Bartholomew (Nathanael)', 'Flaying Knife', 'Armenia', 'c. 72 AD', 'Flayed Alive and Beheaded', 'Also known as Nathanael. Tradition states he preached in India and Armenia, where he suffered one of the most brutal martyrdoms, being skinned alive.', 60, 'Tradition', 'John 1:45', '["Eusebius", "Golden Legend"]'),
('thomas', 'Thomas (Didymus)', 'Spear', 'Mylapore, India', '72 AD', 'Speared', 'Known for his initial doubt, Thomas preached as far as South India. He was reportedly martyred by local priests who ran him through with spears while he was praying.', 75, 'Moderate-High', 'John 20:24-29', '["Acts of Thomas", "Syriac Tradition"]'),
('matthew', 'Matthew (Levi)', 'Money Bag', 'Ethiopia / Persia', 'c. 60 AD', 'Sword / Halberd', 'The former tax collector preached in Ethiopia and Persia. Most traditions agree he was martyred by the sword, though specific locations vary.', 60, 'Tradition', 'Matthew 9:9', '["Heracleon", "Clement of Alexandria"]'),
('james-less', 'James (Son of Alphaeus)', 'Fuller''s Club', 'Jerusalem', '62 AD', 'Beaten / Stoning', 'Not to be confused with James the Greater. He was reportedly thrown from the pinnacle of the Temple and then beaten to death with a fuller’s club.', 70, 'Church Tradition', 'Mark 3:18', '["Hegesippus", "Josephus"]'),
('thaddeus', 'Jude (Thaddeus)', 'Axe / Club', 'Beirut, Lebanon', 'c. 65 AD', 'Axe / Club', 'Also known as Jude. He preached in Mesopotamia and Armenia. He was martyred alongside Simon the Zealot, reportedly killed with an axe or club.', 65, 'Tradition', 'Jude 1:1', '["Acts of Simon and Jude", "Golden Legend"]'),
('simon-zealot', 'Simon the Zealot', 'Saw', 'Persia / UK', 'c. 65 AD', 'Sawed in Half', 'The most obscure of the twelve. Tradition holds he preached in various regions and was martyred in Persia, often depicted as being sawed in half.', 45, 'Legend / Tradition', 'Luke 6:15', '["Golden Legend", "Foxe''s Book of Martyrs"]'),
('matthias', 'Matthias', 'Axe', 'Jerusalem / Colchis', 'c. 80 AD', 'Stoning / Beheading', 'Chosen to replace Judas Iscariot. He reportedly preached in Judea and was eventually stoned and beheaded.', 60, 'Tradition', 'Acts 1:26', '["Acts 1:26", "Clement of Alexandria"]');
