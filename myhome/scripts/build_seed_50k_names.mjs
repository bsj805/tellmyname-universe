// scripts/build_seed_50k_names.mjs
// Generates exactly 50,000 unique global names evenly distributed across 14 languages,
// and maps each of the 500 house levels (0..499) to representative names.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { analyzeNameToHouse } from '../src/lib/hash.js';
import { TOTAL_LEVELS, MIN_LEVEL, MAX_LEVEL } from '../src/lib/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export const NAME_TELLER_DIR = 'C:/Users/USER/Documents/projects/name_teller';
export const NAMES_PATH = path.join(NAME_TELLER_DIR, 'data/compact_serving_names.json');
export const SURNAMES_PATH = path.join(NAME_TELLER_DIR, 'data/korean_surnames_all.json');
export const FOREIGN_NAMES_PATH = path.join(NAME_TELLER_DIR, 'data/curated_foreign_names.json');

export const OUTPUT_NAMES_PATH = path.join(ROOT_DIR, 'data/seed_names_50k.json');
export const OUTPUT_MAP_JSON_PATH = path.join(ROOT_DIR, 'data/level_to_name_map.json');
export const OUTPUT_MAP_JS_PATH = path.join(ROOT_DIR, 'src/lib/level_name_map.js');

// 14 target languages: exactly 6 * 3572 + 8 * 3571 = 50,000 names
export const LANGUAGE_TARGETS = {
  ko: 3572,
  en: 3572,
  hi: 3572,
  vi: 3572,
  fr: 3572,
  pt: 3572,
  es: 3571,
  id: 3571,
  ru: 3571,
  de: 3571,
  it: 3571,
  ja: 3571,
  zh: 3571,
  ms: 3571
};

export const MANDATORY_KO_NAMES = [
  '김서윤', '이민준', '홍길동', '박서윤', '선우용녀', '서윤',
  '이지안', '박도윤', '최하준', '정서연', '강시우', '조하윤',
  '윤지우', '장서아', '임예준', '한주원', '오유준', '서지호',
  '신하은', '권이서', '황건우', '안우진', '송지아', '전선우'
];

export const MANDATORY_EN_NAMES = [
  'Steve', 'Steven', 'Stephen', 'Emma', 'Liam', 'Olivia', 'Noah',
  'Sophia', 'Lucas', 'Mia', 'Ethan', 'Ava', 'James', 'William',
  'Benjamin', 'Alexander', 'Michael', 'Daniel', 'Matthew', 'David',
  'Joseph', 'Jackson', 'Sebastian', 'Jack', 'Aiden', 'Owen', 'Samuel',
  'ussa', 'Steve Jobs', 'Steve Rogers', 'Emma Watson', 'Taylor Swift',
  'Elon Musk', 'Bill Gates', 'John Doe', 'Jane Doe'
];

// Rich Curated Name Pools for all languages
const EN_FIRST_NAMES = [
  'Steve', 'Steven', 'Stephen', 'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'Lucas', 'Mia',
  'Ethan', 'Ava', 'James', 'William', 'Benjamin', 'Alexander', 'Michael', 'Daniel', 'Matthew', 'David',
  'Joseph', 'Jackson', 'Sebastian', 'Jack', 'Aiden', 'Owen', 'Samuel', 'Henry', 'John', 'Luke',
  'Oliver', 'Elijah', 'Mason', 'Logan', 'Jacob', 'Leo', 'Theodore', 'Ezra', 'Thomas', 'Charles',
  'Christopher', 'Jaxon', 'Maverick', 'Josiah', 'Isaiah', 'Andrew', 'Elias', 'Joshua', 'Nathan', 'Caleb',
  'Ryan', 'Adrian', 'Miles', 'Eli', 'Nolan', 'Christian', 'Aaron', 'Cameron', 'Ezekiel', 'Colton',
  'Luca', 'Landon', 'Hunter', 'Jonathan', 'Santiago', 'Axel', 'Easton', 'Cooper', 'Jeremiah', 'Angel',
  'Roman', 'Connor', 'Jameson', 'Robert', 'Greyson', 'Jordan', 'Ian', 'Carson', 'Leonardo', 'Nicholas',
  'Dominic', 'Austin', 'Everett', 'Brooks', 'Xavier', 'Kai', 'Parker', 'Adam', 'Jace', 'Wesley',
  'Kayden', 'Silas', 'Bennett', 'Declan', 'Waylon', 'Weston', 'Evan', 'Emmett', 'Micah', 'Ryder',
  'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Mila', 'Ella', 'Avery', 'Scarlett',
  'Chloe', 'Victoria', 'Madison', 'Luna', 'Grace', 'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora',
  'Lily', 'Eleanor', 'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Zoe',
  'Leah', 'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn', 'Bella', 'Claire', 'Skylar',
  'Lucy', 'Paisley', 'Everly', 'Anna', 'Caroline', 'Nova', 'Genesis', 'Emilia', 'Kennedy', 'Samantha',
  'Maya', 'Willow', 'Kinsley', 'Naomi', 'Aaliyah', 'Elena', 'Sarah', 'Ariana', 'Allison', 'Gabriella'
];

