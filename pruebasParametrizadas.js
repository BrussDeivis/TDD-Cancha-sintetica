// calculadora.js
class Calculadora {
    static sumar(a, b) {
        return a + b;
    }

    static restar(a, b) {
        return a - b;
    }

    static multiplicar(a, b) {
        return a * b;
    }

    static dividir(a, b) {
        if (b === 0) {
            throw new Error('No se puede dividir por cero');
        }
        return a / b;
    }
}

module.exports = Calculadora;