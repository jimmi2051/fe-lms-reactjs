# LMS System - Demo 

One Paragraph of project description goes here

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Requirement Install

```
NodeJS version >= v10.16.3
Npm version >= 6.9.0
Yarn version >=1.19.0
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

```
Give an example
```

## Deployment

Deploy this on a live system with VPS Linux

\*\* Setup config Nginx
Add new config for nginx, create file `fe-lms.conf`

```
sudo nano /etc/nginx/conf.d/fe-lms.conf
```

And add config flow

```
server {
    listen 80;
    server_name fe-lms.tk www.fe-lms.tk;
    return 301 https://$server_name$request_uri;
}
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    #include snippets/self-signed.conf;
    #include snippets/ssl-params.conf;
    ssl_certificate /etc/letsencrypt/live/fe-lms.tk/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/fe-lms.tk/privkey.pem; # managed by Certbot

    server_name fe-lms.tk www.fe-lms.tk;
    root /home/deftnt/fe-lms/build;
    index index.html index.htm;
    location / {
        try_files $uri /index.html;
    }
    location ~ /.well-known {
        allow all;
    }
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
}
```

Run scripts test config file nginx

```
sudo nginx -t
```

Run scripts restart nginx with new config

```
sudo nginx -s reload
```

\*\*\* Build project front end

Install react-scripts globally

```
sudo npm install react-scripts -g
```

Change API config, config file `.env.production` 

```
REACT_APP_URL_API = https://be-lms.tk/
```

Change the IP and port to the destination DNS of LMS BE.

Upload file build production in folder VPS, run scripts:

```
npm install
```

Instal package plugin done, run scripts build porject

```
npm run build
```

## Built With

- [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
- [Maven](https://maven.apache.org/) - Dependency Management
- [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

- **Billie Thompson** - _Initial work_ - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc
