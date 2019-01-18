#!/usr/bin/env groovy
node {
		stage('Poll SCM') {
				checkout scm
		}

		stage('Check java') {
				sh "java -version"
		}

		stage('Clean') {
				sh "chmod +x mvnw"
				sh "./mvnw -Pdev clean"
		}

		stage('Install tools') {
				sh "./mvnw -Pdev com.github.eirslett:frontend-maven-plugin:install-node-and-npm -DnodeVersion=v8.12.0 -DnpmVersion=6.4.1"
		}

		stage('Npm install') {
				sh "sudo ./mvnw -Pdev com.github.eirslett:frontend-maven-plugin:npm"
		}

        stage('Backend tests') {
            try {
                sh "./mvnw -Pdev test"
            } catch(err) {
                throw err
            } finally {
                junit '**/target/test-results/jest/TESTS-*.xml'
            }
            }

        stage('Build WAR') {
            sh "sudo ./mvnw -Pdev verify -DskipTests"
            archiveArtifacts artifacts: '**/target/*.war', fingerprint: true
        }

        stage('Deploy WAR') {
        sshagent(['c04df32d-d471-4533-8350-1a46b7e9a4ea']) {
            sh 'sudo ~/.jenkins/workspace/Cp-webapp/target/*.war 172.31.45.118:/home/ubuntu/tomcat/apache-tomcat-8.0.27/webapps/'
        }
}
