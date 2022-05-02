pipeline {
    agent none
    triggers {
        pollSCM 'H/2 * * * *'
    }
    options {
        disableConcurrentBuilds()
    }
    environment {
        REVISION = "1.0.1"
    }
    stages {
        stage('编译') {
            agent {
                docker {
                    image 'node:14'
                    args '-v /root/npm_cache:/root/.npm'
                }
            }
            steps {
                sh 'npm set strict-ssl false'
                sh 'npm config set registry http://172.18.1.159:4873/'
                sh 'npm --registry http://172.18.1.159:4873 install '
                sh 'rm -rf ./dist/'
                sh 'rm -rf ./web.tar.gz'
                sh 'npm run build'
                sh 'tar zcvf dist.tar.gz dist'
                stash name: 'dist.tar.gz', includes: "dist.tar.gz"

            }
        }
        stage('部署') {
            parallel {
                stage('dev部署') {
                    agent any
                    steps {
                        unstash 'dist.tar.gz'
                        sshagent(credentials: ['show']) {
                            sh 'scp -o StrictHostKeyChecking=no  ./dist.tar.gz root@121.41.30.6:/carbondata/account_dev'
                            sh '''set -ev
                                ssh -o StrictHostKeyChecking=no -l root 121.41.30.6 << EOF
                                set -evx
                                cd /carbondata/account_dev
                                rm -rf web
                                tar zxvf dist.tar.gz
                                mv dist web
                                rm dist.tar.gz
                                exit'''
                        }
                    }
                }
            }
        }
    }
}
