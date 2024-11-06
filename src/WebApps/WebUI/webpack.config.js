const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode: 'development', // Cambiar a 'production' para la versión de producción
    //entry: './wwwroot/js/index.js', // Archivo de entrada
    entry:{
        app: './app/index.js',
        inventario: './app/inventario/index.js',  
        contabilidad: './app/contabilidad/index.js',  
        },
    output: {
        path: path.resolve(__dirname, 'wwwroot/bundle'), // Carpeta de salida
       // path: path.resolve(__dirname, 'wwwroot/js'), // Salida en la carpeta wwwroot para que ASP.NET Core pueda servirlo
       // filename: '../bundle/bundle.min.js', // Nombre del archivo de salida
         filename: '[name].bundle.min.js',
       publicPath: '/bundle/', // Ruta pública para acceder a los archivos
    },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, './app'), // Aquí 'src' es el directorio base
            '@core': path.resolve(__dirname, './app/core'), // Aquí 'src' es el directorio base
            '@factElect': path.resolve(__dirname, './app/factElect'), // Aquí 'src' es el directorio base
            '@inventario': path.resolve(__dirname, './app/inventario'), // Aquí 'src' es el directorio base
            '@contabilidad': path.resolve(__dirname, './app/contabilidad'), // Aquí 'src' es el directorio base
        },
        extensions: ['.js', 'html', '.jsx'], // Extensiones de archivo que se resolverán
    },
    externals: {
        angular: 'angular'  // Indica que Angular es externo
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: 'html-loader', // Cargar archivos HTML
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    optimization: {
        minimize: true,  // Minificar el bundle generado
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false, // Remueve comentarios
                    },
                },
                extractComments: false, // No genera archivo separado para comentarios
            }),
        ], // Minimizador
        // splitChunks: {
        //     chunks: 'all', // Permite la división de chunks para todos los tipos de módulos
        // },
    },
    devtool: 'source-map', // Habilitar mapas de origen
    devServer: {
        static: {
            directory: path.join(__dirname, 'app'), // Usa "static" en lugar de "contentBase"
        },
        compress: true,
        port: 9000,
    },
    stats: {
        errorDetails: true, // Muestra detalles completos de errores/warnings
        warningsFilter: [/critical dependency:/i], // Oculta avisos específicos
    },
};

