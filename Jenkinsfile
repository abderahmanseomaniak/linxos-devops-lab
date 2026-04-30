pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Bun') {
            steps {
                powershell '''
                Write-Host "🔧 Checking Bun installation..."

                if (!(Test-Path $env:USERPROFILE\\.bun)) {
                    Write-Host "📦 Installing Bun..."
                    irm https://bun.sh/install.ps1 | iex
                }

                $env:PATH="$env:USERPROFILE\\.bun\\bin;$env:PATH"

                bun --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                powershell '''
                $env:PATH="$env:USERPROFILE\\.bun\\bin;$env:PATH"
                bun install
                '''
            }
        }

        stage('Lint') {
            steps {
                powershell '''
                $env:PATH="$env:USERPROFILE\\.bun\\bin;$env:PATH"
                bun run lint
                '''
            }
        }

        stage('Type Check') {
            steps {
                powershell '''
                $env:PATH="$env:USERPROFILE\\.bun\\bin;$env:PATH"
                bunx tsc --noEmit
                '''
            }
        }

        stage('Build') {
            steps {
                powershell '''
                $env:PATH="$env:USERPROFILE\\.bun\\bin;$env:PATH"
                bun run build
                '''
            }
        }

        stage('Commit Info') {
            steps {
                powershell '''
                Write-Host "📝 Latest Commit Triggered This Build:"
                git log -1 --pretty=format:"%h - %s (%an)"
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
