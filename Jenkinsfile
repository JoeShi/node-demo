pipeline {
  agent any
  stages {
    stage('pre install') {
       steps {
         echo 'start npm install'
         sh 'npm install --production'
       }
    }
    stage('docker build image') {
       steps {
         echo 'start build docker image'
         sh 'docker build -t node-demo:latest .'
       }
    }
  }
  post {
    always {
      echo 'build finished'
    }
  }
}
