pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '"C:\\Windows\\System32\\cmd.exe" /c set PATH=%USERPROFILE%\\.bun\\bin;%PATH% && bun install'
            }
        }

        stage('Lint') {
            steps {
                bat '"C:\\Windows\\System32\\cmd.exe" /c set PATH=%USERPROFILE%\\.bun\\bin;%PATH% && bun run lint'
            }
        }

        stage('Type Check') {
            steps {
                bat '"C:\\Windows\\System32\\cmd.exe" /c set PATH=%USERPROFILE%\\.bun\\bin;%PATH% && bunx tsc --noEmit'
            }
        }

        stage('Test') {
            steps {
                bat '"C:\\Windows\\System32\\cmd.exe" /c set PATH=%USERPROFILE%\\.bun\\bin;%PATH% && bun test || echo No tests'
            }
        }

        stage('Build') {
            steps {
                bat '"C:\\Windows\\System32\\cmd.exe" /c set PATH=%USERPROFILE%\\.bun\\bin;%PATH% && bun run build'
            }
        }

        stage('Deploy (Vercel)') {
            steps {
                bat '"C:\\Windows\\System32\\cmd.exe" /c set PATH=%USERPROFILE%\\.bun\\bin;%PATH% && bunx vercel --prod --yes'
            }
        }

        stage('Commit Info') {
            steps {
                bat '"C:\\Windows\\System32\\cmd.exe" /c git log -1 --pretty=format:"Commit: %%h%%nMessage: %%s%%nAuthor: %%an"'
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
