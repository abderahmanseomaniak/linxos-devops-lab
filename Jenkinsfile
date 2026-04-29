pipeline {
    agent any

    environment {
        BUN_DIR = "%USERPROFILE%\\.bun\\bin"
        PATH = "${BUN_DIR};$PATH"
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

        stage('Type Check') {
            steps {
                bat '''
                set PATH=%USERPROFILE%\\.bun\\bin;%PATH%
                bunx tsc --noEmit
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
            echo '✅ CI Passed Successfully'
        }

        failure {
            echo '❌ CI Failed - Check logs'
        }
    }
}
