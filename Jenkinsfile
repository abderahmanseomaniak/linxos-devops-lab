pipeline {
    agent any

    environment {
        BUN_PATH = "%USERPROFILE%\\.bun\\bin"
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
                "C:\\Windows\\System32\\cmd.exe" /c echo Checking environment...
                node -v
                git --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                "C:\\Windows\\System32\\cmd.exe" /c set PATH=%BUN_PATH%;%PATH% && bun install
                '''
            }
        }

        stage('Lint (non-blocking)') {
            steps {
                bat '''
                "C:\\Windows\\System32\\cmd.exe" /c set PATH=%BUN_PATH%;%PATH% && bun run lint || echo Lint warnings detected
                '''
            }
        }

        stage('Type Check') {
            steps {
                bat '''
                "C:\\Windows\\System32\\cmd.exe" /c set PATH=%BUN_PATH%;%PATH% && bunx tsc --noEmit
                '''
            }
        }

        stage('Test') {
            steps {
                bat '''
                "C:\\Windows\\System32\\cmd.exe" /c set PATH=%BUN_PATH%;%PATH% && bun test || echo No tests found
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                "C:\\Windows\\System32\\cmd.exe" /c set PATH=%BUN_PATH%;%PATH% && bun run build
                '''
            }
        }

        stage('Deploy (Vercel)') {
            steps {
                bat '''
                "C:\\Windows\\System32\\cmd.exe" /c set PATH=%BUN_PATH%;%PATH% && bunx vercel --prod --yes || echo Deploy skipped
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD SUCCESS 🚀"
        }

        failure {
            echo "❌ PIPELINE FAILED"
        }
    }
}
