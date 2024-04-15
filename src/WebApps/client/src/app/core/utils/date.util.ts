import moment from "moment";

export const formatDate = function (fecha: any) {
  var date = moment.tz(fecha, 'America/Guayaquil');
  var htmlDateTime = date.format('YYYY-MM-DDTHH:mm:ss');
  // let _getFecha = new Date(fecha);
  // _getFecha.setMinutes(_getFecha.getMinutes() + _getFecha.getTimezoneOffset());
  return new Date(htmlDateTime);
}
