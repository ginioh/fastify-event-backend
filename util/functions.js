exports.slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, '');

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    // Remove invalid chars
    str = str.replace(/[^a-z0-9 -]/g, '')
        // Collapse whitespace and replace by -
        .replace(/\s+/g, '-')
        // Collapse dashes
        .replace(/-+/g, '-');

    return str;
}

exports.getAccessTokenFromHeader = (req) => {
    if (req.headers?.authorization)
        return req.headers['authorization'].split(' ')[1];
    return null;
}

exports.objToTwoDots = (obj) => {
    if (obj && typeof obj === "object") {
        let str = '';
        Object.keys(obj).forEach((k, i) => {
            if (typeof obj[k] === "object") {
                if (Object.keys(obj[k]).length) {
                    obj[k] = this.objToTwoDots(obj[k])
                } else {
                    obj[k] = null;
                }
            }
            if (typeof obj[k] === "string") {
                if (obj[k].indexOf(":") > -1) {
                    obj[k] = obj[k].replace(/\b(gt|gte|lt|lte|eq|ne):/g, match => match.replace(':', '='))
                }
            }
            str = str + k + ':' + obj[k] + ';'
        })
        if (str) return str.slice(0, -1)
    }
    return null;
}