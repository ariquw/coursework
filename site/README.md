# Музей одной вещи

Веб-приложение для знакомства с историей, устройством и культурным значением привычных предметов. Каждый экспонат — это отдельная вещь (виниловая пластинка, плёночный фотоаппарат, печатная машинка и другие), раскрываемая через четыре раздела: история, устройство, место в искусстве и интересные факты.

# Функциональность

- Просмотр случайного экспоната из коллекции
- Навигация по разделам экспоната с плавной прокруткой
- Галереи изображений с подписями
- Адаптивный дизайн для мобильных устройств, планшетов и десктопов
- Анимированные декоративные элементы на главной странице

## Технологический стек

- Серверная часть: Node.js, Express
- База данных: PostgreSQL
- Клиентская часть: HTML5, CSS3, JavaScript (ES6+)
- Тестирование: Jest, Supertest, Autocannon

## Требования

- Node.js версии 18 или выше
- PostgreSQL версии 14 или выше
- npm версии 9 или выше

## Установка и настройка

### 1. Клонирование репозитория

git clone https://github.com/ariquw/coursework.git
cd coursework

### 2. Установка зависимостей

npm install

### 3. Настройка базы данных

CREATE DATABASE museum_db;

Создание таблицы экспонатов

CREATE TABLE exhibits (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    intro TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

Создание таблицы разделов

CREATE TABLE exhibit_sections (
    id SERIAL PRIMARY KEY,
    exhibit_id INTEGER NOT NULL REFERENCES exhibits(id),
    section_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    order_number INTEGER NOT NULL
);

Создание таблицы галереи

CREATE TABLE section_gallery (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL REFERENCES exhibit_sections(id),
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    order_number INTEGER NOT NULL
);

### 4. Настройка подключения

По умолчанию сервер подключается к PostgreSQL со следующими параметрами:

- Хост: localhost
- Порт: 5432
- База данных: museum_db
- Пользователь: postgres
- Пароль: P@ssw0rd

При необходимости измените параметры подключения в файле server.js в объекте конфигурации Pool.

### 5. Наполнение базы данных

Добавьте экспонаты, разделы и изображения через SQL-запросы. Пример:

INSERT INTO exhibits (slug, name, intro) 
VALUES ('vinyl-player', 'Название', 'Вступление');

INSERT INTO exhibit_sections (exhibit_id, section_type, title, content, image_url, order_number) 
VALUES (1, 'history', 'История', 'Текст раздела', '/images/vinyl-history.jpg', 1);

### 6. Запуск сервера

npm start
Сервер запустится на порту 3000. Откройте в браузере:
http://localhost:3000/main-page.html