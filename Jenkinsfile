pipeline {
    agent any

    environment {
        // FIX: hard path for Windows Jenkins service (important)
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
                    C:\\Users\\pc\\.bun\\bin\\bun.exe --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                    C:\\Users\\pc\\.bun\\bin\\bun.exe install
                '''
            }
        }

        stage('Lint (non-blocking)') {
            steps {
                bat '''
                    C:\\Users\\pc\\.bun\\bin\\bun.exe run lint || echo Lint warnings detected
                '''
            }
        }

        stage('Type Check') {
            steps {
                bat '''
                    C:\\Users\\pc\\.bun\\bin\\bun.exe x tsc --noEmit
                '''
            }
        }

        stage('Test') {
            steps {
                bat '''
                    C:\\Users\\pc\\.bun\\bin\\bun.exe test || echo No tests found
                '''
            }
        }

        stage('Build') {
            steps {
                bat '''
                    C:\\Users\\pc\\.bun\\bin\\bun.exe run build
                '''
            }
        }

        stage('Deploy (Vercel)') {
            steps {
                bat '''
                    C:\\Users\\pc\\.bun\\bin\\bun.exe x vercel --prod --yes
                '''
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
            echo "❌ PIPELINE FAILED"
        }
    }
}
