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
            }
            }

        stage('Build WAR') {
            sh "sudo ./mvnw -Pdev package -DskipTests"
            archiveArtifacts artifacts: '**/target/*.war', fingerprint: true
        }

        stage('Deploy WAR') {
            sshagent(credentials : ['c04df32d-d471-4533-8350-1a46b7e9a4ea']) {
                sh 'ssh -o StrictHostKeyChecking=no ubuntu@ec2-18-185-174-51.eu-central-1.compute.amazonaws.com uptime'
                sh 'ssh -v ubuntu@ec2-18-185-174-51.eu-central-1.compute.amazonaws.com'
                sh 'ssh sudo su'
                sh 'scp ~/.jenkins/workspace/Cp-webapp/target/*.war root@ec2-18-185-174-51.eu-central-1.compute.amazonaws.com:/home/ubuntu/tomcat/apache-tomcat-8.0.27/webapps/'
            }
        }
}
