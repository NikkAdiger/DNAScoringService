import * as configEnv  from 'dotenv';
configEnv.config();
 
const basicConfig = {
    production: false,
    release: false,
    validation: {
        minLength: 300,
        maxLength: 5000
    },
    dnaSymbols: {
        "A": true, 
        "T": true,
        "G": true,
        "C": true
    },
    sequenceGCRatio: {
        min: 0.25,
        max: 0.65
    },
    subSequenceGCRatio: {
        subSequenceLength: 100,
        maxDifference: 0.52
    }
};

const connection = {
    dev: {
        webServer: {
            host: '0.0.0.0',
            port: 3000
        },

        tempFolder: 'C:\\tempDna'
    },

    release: {
        webtempFolderServer: {
            host: '0.0.0.0',
            port: 3000
        },

        tempFolder: '/tempDna'
    },

    production: {
        webServer: {
            host: process.env.HOST,
            port: process.env.PORT
        },

        tempFolder: '/tempDna'
    }
}

export let environment;
if (basicConfig.production) {
    environment = Object.assign(basicConfig, connection.production)
} else if (basicConfig.release) {
    environment = Object.assign(basicConfig, connection.release)
} else {
    environment = Object.assign(basicConfig, connection.dev);
};