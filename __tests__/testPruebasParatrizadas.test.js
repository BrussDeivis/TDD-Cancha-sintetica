// calculadora.test.js
const Calculadora = require('../pruebasParametrizadas');

describe('Calculadora', () => {
    test.each([
        [1, 2, 3],
        [2, 4, 6],
        [-1, 1, 0],
        [100, 200, 300]
    ])('debería sumar %i y %i para obtener %i', (a, b, expected) => {
        expect(Calculadora.sumar(a, b)).toBe(expected);
    });
    test.each([
        [1, 2, -1],
        [2, 4, -2],
        [-1, 1, -2],
        [100, 200,-100]
    ])('debería sumar %i y %i para obtener %i', (a, b, expected) => {
        expect(Calculadora.restar(a, b)).toBe(expected);
    });
    test.each([
        [1, 2, 2],
        [2, 4, 8],
        [-1, 1, -1],
        [100, 200, 20000]
    ])('debería sumar %i y %i para obtener %i', (a, b, expected) => {
        expect(Calculadora.multiplicar(a, b)).toBe(expected);
    });

    test.each([
        [8, 4,2],
        [6, 3, 2],
        [1, 1, 1],
        [900, 300, 3]
    ])('debería sumar %i y %i para obtener %i', (a, b, expected) => {
        expect(Calculadora.dividir(a, b)).toBe(expected);
    });

    test('debería lanzar un error al intentar dividir por cero', () => {
        expect(() => Calculadora.dividir(6, 0)).toThrow('No se puede dividir por cero');
    });
});