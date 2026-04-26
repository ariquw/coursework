const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'museum_db',
    password: 'P@ssw0rd',
    port: 5432,
});

describe('Unit Tests', () => {
    
    test('База данных museum_db существует', async () => {
        const result = await pool.query(
            "SELECT datname FROM pg_database WHERE datname = 'museum_db'"
        );
        expect(result.rows.length).toBe(1);
        expect(result.rows[0].datname).toBe('museum_db');
    });

    test('Таблица exhibits содержит нужные колонки', async () => {
        const result = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'exhibits'
            ORDER BY ordinal_position
        `);
        const columns = result.rows.map(r => r.column_name);
        expect(columns).toContain('id');
        expect(columns).toContain('slug');
        expect(columns).toContain('name');
        expect(columns).toContain('intro');
        expect(columns).toContain('created_at');
    });

    test('Таблица exhibit_sections имеет внешний ключ на exhibits', async () => {
        const result = await pool.query(`
            SELECT tc.constraint_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu 
                ON tc.constraint_name = ccu.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_name = 'exhibit_sections'
                AND ccu.table_name = 'exhibits'
        `);
        expect(result.rows.length).toBeGreaterThan(0);
    });

    test('В таблице exhibits есть хотя бы один экспонат', async () => {
        const result = await pool.query('SELECT COUNT(*) FROM exhibits');
        const count = parseInt(result.rows[0].count);
        expect(count).toBeGreaterThan(0);
    });

});

afterAll(async () => {
    await pool.end();
});