const EN_SURNAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris', 'Clark', 'Lewis',
  'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Hill', 'Green', 'Adams',
  'Nelson', 'Baker', 'Hall', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Phillips', 'Evans', 'Turner',
  'Parker', 'Edwards', 'Collins', 'Stewart', 'Morris', 'Murphy', 'Cook', 'Rogers', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks',
  'Wood', 'James', 'Bennett', 'Gray', 'Hughes', 'Price', 'Sanders', 'Myers', 'Long', 'Ross',
  'Foster', 'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson',
  'Barnes', 'Fisher', 'Simmons', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham', 'Reynolds', 'Griffin',
  'Wallace', 'West', 'Cole', 'Hayes', 'Bryant', 'Gibson', 'Ellis', 'Stevens', 'Murray', 'Ford',
  'Marshall', 'Owens', 'Harrison', 'McDonald', 'Woods', 'Washington', 'Kennedy', 'Wells', 'Henry', 'Freeman',
  'Webb', 'Tucker', 'Burns', 'Crawford', 'Olson', 'Simpson', 'Porter', 'Hunter', 'Gordon', 'Shaw'
];

const HI_GIVEN_NAMES = [
  'Aarav', 'Vihaan', 'Vivaan', 'Ananya', 'Diya', 'Advik', 'Kabir', 'Aniket', 'Arnav', 'Rohan',
  'Priya', 'Aryan', 'Shaurya', 'Atharv', 'Reyansh', 'Ishan', 'Dhruv', 'Aditya', 'Krishna', 'Sai',
  'Arjun', 'Rudra', 'Kavya', 'Anaya', 'Aadhya', 'Saanvi', 'Avani', 'Pari', 'Myra', 'Ira',
  'Anika', 'Prisha', 'Riya', 'Sneha', 'Neha', 'Rahul', 'Amit', 'Vikas', 'Deepak', 'Suresh',
  'Ramesh', 'Rajesh', 'Sanjay', 'Manish', 'Pooja', 'Shweta', 'Sunita', 'Geeta', 'Nikhil', 'Kunal',
  'Alok', 'Sachin', 'Meera', 'Tanvi', 'Anjali', 'Swati', 'Kritika', 'Nisha', 'Rashmi', 'Divya',
  'Dev', 'Varun', 'Tarun', 'Harsh', 'Mayank', 'Gaurav', 'Mohit', 'Rohit', 'Siddharth', 'Abhishek',
  'आरव', 'विहान', 'अनन्या', 'दिया', 'कबीर', 'रोहन', 'प्रिया', 'आर्यन', 'आदित्य', 'कृष्णा'
];

const HI_SURNAMES = [
  'Sharma', 'Verma', 'Gupta', 'Mehta', 'Patel', 'Singh', 'Kumar', 'Shah', 'Mishra', 'Joshi',
  'Bhat', 'Reddy', 'Nair', 'Chopra', 'Malhotra', 'Kapoor', 'Bhattacharya', 'Das', 'Mukherjee', 'Banerjee',
  'Ghosh', 'Sen', 'Roy', 'Bose', 'Dutta', 'Chatterjee', 'Agarwal', 'Singhania', 'Pandey', 'Tiwari',
  'Dubey', 'Shukla', 'Tripathi', 'Yadav', 'Prasad', 'Chauhan', 'Rathore', 'Thakur', 'Saxena', 'Srivastava',
  'Garg', 'Bansal', 'Goel', 'Mittal', 'Jain', 'Varma', 'Soni', 'Kashyap', 'Choudhary', 'Bhardwaj',
  'शर्मा', 'वर्मा', 'गुप्ता', 'मेहता', 'पटेल', 'सिंह', 'कुमार', 'शाह', 'मिश्रा', 'जोशी'
];

const VI_GIVEN_NAMES = [
  'Minh', 'Linh', 'Anh', 'Hùng', 'Trang', 'Duy', 'Huy', 'Nam', 'Phúc', 'Đức',
  'Long', 'Tuấn', 'Khoa', 'Tú', 'Thành', 'Hoàng', 'Quang', 'Khánh', 'Phương', 'Thảo',
  'Hương', 'Mai', 'Hà', 'Ngọc', 'Lan', 'Hoa', 'Yến', 'Nhi', 'Thu', 'Giang',
  'Trinh', 'Quỳnh', 'Vinh', 'Đạt', 'Bảo', 'Tâm', 'Thắng', 'Kiên', 'Hải', 'Sơn',
  'Hạnh', 'Bích', 'Chi', 'Diệp', 'Loan', 'Nhung', 'Oanh', 'Thủy', 'Trâm', 'Uyên',
  'Bình', 'Cường', 'Dũng', 'Hiếu', 'Nghĩa', 'Phong', 'Quân', 'Thái', 'Trung', 'Việt'
];

