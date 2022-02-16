pipeline{

    agent { label 'staging-web'}

    stages {
        stage("Code Analysis") {

            steps {
                script {
                    def scannerHome = tool 'SonarScanner';
                        withSonarQubeEnv("stagingSonarqube") {
                        sh "${tool("SonarScanner")}/bin/sonar-scanner"
                        }
                    }
                }
        }
        stage("Build and Deploy") {

            steps {
                    sh '''
                        sudo docker-compose build
                        sudo docker-compose down
                        sudo docker-compose up -d
                        '''
                }
        }

    }

}
