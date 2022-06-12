const configuration = {
    sentinel: {
        url: null,
        
        getApiUrl(path){
            return this.url + path;
        },
    },

    access: {
        url: null,
        
        getApiUrl(path){
            return this.url + path;
        },
    },

    debugging(){
        return import.meta.env.DEV;
    },
}

if (!import.meta.env.VITE_API_URL) {
    throw new Error("Configuration item 'VITE_API_URL' has not been set.");
}

configuration.sentinel.url = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_URL.endsWith("/") ? "" : "/"}`;
configuration.access.url = `${import.meta.env.VITE_ACCESS_API_URL}${import.meta.env.VITE_ACCESS_API_URL.endsWith("/") ? "" : "/"}`;

if (Object.freeze){
    Object.freeze(configuration);
}

export default configuration;