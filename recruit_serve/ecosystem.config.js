module.exports = {

    apps: [{
        name: 'app',
        script: './dist/index.js',//入口文件
        instances: 2, //启动数量
        exec_mode: 'cluster', // 启动模式 fork 分支; cluster 集群
        watch: '.'
    }],
    deploy: {
        production: {
            user: 'SSH_USERNAME',
            host: 'SSH_HOSTMACHINE',
            ref: 'origin/master',
            repo: 'GIT_REPOSITORY',
            path: 'DESTINATION_PATH',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};
