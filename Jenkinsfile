pipeline {
    agent any

    environment {
        BUN_PATH = "${env.USERPROFILE}\\.bun\\bin"
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
                echo Checking environment...

                echo Node:
                node -v

                echo Git:
                git --version

                echo Bun:
                "%USERPROFILE%\\.bun\\bin\\bun.exe" --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                set PATH=%USERPROFILE%\\.bun\\bin;%PATH%

                echo Installing dependencies...
                bun install
                '''
            }
        }

        stage('Lint') {
            steps {
                bat '''
                set PATH=%USERPROFILE%\\.bun\\bin;%PATH%

                echo Running lint...
                bun run lint
                '''
            }
        }

        stage('Type Check') {
            steps {
                bat '''
                set PATH=%USERPROFILE%\\.bun\\bin;%PATH%

                echo Type checking...
                bunx tsc --noEmit
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                set PATH=%USERPROFILE%\\.bun\\bin;%PATH%

                echo Building project...
                bun run build
                '''
            }
        }

        stage('Commit Info') {
            steps {
                bat '''
                echo Last commit info:
                git log -1 --pretty=format:"Commit: %%h%%nMessage: %%s%%nAuthor: %%an"
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI SUCCESS - Build passed"
        }

        failure {
            echo "❌ CI FAILED - Check logs"
        }
    }
}
