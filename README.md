# tummoc_task_01

Start the application calling 'npm start'.

The port of running is 5000.

Call /register to register an user. Provide { username, email, password } as json through body.

Call /login to login. From there, JWT token will be generated.

Call /logout to logout. We are clearing the token when logging out.

Used passport local strategy.