const VI_SURNAMES = [
  'Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng',
  'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Đào', 'Đinh', 'Đoàn', 'Lâm',
  'Mai', 'Trịnh', 'Lương', 'Thái', 'Châu', 'Tạ', 'Phùng', 'Vương', 'Tô', 'Hà'
];

const VI_MIDDLES = [
  'Văn', 'Thị', 'Đức', 'Hữu', 'Minh', 'Xuân', 'Thanh', 'Quốc', 'Kim', 'Thế',
  'Ngọc', 'Hoàng', 'Hải', 'Bảo', 'Gia'
];

const FR_GIVEN_NAMES = [
  'Lucas', 'Emma', 'Gabriel', 'Chloé', 'Jules', 'Léo', 'Louis', 'Raphaël', 'Arthur', 'Hugo',
  'Paul', 'Thomas', 'Alexandre', 'Antoine', 'Maxime', 'Clément', 'Théo', 'Mathis', 'Nathan', 'Julien',
  'Romain', 'Valentin', 'Alexis', 'Nicolas', 'Camille', 'Léa', 'Manon', 'Inès', 'Sarah', 'Jade',
  'Louise', 'Zoé', 'Juliette', 'Charlotte', 'Margaux', 'Ambre', 'Agathe', 'Lucie', 'Alice', 'Jeanne',
  'Éléonore', 'Victor', 'Théodore', 'Augustin', 'Gaspard', 'Marius', 'Noé', 'Liam', 'Éthan', 'Robin',
  'Adrien', 'Bastien', 'Charles', 'Damien', 'Florian', 'Gautier', 'Henri', 'Kévin', 'Laurent', 'Mathieu',
  'Olivier', 'Pierre', 'Quentin', 'Sébastien', 'Tristan', 'Vincent', 'Xavier', 'Yves', 'Zacharie', 'Axel'
];

const FR_SURNAMES = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
  'Simon', 'Laurent', 'Lefebvre', 'Michel', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel',
  'Girard', 'André', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'Francois', 'Legrand', 'Garnier', 'Faure',
  'Rousseau', 'Blanc', 'Guerin', 'Muller', 'Roussel', 'Perrin', 'Morin', 'Mathieu', 'Gauthier', 'Dumont',
  'Fontaine', 'Chevalier', 'Robin', 'Masson', 'Sanchez', 'Gerard', 'Nguyen', 'Boyer', 'Denis', 'Lemaire',
  'Duval', 'Joly', 'Gautier', 'Brun', 'Blanchard', 'Barbier', 'Brunet', 'Lucas', 'Carpentier', 'Perrot'
];

const PT_GIVEN_NAMES = [
  'Miguel', 'Helena', 'Arthur', 'Alice', 'Gael', 'Laura', 'Heitor', 'Manuela', 'Theo', 'Sophia',
  'Davi', 'Isabella', 'Gabriel', 'Luiza', 'Bernardo', 'Cecília', 'Samuel', 'Maitê', 'João', 'Lorena',
  'Lucas', 'Lívia', 'Pedro', 'Maria', 'Matheus', 'Júlia', 'Enzo', 'Beatriz', 'Felipe', 'Mariana',
  'Rodrigo', 'Carolina', 'Thiago', 'Larissa', 'Rafael', 'Camila', 'Bruno', 'Amanda', 'Gustavo', 'Fernanda',
  'Leonardo', 'Bruna', 'Eduardo', 'Letícia', 'Vinícius', 'Natália', 'Cauã', 'Yasmin', 'Breno', 'Vitória',
  'Caio', 'Clara', 'Danilo', 'Daniela', 'Diego', 'Fabiana', 'Igor', 'Gabriela', 'Henrique', 'Isadora',
  'Joaquim', 'Lara', 'Murilo', 'Melissa', 'Otávio', 'Nicole', 'Renan', 'Rebeca', 'Victor', 'Sabrina'
];

const PT_SURNAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
  'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa',
  'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas',
  'Cardoso', 'Ramos', 'Gonçalves', 'Santana', 'Teixeira', 'Moraes', 'Cavalcanti', 'Castro', 'Campos', 'Barros',
  'Cardoso', 'Miranda', 'Borges', 'Pinto', 'Carneiro', 'Fonseca', 'Vargas', 'Moura', 'Dantas', 'Guimarães',
  'Azevedo', 'Brito', 'Cunha', 'Farias', 'Freire', 'Leal', 'Macedo', 'Neves', 'Pacheco', 'Queiroz'
];

const ES_GIVEN_NAMES = [
  'Mateo', 'Sofía', 'Santiago', 'Valentina', 'Leo', 'Isabella', 'Lucas', 'Camila', 'Martín', 'Valeria',
  'Sebastián', 'Mariana', 'Matías', 'Lucía', 'Diego', 'Elena', 'Emiliano', 'Victoria', 'Nicolás', 'Sara',
  'Alejandro', 'Daniela', 'Samuel', 'Catalina', 'Daniel', 'Abril', 'Gabriel', 'Julia', 'Leonardo', 'Paula',
  'David', 'Martina', 'Pablo', 'Emma', 'Manuel', 'Antonella', 'Hugo', 'Carmen', 'Alvaro', 'Alba',
  'Javier', 'Claudia', 'Carlos', 'Marta', 'Adrián', 'Laura', 'Mario', 'Andrea', 'Marcos', 'Ana',
  'Ángel', 'Inés', 'Sergio', 'Carla', 'Rubén', 'Marina', 'Iván', 'Blanca', 'Gonzalo', 'Nerea',
  'Guillermo', 'Rocío', 'Jorge', 'Miriam', 'Darío', 'Aitana', 'Iker', 'Clara', 'Jaime', 'Alicia'
];

const ES_SURNAMES = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín',
  'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Muñoz', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez',
  'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Molina',
  'Morales', 'Suárez', 'Ortega', 'Delgado', 'Castro', 'Ortiz', 'Rubio', 'Marín', 'Sanz', 'Núñez',
  'Iglesias', 'Medina', 'Garrido', 'Cortés', 'Castillo', 'Santos', 'Lozano', 'Guerrero', 'Cano', 'Prieto',
  'Mendez', 'Cruz', 'Calvo', 'Gallego', 'Vidal', 'León', 'Herrera', 'Marquez', 'Peña', 'Cabrera'
];

const ID_GIVEN_NAMES = [
  'Budi', 'Siti', 'Rizky', 'Putri', 'Agus', 'Dewi', 'Bayu', 'Nur', 'Bambang', 'Mega',
  'Eko', 'Ratna', 'Hadi', 'Indah', 'Joko', 'Ayu', 'Aris', 'Dian', 'Surya', 'Rina',
  'Dwi', 'Sri', 'Adi', 'Tri', 'Wayan', 'Made', 'Nyoman', 'Ketut', 'Ilham', 'Fajar',
  'Dimas', 'Gilang', 'Anisa', 'Nabila', 'Rahmat', 'Reza', 'Farhan', 'Maulana', 'Taufik', 'Wahyu',
  'Hendra', 'Yusuf', 'Firmansyah', 'Pratama', 'Kusuma', 'Ahmad', 'Ali', 'Andi', 'Arief', 'Bagus',
  'Cahyo', 'Danang', 'Eka', 'Ferry', 'Gita', 'Haris', 'Imam', 'Lukman', 'Rudi', 'Sigit',
  'Wawan', 'Yanto', 'Zainal', 'Angga', 'Bagas', 'Doni', 'Galih', 'Indra', 'Krisna', 'Panji'
];

const ID_SURNAMES = [
  'Santoso', 'Wijaya', 'Saputra', 'Hidayat', 'Wibowo', 'Pratama', 'Kusuma', 'Utomo', 'Susanto', 'Siregar',
  'Nasution', 'Batubara', 'Lubis', 'Simanjuntak', 'Hutapea', 'Harahap', 'Ginting', 'Tarigan', 'Sembiring', 'Sitompul',
  'Tanjung', 'Pasaribu', 'Manurung', 'Panjaitan', 'Pardede', 'Siahaan', 'Simatupang', 'Sinaga', 'Kurniawan', 'Setiawan',
  'Gunawan', 'Wahyudi', 'Permana', 'Suhendra', 'Firmansyah', 'Budiman', 'Subagyo', 'Purwanto', 'Irawan', 'Nugroho',
  'Prasetyo', 'Hartono', 'Purnomo', 'Suwandi', 'Wicaksono', 'Basuki', 'Suharto', 'Yudistira', 'Pramono', 'Sudirman',
  'Kusumo', 'Wibisono', 'Kusnadi', 'Sulistyo', 'Haryanto', 'Syahputra', 'Effendi', 'Hamzah', 'Darmawan', 'Iskandar'
];

const RU_GIVEN_NAMES = [
  'Александр', 'София', 'Максим', 'Анна', 'Михаил', 'Мария', 'Артём', 'Виктория', 'Иван', 'Алиса',
  'Даниил', 'Полина', 'Дмитрий', 'Ева', 'Матвей', 'Елизавета', 'Илья', 'Анастасия', 'Кирилл', 'Ксения',
  'Тимофей', 'Вероника', 'Никита', 'Дарья', 'Роман', 'Александра', 'Марк', 'Варвара', 'Ярослав', 'Василиса',
  'Сергей', 'Ольга', 'Андрей', 'Екатерина', 'Алексей', 'Елена', 'Владимир', 'Татьяна', 'Денис', 'Наталья',
  'Евгений', 'Ирина', 'Павел', 'Светлана', 'Олег', 'Юлия', 'Антон', 'Марина', 'Игорь', 'Оксана',
  'Константин', 'Надежда', 'Виктор', 'Людмила', 'Григорий', 'Алёна', 'Василий', 'Валентина', 'Степан', 'Вера',
  'Фёдор', 'Любовь', 'Лев', 'Лариса', 'Георгий', 'Галина', 'Борис', 'Инна', 'Глеб', 'Яна'
];

