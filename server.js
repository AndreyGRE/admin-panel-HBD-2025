const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
// Настройка CORS
// убрать при деплое
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});
// Логгируем запросы
app.use((req, res, next) => {
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
    console.log(logMessage);
    fs.appendFile('logs.txt', logMessage, err => {
        if (err) console.error('Ошибка записи лога:', err);
    });
    next();
});

// Обработка JSON
app.use(bodyParser.json());

// Подключение к БД
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        const errorMsg = `❌ Ошибка подключения к БД: ${err.message}\n`;
        console.error(errorMsg);
        fs.appendFile('logs.txt', errorMsg, err => {
            if (err) console.error('Ошибка записи лога:', err);
        });
        process.exit(1); // Завершаем сервер, если не удалось подключиться
    } else {
        console.log('✅ Подключено к SQLite.');
    }
});

// Создание таблиц
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS guests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT NOT NULL,
            name TEXT NOT NULL,
            text TEXT,
            sort_order INTEGER NOT NULL 
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS speakers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT NOT NULL,
            text1 TEXT,
            text2 TEXT,
            text3 TEXT,
            video_url TEXT,
            sort_order INTEGER NOT NULL 
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS invited_speakers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT NOT NULL,
            text1 TEXT,
            text2 TEXT,
            text3 TEXT,
            video_url TEXT,
            sort_order INTEGER NOT NULL 
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            svg_icon TEXT,
            name TEXT NOT NULL,
            description TEXT,
            price TEXT,
            button_name TEXT,
            background_color TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            sort_order INTEGER NOT NULL 
        )
    `);
});

// Функция CRUD-роутов
function createCRUDRoutes(tableName, fields) {
    const sqlSelectAll = `SELECT * FROM ${tableName}`;
    const sqlInsert = `INSERT INTO ${tableName} (${fields.join(',')}) VALUES (${Array(fields.length).fill('?').join(',')})`;
    const sqlUpdate = `UPDATE ${tableName} SET ${fields.map(f => `${f}=?`).join(',')} WHERE id=?`;
    const sqlDelete = `DELETE FROM ${tableName} WHERE id=?`;
    const sqlGetMaxSortOrder = `SELECT MAX(sort_order) AS maxSort FROM ${tableName}`;

    app.get(`/api/${tableName}`, (req, res) => {
        db.all(sqlSelectAll, [], (err, rows) => {
            if (err) {
                const errorMsg = `❌ Ошибка GET /api/${tableName}: ${err.message}\n`;
                console.error(errorMsg);
                fs.appendFile('logs.txt', errorMsg, err => {
                    if (err) console.error('Ошибка записи лога:', err);
                });
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    });

    app.post(`/api/${tableName}`, (req, res) => {
        // Получаем текущий максимальный sort_order
        db.get(sqlGetMaxSortOrder, [], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Не удалось получить максимальный sort_order' });
            }

            const newSortOrder = (row.maxSort || 0) + 1;

            // Добавляем sort_order в данные перед вставкой
            req.body.sort_order = newSortOrder;

            const values = fields.map(f => req.body[f]);

            db.run(sqlInsert, values, function(err) {
                if (err) {
                    const errorMsg = `❌ Ошибка POST /api/${tableName}: ${err.message}\n`;
                    console.error(errorMsg);
                    fs.appendFile('logs.txt', errorMsg, err => {
                        if (err) console.error('Ошибка записи лога:', err);
                    });
                    return res.status(500).json({ error: err.message });
                }
                res.json({ id: this.lastID });
            });
        });
    });

    app.put(`/api/${tableName}/:id`, (req, res) => {
        const values = [...fields.map(f => req.body[f]), req.params.id];
        db.run(sqlUpdate, values, function(err) {
            if (err) {
                const errorMsg = `❌ Ошибка PUT /api/${tableName}: ${err.message}\n`;
                console.error(errorMsg);
                fs.appendFile('logs.txt', errorMsg, err => {
                    if (err) console.error('Ошибка записи лога:', err);
                });
                return res.status(500).json({ error: err.message });
            }
            res.json({ changes: this.changes });
        });
    });

    app.delete(`/api/${tableName}/:id`, (req, res) => {
        db.run(sqlDelete, [req.params.id], function(err) {
            if (err) {
                const errorMsg = `❌ Ошибка DELETE /api/${tableName}: ${err.message}\n`;
                console.error(errorMsg);
                fs.appendFile('logs.txt', errorMsg, err => {
                    if (err) console.error('Ошибка записи лога:', err);
                });
                return res.status(500).json({ error: err.message });
            }
            res.json({ changes: this.changes });
        });
    });
}

// Роуты
createCRUDRoutes('guests', ['image_url', 'name', 'text','sort_order']);
createCRUDRoutes('speakers', ['image_url', 'text1', 'text2', 'text3', 'video_url','sort_order']);
createCRUDRoutes('invited_speakers', ['image_url', 'text1', 'text2', 'text3', 'video_url','sort_order']);
createCRUDRoutes('tickets', ['svg_icon', 'name', 'description', 'price', 'button_name', 'background_color', 'is_active','sort_order']);

// Обработчик ошибок
app.use((err, req, res, next) => {
    const errorMsg = `❌ Ошибка middleware: ${err.message}\n`;
    console.error(errorMsg);
    fs.appendFile('logs.txt', errorMsg, err => {
        if (err) console.error('Ошибка записи лога:', err);
    });
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Глобальная обработка ошибок
process.on('uncaughtException', (err) => {
    const errorMsg = `🔥 Упавшая ошибка: ${err.message}\nСтек:\n${err.stack}\n`;
    console.error(errorMsg);
    fs.appendFile('logs.txt', errorMsg, err => {
        if (err) console.error('Ошибка записи лога:', err);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    const errorMsg = `⚠️ Незавершённое обещание: ${reason}\n`;
    console.error(errorMsg);
    fs.appendFile('logs.txt', errorMsg, err => {
        if (err) console.error('Ошибка записи лога:', err);
    });
});

// Запуск сервера
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});