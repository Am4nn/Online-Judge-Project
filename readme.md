# Online-Judge | Online-Coding-Platform | (MERN-Based Website)
•	Build a platform that remotely runs and compiles user submitted code for a programming problem securely and judges if the code is correct/wrong. <br>
•	Provided access to users to keep track of submitted code by maintaining Leaderboard and history of submissions. <br>
•	Used Docker and Sandboxing techniques to make online judge more secure. <br>
•	Used Poling and Queue to handle multiple requests. <br>
•	Deployed and can be used by many users by Horizontal Scaling. <br>
•	You can visit Live site here: [Online Judge](https://bit.ly/oj-server) <br>

# Run Online-Judge Locally
•	Go in client directory and install all dependencies for client side code using command : 'npm install' and then run 'npm start' to run react on 3000 PORT.
<br>
•	Now go in server directory and install dependencies using command : 'npm install'.
<br>
•	To run server you must have 'Docker' and 'Redis version greater than or equal to 2.8.18' installed in your PC.
<br>
•	If you are using windows then install wsl for using 'redis-server' and use 'Docker-Desktop' for using 'Docker'.
<br>
•	Server also use 'MongoDB', either you can use mongodb-local aur mongodb-atlas.
<br>
•	To use mongodb-atlas create '.env' file and define a key named 'DB_URL' and its value will be your atlas URL, to use mongodb-local no need to define 'DB_URL' in '.env'.
<br>
•	Server uses cookies to handle authentication, which needs a 'JWT_SECRET' which is also defined in '.env' file.
<br>
•	After all this steps you are all set to run server, use command 'npm start', server will start on 5000 PORT.
<br>
