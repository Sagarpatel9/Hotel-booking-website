# CPSC-362-group-project

> William L., Sagarkumar Patel, Bao Nguyen, Dalen Ha

To run the web app you must have docker installed and running.  You must also have port 80 available on your machine/server.

Once you have installed docker, you must create a `.env` file in the same directory as `.envexample` and add the following line to it:

```
ADMIN_PASSWORD=your_admin_password
```

After that its as easy as:

```
docker-compose up --build
```

You should then be able to use the web app at http://localhost/ in your browser.
