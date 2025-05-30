# Getting Started with Resume Analyzer React App

Make sure to install node js before you begin, visit this site to install node: [node install](https://nodejs.org/en/download/package-manager) I would recommed downloading version 20.18.1 LTS as that is what I used for the development. 

Once done open the apps folder with cmd or in any IDE like VS-Code (preferably as admin), and run the following command:

`npm install -f`

The above command is force enabled if you wish you could run it without force as well. It should install all the required dependencies. 

Depeding on which port number your backend is running, please change the config file accordingy, the default port number will be `port:8000`, which is already configured. 

Once done you will be redirected to the following page:
![startscren](images/initial.png)

Once you're here you are ready with front end. 

Alternatively, you can also use the docker file to create your own image and run it using docker desktop. 
Use the following command to build the image:

`docker build -t react-app .`





