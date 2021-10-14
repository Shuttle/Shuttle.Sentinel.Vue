const configuration = {
    url: `${global.settings.API_URL}${global.settings.API_URL.endsWith("/") ? "" : "/"}`,
    accessUrl: `${global.settings.ACCESS_API_URL}${global.settings.ACCESS_API_URL.endsWith("/") ? "" : "/"}`,
    environment: (global.settings.NODE_ENV || 'development'),

    oauth: {
        development: {
            "github": "https://github.com/login/oauth/authorize?client_id=Iv1.e588cbc88601587f&redirect_uri=http://localhost:4040/oauth/github{register}"
        },
        production: {

        }
    },

    debugging() {
        return this.environment.toLowerCase() === 'development';
    },

    getApiUrl(path) {
        return this.url + path;
    },

    getAccessApiUrl(path) {
        return this.accessUrl + path;
    },

    getOAuthUrl(name, register) {
        var providers = this.oauth[this.environment];

        if (!providers) {
            throw new Error(`Could not find oauth providers for environment '${this.environment}'.`);
        }

        var url = providers[name];

        if (!url) {
            throw new Error(`Could not find oauth provider url for name '${name}'.`);
        }

        return url.replace('{register}', register ? "-register" : "");
    }
}

if (Object.freeze) {
    Object.freeze(configuration);
}

export default configuration;