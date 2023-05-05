const phoneNumberFormatter = (number) => {
    let formatted = number.replace(/\D/g, '')
    if (formatted.startsWith('0')) {
        formatted = '593' + formatted.substr(1)
    }
    if (!formatted.endsWith('@c.us')) {
        formatted += '@c.us'
    }
    return formatted
}
module.exports = {
    phoneNumberFormatter,
}