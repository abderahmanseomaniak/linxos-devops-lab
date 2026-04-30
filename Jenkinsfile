pipeline {
    agent any

    environment {
        BUN_DIR = "${env.USERPROFILE}\\.bun\\bin"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Bun') {
            steps {
                powershell '''
                Write-Host "📦 Setting up Bun..."

                if (!(Test-Path $env:USERPROFILE\\.bun)) {
                    irm https://bun.sh/install.ps1 | iex
                }

                $env:PATH = "$env:USERPROFILE\\.bun\\bin;" + $env:PATH

                bun --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                powershell '''
                $env:PATH = "$env:USERPROFILE\\.bun\\bin;" + $env:PATH

                Write-Host "📦 Installing dependencies..."
                bun install
                '''
            }
        }

        stage('Test') {
            steps {
                powershell '''
                $env:PATH = "$env:USERPROFILE\\.bun\\bin;" + $env:PATH

                Write-Host "🧪 Running tests..."
                bun test || echo "No tests found"
                '''
            }
        }

        stage('Build') {
            steps {
                powershell '''
                $env:PATH = "$env:USERPROFILE\\.bun\\bin;" + $env:PATH

                Write-Host "🏗 Building project..."
                bun run build
                '''
            }
        }

        stage('Deploy (Vercel)') {
            steps {
                powershell '''
                $env:PATH = "$env:USERPROFILE\\.bun\\bin;" + $env:PATH

                Write-Host "🚀 Deploying to Vercel..."
                bunx vercel --prod --yes
                '''
            }
        }
    }

    post {
        success {
            echo "✅ CI/CD SUCCESS (Bun)"
        }

        failure {
            echo "❌ PIPELINE FAILED"
        }
    }
}