const RU_SURNAMES = [
  'Иванов', 'Иванова', 'Смирнов', 'Смирнова', 'Кузнецов', 'Кузнецова', 'Попов', 'Попова', 'Васильев', 'Васильева',
  'Петров', 'Петрова', 'Соколов', 'Соколова', 'Михайлов', 'Михайлова', 'Новиков', 'Новикова', 'Фёдоров', 'Фёдорова',
  'Морозов', 'Морозова', 'Волков', 'Волкова', 'Алексеев', 'Алексеева', 'Лебедев', 'Лебедева', 'Семёнов', 'Семёнова',
  'Егоров', 'Егорова', 'Павлов', 'Павлова', 'Козлов', 'Козлова', 'Степанов', 'Степанова', 'Николаев', 'Николаева',
  'Орлов', 'Орлова', 'Андреев', 'Андреева', 'Макаров', 'Макарова', 'Никитин', 'Никитина', 'Захаров', 'Захарова',
  'Зайцев', 'Зайцева', 'Соловьёв', 'Соловьёва', 'Борисов', 'Борисова', 'Яковлев', 'Яковлева', 'Григорьев', 'Григорьева'
];

const DE_GIVEN_NAMES = [
  'Noah', 'Emilia', 'Matteo', 'Mia', 'Leon', 'Sophia', 'Paul', 'Emma', 'Luca', 'Hannah',
  'Felix', 'Lina', 'Elias', 'Mila', 'Finn', 'Ella', 'Louis', 'Klara', 'Lukas', 'Marie',
  'Jonas', 'Lea', 'Maximilian', 'Luisa', 'Ben', 'Lena', 'Anton', 'Laura', 'Henry', 'Leni',
  'Theo', 'Johanna', 'Julian', 'Amelie', 'Moritz', 'Nele', 'Niklas', 'Sophie', 'Philipp', 'Charlotte',
  'Jan', 'Anna', 'David', 'Frieda', 'Alexander', 'Lilly', 'Tim', 'Romy', 'Simon', 'Ida',
  'Fabian', 'Theresa', 'Nico', 'Paula', 'Tom', 'Mathilda', 'Erik', 'Alina', 'Lennard', 'Luise',
  'Florian', 'Lia', 'Hannes', 'Pia', 'Jannik', 'Victoria', 'Mats', 'Finja', 'Kilian', 'Elena'
];

const DE_SURNAMES = [
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
  'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann',
  'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
  'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Köhler', 'Herrmann', 'König', 'Walter', 'Mayer', 'Huber',
  'Kaiser', 'Fuchs', 'Peters', 'Lang', 'Scholz', 'Möller', 'Weiß', 'Jung', 'Hahn', 'Schubert',
  'Vogel', 'Friedrich', 'Keller', 'Günther', 'Frank', 'Berger', 'Winkler', 'Roth', 'Beck', 'Lorenz'
];

const IT_GIVEN_NAMES = [
  'Leonardo', 'Sofia', 'Francesco', 'Aurora', 'Alessandro', 'Giulia', 'Lorenzo', 'Ginevra', 'Mattia', 'Vittoria',
  'Tommaso', 'Beatrice', 'Gabriele', 'Alice', 'Andrea', 'Emma', 'Riccardo', 'Giorgia', 'Edoardo', 'Anna',
  'Matteo', 'Ludovica', 'Diego', 'Chiara', 'Niccolò', 'Matilde', 'Giuseppe', 'Camilla', 'Antonio', 'Nicole',
  'Federico', 'Greta', 'Marco', 'Bianca', 'Samuele', 'Sara', 'Giovanni', 'Gaia', 'Pietro', 'Martina',
  'Davide', 'Noemi', 'Christian', 'Elena', 'Enea', 'Francesca', 'Filippo', 'Adele', 'Michele', 'Mia',
  'Simone', 'Giacomo', 'Alessio', 'Elisa', 'Manuel', 'Viola', 'Salvatore', 'Gioia', 'Daniele', 'Miriam',
  'Vincenzo', 'Arianna', 'Luca', 'Rebecca', 'Angelo', 'Serena', 'Domenico', 'Caterina', 'Fabio', 'Irene'
];

const IT_SURNAMES = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
  'Bruno', 'Gallo', 'Conti', 'De Luca', 'Costa', 'Giordano', 'Mancini', 'Rizzo', 'Lombardi', 'Moretti',
  'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone',
  'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Lombardo', 'Serra', 'Coppola', 'De Angelis', 'Marchetti', 'Parisi',
  'Villa', 'Conte', 'Ferraro', 'Ferri', 'Fabbri', 'Marini', 'Rosa', 'D\'Angelo', 'Gatti', 'Pellegrini',
  'Palumbo', 'Sanna', 'Farina', 'Rizzi', 'Monti', 'Cattaneo', 'Morelli', 'Amato', 'Silvestri', 'Mazza'
];

