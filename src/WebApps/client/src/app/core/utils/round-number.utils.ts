// export const roundNumber = function (number: number, max: number = 2){
//   let convertNumber = Number(number)
//     if (typeof number !== 'number' || isNaN(number)) {
//         console.log('Número inválido: ' + number);
//     }

//     if (typeof max !== 'number' || isNaN(max)) {
//         throw new TypeError('Máximo de dígitos inválido: ' + max);
//     }

//     const factor = Math.pow(10, max);
//   const tempNumber = convertNumber * factor;
//     const resultNumber = Math.round(tempNumber);
//     return resultNumber / factor;
// }

export const roundNumber = function name(number: number, max = 2) {
  if (typeof number !== 'number' || isNaN(number)) {
    throw new TypeError('Número inválido: ' + number);
  }

  if (typeof max !== 'number' || isNaN(max) || max < 0) {
    throw new TypeError('Máximo de dígitos inválido: ' + max);
  }

  // Asegúrate de usar la precisión adecuada
  const factor = Math.pow(10, max);
  // Multiplica y luego divide para redondear
  return Math.round((number + Number.EPSILON) * factor) / factor;
};
