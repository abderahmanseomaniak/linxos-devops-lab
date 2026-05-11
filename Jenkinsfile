pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                bat 'bun install'
            }
        }

        stage('Lint') {
            steps {
                bat 'bun run lint'
            }
        }

        stage('Type Check') {
            steps {
                bat 'bunx tsc --noEmit'
            }
        }

        stage('Build') {
            steps {
                bat 'bun run build'
            }
        }

        stage('SonarCloud') {
            steps {
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                    bat '''
                        sonar-scanner ^
                        -Dsonar.projectKey=linxos-devops-lab ^
                        -Dsonar.organization=abderahmanseomaniak ^
                        -Dsonar.host.url=https://sonarcloud.io ^
                        -Dsonar.login=%SONAR_TOKEN%
                    '''
                }
            }
        }

        stage('Deploy Vercel') {
            steps {
                withCredentials([string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_TOKEN')]) {
                    bat 'bunx vercel --prod --yes --token %VERCEL_TOKEN%'
                }
            }
        }

        stage('Commit Info') {
            steps {
                bat 'git log -1 --pretty=format:"%h %s by %an"'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline SUCCESS 🚀"
        }
        failure {
            echo "❌ Pipeline FAILED"
        }
    }
}