const JA_GIVEN_NAMES = [
  'Haruto', 'Yui', 'Sora', 'Hina', 'Ren', 'Minato', 'Hiroto', 'Yuma', 'Riku', 'Souta',
  'Kaito', 'Asahi', 'Itsuki', 'Yamato', 'Yuuto', 'Hinata', 'Aoi', 'Himari', 'Rin', 'Mei',
  'Tsumugi', 'Mio', 'Ichika', 'Koharu', 'Sara', 'Yuna', 'Akari', 'Kanna', 'Saki', 'Honoka',
  'Kenji', 'Daisuke', 'Takeshi', 'Kazuki', 'Naoki', 'Takuya', 'Shota', 'Ryota', 'Yuki', 'Daiki',
  '陽翔', '結衣', '蓮', '湊', '大翔', '悠真', '陽葵', '凛', '芽依', '紬',
  'Kenta', 'Hayato', 'Shin', 'Ryo', 'Kohei', 'Sho', 'Yuuki', 'Tomoya', 'Kazuto', 'Taichi',
  '大介', '武', '直樹', '健太', '隼人', '康平', '勇気', '智也', '和人', '太一'
];

const JA_SURNAMES = [
  'Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato',
  'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Saito', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu',
  'Yamazaki', 'Mori', 'Abe', 'Ikeda', 'Hashimoto', 'Yamashita', 'Ishikawa', 'Nakajima', 'Maeda', 'Fujita',
  '佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤',
  '吉田', '山田', '佐々木', '山口', '斉藤', '松本', '井上', '木村', '林', '清水',
  '山崎', '森', '阿部', '池田', '橋本', '山下', '石川', '中島', '前田', '藤田'
];

const ZH_GIVEN_NAMES = [
  'Wei', 'Fang', 'Hao', 'Yuhan', 'Zihan', 'Yuanyuan', 'Lei', 'Yang', 'Jie', 'Chao',
  'Ming', 'Qiang', 'Jun', 'Tao', 'Yong', 'Li', 'Na', 'Jing', 'Juan', 'Min',
  'Yan', 'Xiu', 'Xia', 'Ying', 'Xin', 'Ting', 'Hui', 'Qian', 'Yiran', 'Haoran',
  '伟', '芳', '浩', '雨涵', '子涵', '圆圆', '磊', '洋', '杰', '超',
  '明', '强', '军', '涛', '勇', '丽', '娜', '静', '娟', '敏',
  '艳', '秀', '霞', '颖', '欣', '婷', '慧', '倩', '浩然', '宇轩',
  '梓萱', '一诺', '欣悦', '天宇', '博文', '奕辰', '若曦', '雨桐', '可馨', '佳怡'
];

const ZH_SURNAMES = [
  'Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
  'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Gao', 'Lin', 'Luo',
  '王', '李', '张', '刘', '陈', '杨', '黄', '赵', '吴', '周',
  '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗',
  '郑', '梁', '谢', '宋', '唐', '许', '邓', '冯', '韩', '曹',
  '曾', '彭', '萧', '蔡', '潘', '田', '董', '袁', '叶', '蒋'
];

const MS_GIVEN_NAMES = [
  'Aisyah', 'Ahmad', 'Nur', 'Muhammad', 'Siti', 'Adam', 'Alia', 'Amir', 'Anis', 'Aqil',
  'Azlan', 'Balqis', 'Danial', 'Farah', 'Hafiz', 'Hakim', 'Hana', 'Haris', 'Hazim', 'Husna',
  'Iman', 'Irfan', 'Iskandar', 'Khairul', 'Luqman', 'Nabil', 'Nadia', 'Najwa', 'Nasrul', 'Qistina',
  'Raihan', 'Razak', 'Rizal', 'Safiyyah', 'Syakir', 'Taufiq', 'Wan', 'Yasmin', 'Zahra', 'Zainal',
  'Aiman', 'Ain', 'Akmal', 'Alif', 'Amira', 'Anas', 'Arif', 'Asyraf', 'Atiqah', 'Azim',
  'Azman', 'Batrisyia', 'Damia', 'Danish', 'Diana', 'Fadhil', 'Fikri', 'Haziq', 'Izzat', 'Khaleed',
  'Maya', 'Naufal', 'Qayyum', 'Rania', 'Rayyan', 'Shafiq', 'Syazwan', 'Zafir', 'Farhan', 'Faizal'
];

