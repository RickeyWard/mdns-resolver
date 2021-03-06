'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const MDNS = require("mdns-server");
const resolver = (hostname, rrtype, callback) => {
    const mdns = MDNS();
    if (hostname.charAt(hostname.length - 1) === '.') {
        hostname = hostname.substring(0, hostname.length - 1);
    }
    const timeoutHandler = setTimeout(() => {
        clearInterval(retryHandler);
        mdns.removeListener('response', responseHandler);
        mdns.destroy();
        callback(new Error(`Could not resolve ${hostname} - Query Timed Out`));
    }, 3000);
    const retryHandler = setInterval(() => {
        mdns.query(hostname, rrtype);
    }, 500);
    const responseHandler = (response) => {
        const answer = response.answers.find(x => x.name === hostname && x.type === rrtype);
        if (answer) {
            clearTimeout(timeoutHandler);
            clearInterval(retryHandler);
            mdns.removeListener('response', responseHandler);
            mdns.destroy();
            callback(null, answer.data);
        }
    };
    mdns.on('response', responseHandler);
    mdns.query(hostname, rrtype);
};
exports.resolve = util.promisify(resolver);
exports.resolve4 = (hostname) => exports.resolve(hostname, 'A');
exports.resolve6 = (hostname) => exports.resolve(hostname, 'AAAA');
exports.resolvePtr = (hostname) => exports.resolve(hostname, 'PTR');
exports.resolveTxt = (hostname) => exports.resolve(hostname, 'TXT');
exports.resolveSrv = (hostname) => exports.resolve(hostname, 'SRV');
exports.resolveHinfo = (hostname) => exports.resolve(hostname, 'HINFO');
//# sourceMappingURL=index.js.map
