module.exports = {
	chainWebpack: config => {
		//产品发布时的入口文件
		config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
            
            //使用externals设置排除项
            config.set('externals', {
                vue: 'Vue',
                "vue-router": 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })

            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
		})
		//产品开发时的入口文件
		config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
		})
	}
}