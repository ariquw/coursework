const request = require('supertest');
const app = require('../server');

describe('API Tests', () => {

    let testSlug;

    beforeAll(async () => {
        const res = await request(app).get('/api/random');
        testSlug = res.body.slug;
    });

    test('GET /api/random возвращает случайный экспонат', async () => {
        const res = await request(app).get('/api/random');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('slug');
        expect(typeof res.body.slug).toBe('string');
    });

    test('GET /api/exhibit/:slug возвращает данные экспоната', async () => {
        const res = await request(app).get(`/api/exhibit/${testSlug}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name');
        expect(res.body).toHaveProperty('sections');
        expect(Array.isArray(res.body.sections)).toBe(true);
    });

    test('GET /api/exhibit/:slug содержит секцию history', async () => {
        const res = await request(app).get(`/api/exhibit/${testSlug}`);
        const types = res.body.sections.map(s => s.section_type);
        expect(types).toContain('history');
    });

    test('GET /api/exhibit/nonexistent возвращает 404', async () => {
        const res = await request(app).get('/api/exhibit/fake-12345');
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Not found');
    });

});