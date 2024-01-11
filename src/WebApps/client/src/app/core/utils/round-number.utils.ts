

export const roundNumber = function (number: number, max: number = 2){
    if (typeof number !== 'number' || isNaN(number)) {
        throw new TypeError('Número inválido: ' + number);
    }
    
    if (typeof max !== 'number' || isNaN(max)) {
        throw new TypeError('Máximo de dígitos inválido: ' + max);
    } 
    
    const factor = Math.pow(10, max);
    const tempNumber = number * factor;
    const resultNumber = Math.round(tempNumber);
    return resultNumber / factor;
}