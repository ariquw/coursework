const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'museum_db',
    password: 'P@ssw0rd',
    port: 5432,
});

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/api/random', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT slug FROM exhibits ORDER BY RANDOM() LIMIT 1'
        );
        res.json(result.rows[0] || { slug: 'vinyl-player' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/exhibit/:slug', async (req, res) => {
    try {
        const exhibit = await pool.query(
            'SELECT * FROM exhibits WHERE slug = $1',
            [req.params.slug]
        );
        
        if (exhibit.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        
        const sectionsResult = await pool.query(
            'SELECT * FROM exhibit_sections WHERE exhibit_id = $1 ORDER BY order_number',
            [exhibit.rows[0].id]
        );
        
        const sectionsWithGallery = await Promise.all(
            sectionsResult.rows.map(async (section) => {
                const gallery = await pool.query(
                    'SELECT * FROM section_gallery WHERE section_id = $1 ORDER BY order_number',
                    [section.id]
                );
                return {
                    ...section,
                    gallery: gallery.rows
                };
            })
        );

        res.json({
            ...exhibit.rows[0],
            sections: sectionsWithGallery
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});