#!/usr/bin/env groovy

pipeline {
	agent any
	
	options {
		timeout(time: 2, unit: 'MINUTES') 
	}
	
	stages {
		stage('checkout') {
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
				sh "./mvnw clean"
			}
		}

		stage('install tools') {
			steps {
				sh "./mvnw com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v8.12.0 -DnpmVersion=6.4.1"
			}
		}

		stage('npm install') {
			steps {
				sh "./mvnw com.github.eirslett:frontend-maven-plugin:npm"
			}
		}
	}
	
	post {
		success {
			sh "./mvnw"
		}
	}
}
