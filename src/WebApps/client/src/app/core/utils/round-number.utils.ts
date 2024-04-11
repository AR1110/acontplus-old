

export const roundNumber = function (number: number, max: number = 2){
  let convertNumber = Number(number)
    if (typeof number !== 'number' || isNaN(number)) {
        console.log('Número inválido: ' + number);
    }

    if (typeof max !== 'number' || isNaN(max)) {
        throw new TypeError('Máximo de dígitos inválido: ' + max);
    }

    const factor = Math.pow(10, max);
  const tempNumber = convertNumber * factor;
    const resultNumber = Math.round(tempNumber);
    return resultNumber / factor;
}
