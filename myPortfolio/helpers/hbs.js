const moment = require('moment')

module.exports = {
    generateDate: (date,format) => {
        return moment(date).format(format)
    },
    truncate: (str, len) => {
        if(str.length > len) str = str.substring(0, len) + '...'
        return str
    }
}