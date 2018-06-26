const request = require('request-promise');
const { createLogger, format, transports } = require('winston');
const winston = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
    levels: winston.config.syslog.levels,
    format: combine(
        label({ label: 'Ubersmith API' }),
        timestamp(),
        myFormat
    ),
    transports: [new transports.Console()]
});
const HOST_URL = process.env.HOST_URL || "https://192.168.2.182/api";

class Ubersmith {
    constructor(url, username, api_token, version) {
        this.options = {
            'debug': true,
            'timeout': 30,
            'server': 'http://localhost/',
            'userpwd': '',
            'useragent': 'Ubersmith API Client JS/1.0',
            'certificate': null,
            'certpass': null,
            'json_req': true,
            'format': '',
            'orig_user':null,
            'orig_ip':null
        };
        this.options['version'] = process.env.VERSION ||'2.0';
        if (url) {
            this.options['server'] = url;
        }
        if (username && api_token) {

            this.options['username'] = username;
            this.options['api_token'] = api_token;
            this.options['userpwd'] = username + ':' + api_token;
        }

    }

    /**
     * Set an option
     *
     * @param:string $option option name
     * @param:mixed $value value
     */
    set_option(option,value) {
        return this.options[option] = value;
    }

    /**
     * Get option(s)
     *
     * @param:string $option
     * @param:mixed $default value to return if option is not set
     * @return:mixed
     */
    get_option(option, defaultVal) {
        if (!option) {
            return this.options;
        }

        if (this.options[option]) {
            return this.options[option];
        }

        if (defaultVal) {
            return defaultVal;
        }

        return null;
    }

    call(method = 'uber.method_list',params = []) {


        let headers = {
            'Accept-Encoding': 'gzip',
            'Expect': '',
            'Content-type': 'application/json',
            'User-Agent': 'Ubersmith nodejs API module'
        };

        let url = `${this.options['server']}/api/${this.options['version']}/?method=${method}`;

        if (this.get_option('format')) {
            url += '&format=' + this.get_option('format');
        }
        logger.log({
            level: 'info',
            message: `API call to '${url}'`
        });
        // if we're using json request format
        if (this.get_option('orig_user')) {
            headers['X-Ubersmith-Orig-User'] = this.get_option('orig_user');
        }
        if (this.get_option('orig_ip')) {
            headers['X-Ubersmith-Orig-IP'] = this.get_option('orig_ip');
        }

        let options = {
            uri: url,
            headers: headers,
            json: true,
            auth: {
                'user': this.options['username'],
                'pass': this.options['api_token'],
                'sendImmediately': true
            },
            rejectUnauthorized: !this.options['debug']
        };

        return request(options)
            .then(function (response) {
                // console.log('response', response);
                logger.log({
                    level: 'info',
                    message: `API call received`
                });
                return response['data']
            })
            .catch(function (err) {
                // API call failed...
                logger.log({
                    level: 'error',
                    message: err
                });
            });

    }
}
module.exports = Ubersmith;