const MS_SURNAMES = [
  'Abdullah', 'Ahmad', 'Ali', 'Aziz', 'Bakar', 'Hassan', 'Hussein', 'Ibrahim', 'Ismail', 'Kassim',
  'Mahmud', 'Mansor', 'Musa', 'Othman', 'Rahman', 'Razak', 'Saad', 'Salleh', 'Sulaiman', 'Yusof',
  'Zakaria', 'Zulkifli', 'Hashim', 'Halim', 'Hamzah', 'Harun', 'Idris', 'Jalil', 'Jaafar', 'Jamal',
  'Johar', 'Kamal', 'Karim', 'Latif', 'Majid', 'Malik', 'Marzuki', 'Nasir', 'Nawawi', 'Noor',
  'Omar', 'Ramli', 'Rosli', 'Samad', 'Shukor', 'Sobri', 'Suhaimi', 'Syed', 'Taib', 'Wahab',
  'Daud', 'Ghani', 'Ghazali', 'Haron', 'Hussin', 'Kadir', 'Manaf', 'Mokhtar', 'Mustafa', 'Nordin'
];

/**
 * Builds exactly 50,000 unique global names across 14 languages
 */
export function buildSeed50kNames() {
  const allSeen = new Set();
  const namesByLang = Object.fromEntries(Object.keys(LANGUAGE_TARGETS).map(k => [k, []]));

  const addName = (lang, name) => {
    if (!name || typeof name !== 'string') return false;
    const clean = name.trim();
    if (!clean || clean.length < 2) return false;
    if (allSeen.has(clean)) return false;
    if (namesByLang[lang].length >= LANGUAGE_TARGETS[lang]) return false;

    allSeen.add(clean);
    namesByLang[lang].push(clean);
    return true;
  };

  // 1. KOREAN (ko: 3,572 names)
  for (const name of MANDATORY_KO_NAMES) addName('ko', name);

  if (fs.existsSync(NAMES_PATH) && fs.existsSync(SURNAMES_PATH)) {
    const namesRaw = JSON.parse(fs.readFileSync(NAMES_PATH, 'utf8'));
    const surnamesRaw = JSON.parse(fs.readFileSync(SURNAMES_PATH, 'utf8'));
    const givenNames = namesRaw.map(x => x[0]);
    const topSurnames = surnamesRaw.slice(0, 30).map(s => s.surname);

    // Single given names (top 1,200)
    for (const g of givenNames) {
      addName('ko', g);
      if (namesByLang.ko.length >= 1200) break;
    }

    // Top surnames + given names
    for (const g of givenNames) {
      for (const s of topSurnames) {
        addName('ko', s + g);
        if (namesByLang.ko.length >= LANGUAGE_TARGETS.ko) break;
      }
      if (namesByLang.ko.length >= LANGUAGE_TARGETS.ko) break;
    }
  }

  // 2. ENGLISH (en: 3,572 names)
  for (const name of MANDATORY_EN_NAMES) addName('en', name);

  let curatedForeign = [];
  if (fs.existsSync(FOREIGN_NAMES_PATH)) {
    try {
      curatedForeign = JSON.parse(fs.readFileSync(FOREIGN_NAMES_PATH, 'utf8'));
    } catch {}
  }

  for (const item of curatedForeign) {
    if (item.lang === 'en') {
      addName('en', item.name);
      if (item.aliases) {
        for (const al of item.aliases) {
          if (/^[A-Za-z\s]+$/.test(al)) addName('en', al);
        }
      }
    }
  }

  for (const fn of EN_FIRST_NAMES) addName('en', fn);

  for (const fn of EN_FIRST_NAMES) {
    for (const sn of EN_SURNAMES) {
      addName('en', `${fn} ${sn}`);
      if (namesByLang.en.length >= LANGUAGE_TARGETS.en) break;
    }
    if (namesByLang.en.length >= LANGUAGE_TARGETS.en) break;
  }

  // Helper generator for other languages
  const generateForeignLang = (lang, givens, surnames, middles = []) => {
    // Curated seeds
    for (const item of curatedForeign) {
      if (item.lang === lang) {
        addName(lang, item.name);
        if (item.aliases) {
          for (const al of item.aliases) {
            if (!al.includes('(') && al.length >= 2) addName(lang, al);
          }
        }
      }
    }

    // Pure givens
    for (const g of givens) addName(lang, g);

    // Middles combinations if available (e.g. Vietnamese)
    if (middles.length > 0) {
      for (const s of surnames) {
        for (const m of middles) {
          for (const g of givens) {
            addName(lang, `${s} ${m} ${g}`);
            if (namesByLang[lang].length >= LANGUAGE_TARGETS[lang]) break;
          }
          if (namesByLang[lang].length >= LANGUAGE_TARGETS[lang]) break;
        }
        if (namesByLang[lang].length >= LANGUAGE_TARGETS[lang]) break;
      }
    }

    // Given + Surname or Surname + Given
    const isEastAsian = lang === 'ja' || lang === 'zh';
    for (const g of givens) {
      for (const s of surnames) {
        let full = `${g} ${s}`;
        if (isEastAsian) {
          const isNative = /[\u4e00-\u9fa5\u3040-\u30ff]/.test(s);
          full = isNative ? `${s}${g}` : `${g} ${s}`;
        }
        addName(lang, full);
        if (namesByLang[lang].length >= LANGUAGE_TARGETS[lang]) break;
      }
      if (namesByLang[lang].length >= LANGUAGE_TARGETS[lang]) break;
    }
  };

  generateForeignLang('hi', HI_GIVEN_NAMES, HI_SURNAMES);
  generateForeignLang('vi', VI_GIVEN_NAMES, VI_SURNAMES, VI_MIDDLES);
  generateForeignLang('fr', FR_GIVEN_NAMES, FR_SURNAMES);
  generateForeignLang('pt', PT_GIVEN_NAMES, PT_SURNAMES);
  generateForeignLang('es', ES_GIVEN_NAMES, ES_SURNAMES);
  generateForeignLang('id', ID_GIVEN_NAMES, ID_SURNAMES);
  generateForeignLang('ru', RU_GIVEN_NAMES, RU_SURNAMES);
  generateForeignLang('de', DE_GIVEN_NAMES, DE_SURNAMES);
  generateForeignLang('it', IT_GIVEN_NAMES, IT_SURNAMES);
  generateForeignLang('ja', JA_GIVEN_NAMES, JA_SURNAMES);
  generateForeignLang('zh', ZH_GIVEN_NAMES, ZH_SURNAMES);
  generateForeignLang('ms', MS_GIVEN_NAMES, MS_SURNAMES);

  const allSeedNames = [];
  for (const lang of Object.keys(LANGUAGE_TARGETS)) {
    console.log(`  [Language: ${lang}] Generated ${namesByLang[lang].length} / ${LANGUAGE_TARGETS[lang]} names`);
    allSeedNames.push(...namesByLang[lang]);
  }

  return { allSeedNames, namesByLang };
}

