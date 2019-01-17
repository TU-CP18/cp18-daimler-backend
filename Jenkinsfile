#!/usr/bin/env groovy
node {
	stages {
		stage('Poll SCM') {
			steps {
				checkout scm
			}
		}

		stage('check java') {
			steps {
				sh "java -version"
			}
		}

		stage('clean') {
			steps {
				sh "chmod +x mvnw"
				sh "./mvnw -Pdev clean"
			}
		}

		stage('install tools') {
			steps {
				sh "./mvnw -Pdev com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v8.12.0 -DnpmVersion=6.4.1"
			}
		}

		stage('npm install') {
			steps {
				sh "./mvnw -Pdev com.github.eirslett:frontend-maven-plugin:npm"
			}
		}
        stage('backend tests') {
            try {
                sh "./mvnw test"
            } catch(err) {
                throw err
            }
        }
        stage('packaging') {
            sh "./mvnw verify -Pdev -DskipTests"
        }
	}

}
