pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Environment Check') {
            steps {
                powershell '''
                Write-Host "🔍 Checking environment..."

                Write-Host "Node:"
                node -v || Write-Host "Node not found"

                Write-Host "Git:"
                git --version

                Write-Host "Bun:"
                if (Get-Command bun -ErrorAction SilentlyContinue) {
                    bun --version
                } else {
                    Write-Host "Bun not found yet"
                }
                '''
            }
        }

        stage('Install Bun') {
    steps {
        powershell '''
        Write-Host "Installing Bun..."

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
                $env:PATH="$env:USERPROFILE\\.bun\\bin;$env:PATH"

                Write-Host "📦 Installing dependencies..."
                bun install
                '''
            }
        }

        stage('Lint') {
            steps {
                powershell '''
                $env:PATH="$env:USERPROFILE\\.bun\\bin;$env:PATH"

                Write-Host "🧹 Running lint..."
                bun run lint
                '''
            }
        }

        stage('Type Check') {
            steps {
                powershell '''
                $env:PATH="$env:USERPROFILE\\.bun\\bin;$env:PATH"

                Write-Host "🧠 Type checking..."
                bunx tsc --noEmit
                '''
            }
        }

        stage('Build') {
            steps {
                powershell '''
                $env:PATH="$env:USERPROFILE\\.bun\\bin;$env:PATH"

                Write-Host "🏗 Building project..."
                bun run build
                '''
            }
        }

        stage('Commit Info') {
            steps {
                powershell '''
                Write-Host "📝 Last commit info:"

                git log -1 --pretty=format:"Commit: %h%nMessage: %s%nAuthor: %an"
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
