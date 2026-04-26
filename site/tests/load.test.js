const autocannon = require('autocannon');

const BASE_URL = 'http://localhost:3000';

describe('Load Tests', () => {

    test('100 запросов к /api/random', async () => {
        const result = await autocannon({
            url: `${BASE_URL}/api/random`,
            connections: 10,
            duration: 10
        });
        expect(result.errors).toBe(0);
        expect(result.timeouts).toBe(0);
    }, 15000);

    test('200 запросов к /api/exhibit/vinyl-player', async () => {
        const result = await autocannon({
            url: `${BASE_URL}/api/exhibit/vinyl-player`,
            connections: 20,
            duration: 10
        });
        expect(result.errors).toBe(0);
        expect(result.timeouts).toBe(0);
    }, 15000);

    test('Статические файлы CSS', async () => {
        const result = await autocannon({
            url: `${BASE_URL}/styles/main-page-style.css`,
            connections: 30,
            duration: 10
        });
        expect(result.errors).toBe(0);
    }, 15000);

    test('Главная страница', async () => {
        const result = await autocannon({
            url: `${BASE_URL}/main-page.html`,
            connections: 15,
            duration: 10
        });
        expect(result.errors).toBe(0);
    }, 15000);

});