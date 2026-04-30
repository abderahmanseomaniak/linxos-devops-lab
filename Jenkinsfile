pipeline {
    agent any

    stages {

        stage('Test CMD (full path)') {
            steps {
                bat '"C:\\Windows\\System32\\cmd.exe" /c echo CMD WORKS'
            }
        }

        stage('Test Node') {
            steps {
                bat '"C:\\Windows\\System32\\cmd.exe" /c node -v'
            }
        }

        stage('Test Git') {
            steps {
                bat '"C:\\Windows\\System32\\cmd.exe" /c git --version'
            }
        }

        stage('Test Bun') {
            steps {
                bat '"C:\\Users\\pc\\.bun\\bin\\bun.exe" --version'
            }
        }
    }

    post {
        success {
            echo "✅ TEST SUCCESS"
        }
        failure {
            echo "❌ TEST FAILED"
        }
    }
}