/**
 * Builds mapping from every level 0..499 to representative name(s) across languages
 */
export function buildLevelToNameMap(namesByLang, allSeedNames) {
  console.log(`Mapping ${allSeedNames.length} names to 500 house levels...`);

  const levelMap = {};
  for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
    levelMap[lv] = {};
  }

  for (const [lang, list] of Object.entries(namesByLang)) {
    for (const name of list) {
      const res = analyzeNameToHouse(name);
      const lv = res.level;
      if (!levelMap[lv][lang]) {
        levelMap[lv][lang] = name;
      }
    }
  }

  for (let lv = MIN_LEVEL; lv <= MAX_LEVEL; lv++) {
    const entry = levelMap[lv];
    entry.default = entry.ko || entry.en || Object.values(entry)[0] || '김서윤';

    for (const lang of Object.keys(LANGUAGE_TARGETS)) {
      if (!entry[lang]) {
        entry[lang] = entry.default;
      }
    }
  }

  return levelMap;
}

// CLI Execution
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (isMain) {
  console.log('=== [Building 50,000 Global Seed Names & Level Mapping] ===');

  const { allSeedNames, namesByLang } = buildSeed50kNames();
  console.log(`Total unique names generated: ${allSeedNames.length} (Expected: 50000)`);

  if (allSeedNames.length !== 50000) {
    console.error(`ERROR: Target was 50,000 but generated ${allSeedNames.length}`);
    process.exit(1);
  }

  // 1. Write data/seed_names_50k.json
  fs.mkdirSync(path.dirname(OUTPUT_NAMES_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_NAMES_PATH, JSON.stringify(allSeedNames, null, 2), 'utf8');
  console.log(`✔ Wrote 50,000 names to: ${OUTPUT_NAMES_PATH}`);

  // 2. Build Level-to-Name Map
  const levelMap = buildLevelToNameMap(namesByLang, allSeedNames);

  // 3. Write data/level_to_name_map.json
  fs.writeFileSync(OUTPUT_MAP_JSON_PATH, JSON.stringify(levelMap, null, 2), 'utf8');
  console.log(`✔ Wrote Level-to-Name JSON map to: ${OUTPUT_MAP_JSON_PATH}`);

  // 4. Write src/lib/level_name_map.js
  const jsContent = `// src/lib/level_name_map.js — Auto-generated mapping from 500 house levels (0..499) to sitemap names
// myhome.tellmyname.app

export const LEVEL_TO_NAME_MAP = ${JSON.stringify(levelMap, null, 2)};

/**
 * Returns primary representative sitemap name for a given house level and language
 * @param {number|string} level House level (0..499)
 * @param {string} [lang='ko'] Preferred language code
 * @returns {string} Representative name
 */
export function getSitemapNameForLevel(level, lang = 'ko') {
  const lv = Math.max(0, Math.min(499, Math.floor(Number(level) || 0)));
  const entry = LEVEL_TO_NAME_MAP[lv] || LEVEL_TO_NAME_MAP[String(lv)];
  if (!entry) return '김서윤';
  return entry[lang] || entry['default'] || entry['ko'] || entry['en'] || '김서윤';
}
`;

  fs.writeFileSync(OUTPUT_MAP_JS_PATH, jsContent, 'utf8');
  console.log(`✔ Wrote Level-to-Name JS module to: ${OUTPUT_MAP_JS_PATH}`);

  console.log('=== Global Seed Names & Level Mapping Generation Complete! ===');
}
