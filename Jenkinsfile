pipeline {
    agent any

    environment {
        BUN = "${env.USERPROFILE}\\.bun\\bin\\bun.exe"
        PATH = "${env.USERPROFILE}\\.bun\\bin;C:\\Program Files\\Git\\cmd;C:\\Program Files\\nodejs\\;${env.PATH}"
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
                    "%USERPROFILE%\\.bun\\bin\\bun.exe" --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                    "%USERPROFILE%\\.bun\\bin\\bun.exe" install
                '''
            }
        }

        stage('Lint (non-blocking)') {
            steps {
                bat '''
                    "%USERPROFILE%\\.bun\\bin\\bun.exe" run lint
                    exit /b 0
                '''
            }
        }

        stage('Type Check') {
            steps {
                bat '''
                    "%USERPROFILE%\\.bun\\bin\\bun.exe" run typecheck
                '''
            }
        }

        stage('Test') {
            steps {
                bat '''
                    "%USERPROFILE%\\.bun\\bin\\bun.exe" test
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                    "%USERPROFILE%\\.bun\\bin\\bun.exe" run build
                '''
            }
        }

        stage('Deploy (Vercel)') {
            steps {
                bat '''
                    echo Deploying to Vercel...
                    vercel --prod --yes
                '''
            }
        }
    }

    post {
        success {
            echo "✅ PIPELINE SUCCESS"
        }

        failure {
            echo "❌ PIPELINE FAILED"
        }
    }
}
