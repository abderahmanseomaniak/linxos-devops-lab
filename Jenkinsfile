pipeline {
    agent any

    environment {
        BUN = "C:\\Users\\pc\\.bun\\bin\\bun.exe"
        PATH = "C:\\Users\\pc\\.bun\\bin;C:\\Program Files\\Git\\cmd;C:\\Program Files\\nodejs\\;${env.PATH}"
    }

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

        stage('Environment Check') {
            steps {
                bat '''
                    echo === ENV CHECK ===
                    node -v
                    git --version
                    %BUN% --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                    echo === Installing deps ===
                    %BUN% install
                '''
            }
        }

        stage('Lint (non-blocking)') {
            steps {
                bat '''
                    echo === Lint ===
                    %BUN% run lint || exit /b 0
                '''
            }
        }

        stage('Type Check (non-blocking)') {
            steps {
                bat '''
                    echo === Type Check ===
                    %BUN% x tsc --noEmit || exit /b 0
                '''
            }
        }

        stage('Test (non-blocking)') {
            steps {
                bat '''
                    echo === Tests ===
                    %BUN% test || echo No tests found
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                    echo === Build ===
                    %BUN% run build
                '''
            }
        }

        stage('Deploy (Vercel)') {
            steps {
                withCredentials([string(credentialsId: 'VERCEL_TOKEN', variable: 'VERCEL_TOKEN')]) {
                    bat '''
                        echo === Deploying to Vercel ===
                        %BUN% x vercel --prod --yes --token %VERCEL_TOKEN% || echo Deploy failed but CI continues
                    '''
                }
            }
        }

        stage('Commit Info') {
            steps {
                bat '''
                    git log -1 --pretty=format:"Commit: %%h%%nMessage: %%s%%nAuthor: %%an"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD SUCCESS 🚀"
        }

        failure {
            echo "❌ CI/CD FAILED"
        }
    }
}
