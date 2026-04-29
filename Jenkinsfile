pipeline {
    agent any

    environment {
        BUN_DIR = "%USERPROFILE%\\.bun\\bin"
        PATH = "${env.BUN_DIR};${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Bun') {
            steps {
                bat '''
                powershell -Command "if (!(Test-Path $env:USERPROFILE\\.bun)) { irm https://bun.sh/install.ps1 | iex }"
                set PATH=%USERPROFILE%\\.bun\\bin;%PATH%
                bun --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                set PATH=%USERPROFILE%\\.bun\\bin;%PATH%
                bun install
                '''
            }
        }

        stage('Lint') {
            steps {
                bat '''
                set PATH=%USERPROFILE%\\.bun\\bin;%PATH%
                bun run lint
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                set PATH=%USERPROFILE%\\.bun\\bin;%PATH%
                bun run build
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Build successful'
        }
        failure {
            echo '❌ Build failed'
        }
    }
}
