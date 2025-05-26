# Full Stack for Front-End v2

Author: Jem Young
@jemyoung
Senior Software Engineer

## Part 1: Getting Started

- "Full stack"
- Command line
- Shells
- How the internet works
- VIM

### What is "full stack"?

Brian Holt
"Fullstack" developer tweet
https://x.com/holtbt/status/977419276251430912

<img src="https://x.com/holtbt/status/977419276251430912/photo/1" alt="Fullstack developer" width="500">

Frontend: cars, appliances, televisions, browsers, desktop apps, mobile devices.

Backend: platform, APIs, data analytics, security, reliability, databases

Full Stack Engineer: Someone who can build an application from start to finish.

### Command line

- cd - change directory
- ls - list directory contents
- pwd - print working directory
- mkdir - make directory
- rmdir - remove directory

- cat - show file contents
- man - command manual
- less - show file contents by page
- rm - remove file
- echo - repeat input

### Shells

Shell: Command interpreter to interface with system

Terminal: Runs shell applications

Show current shell:
$ echo $0

### How does the internet work?

Internet: A system of globally interconnected devices

Intranet: Private internet

IP: Internet Protocol

IP Address: A label assigned to an internet connected device

IPv4: 8.8.8.8

IPv6: 2001:4860:4860:8888

TCP: Transmission Control Protocol

UDP: User Datagram Protocol

DNS: Domain Name System

```
    subdomain
-----------------
blog.jemyoung.com
     ------------
        domain
              ---
              tld
```

jemyoung.com ====> 23.23.185.61

Nameservers: Map domains to IP addresses

ICMP: Internet Control Message Protocol

### VIM

VIM: "Vi Improved"

| Key | Mode           | Purpose                    |
| --- | -------------- | -------------------------- |
| i   | insert mode    | text editing               |
| ESC | command mode   | Primary mode               |
| :   | last line mode | Searching, saving, exiting |

How to quit VIM

    ESC :q!

Cheat sheet here: https://linuxmoz.com/vi-commands-cheat-sheet/

Another one here: https://vim.fandom.com/wiki/Copy,_cut_and_paste

## Part 2: Servers FTW

- Servers
- The cloud
- VPS
- Operating Systems
- SSH
- Buying a domain
- DNS records

### Servers

Let's make a server (can use nano instead of vi)

    $ vi simpleServer.js

```js
const http = require("http");
// prettier-ignore
http.createServer(function (req, res) {
    res.write("Hello, World!");
    res.end();
  }).listen(8000);

console.log("Server started! Listening on port 8000");
```

Run NodeJS script

    $ node simpleServer.js

### The cloud

### VPS

VPS: Virtual Private Server

Create a droplet on www.digitalOcean.com

### Operating Systems

LTS: Long Term Support

Choose a Ubuntu LTS OS

Two main types of server operating systems:

```
  windows              unix
                  /     |       \
            BSD       linux*       solaris
          /        /    |    \
      freeBSD  ubuntu debian red hat
      /
OSX/MacOS
```

- there are a lot more than 3

### SSH

Authentication

- username/password
- ssh key

SSH: Secure Socket Shell

SSH key pair:

- private key
- public key

Exercise: generate an SSH key

Move into .ssh directory

    $ cd ~/.ssh

List the files

    $ ls

Generate ssh key

```
$ ssh-keygen

Enter file in which to save the key (/Users/jem/.ssh/id_rsa): fsfe
Your identification has been save in fsfe. <------ private key
Your public key has been saved in fsfe.pub. <------ public key
```

Login to your server via SSH

    $ ssh root@YOUR_IP_ADDRESS

SSH into server with key file (should land in a shell that shows the operating system)

    $ ssh -i ~/.ssh/fsfe root@YOUR_IP_ADDRESS

Make sure keychain is active

    $ vi ~/.ssh/config

Add private key to keychain

    $ ssh-add -K ~/.ssh/fsfe

### Buying a domain

Visit www.namecheap.com . Choose a domain name. Buy it.

### DNS records

"A" record: Maps name to IP address

"CNAME": Maps name to name

```
www.jemyoung.com ---> 23.23.185.61
blog.jemyoung.com ---> 23.23.185.61

$ dig blog.jemyoung.com
blog.jemyoung     CNAME   jemyoung.com
jemyoung.com      A       23.23.185.61
```

Add two "A" records with your IP address

- @
- www

- Use digitalocean to add domain
- Update nameservers on namecheap

## Part 3: Satisfying Server Setup

- Server setup
- Nginx
- NodeJS

### Server Setup

1. Update software
2. Create a new user
3. Make that user a superuser
4. Enable login for new user
5. Disable root login

Update software

    # apt update

Upgrade software

    # apt upgrade

Add a new user

    # adduser USERNAME

Add user to "sudo" group

    # usermod -aG sudo USERNAME

Switch user

    # su USERNAME

Check sudo access

    $ sudo cat /var/log/auth.log

Change to home directory

    $ cd ~

Create a new directory if it doesn’t exist

    $ mkdir -p ~/.ssh

Create authorized_keys file and paste PUBLIC key

    $ vi ~/.ssh/authorized_keys

Exit

    $ exit
    # exit

Login with new user

    $ ssh USERNAME@YOUR_IP_ADDRESS

Change file permissions

    $ chmod 644 ~/.ssh/authorized_keys

Disable root login

    $ sudo vi /etc/ssh/sshd_config

Restart ssh daemon

    $ sudo service sshd restart

### Nginx

Nginx ("engine x") does this

- Reverse proxy
- Web server
- Proxy server

Install nginx

    $ sudo apt install nginx

Start nginx

    $ sudo service nginx start

Once started, navigate to your domain name in a browser. Should see this:

```
Welcome to nginx!

If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.

For online documentation and support please refer to nginx.org. Commercial
support is available at nginx.com.

Thank you for using nginx.
```

domain ---> IP ---> Nginx ---> Welcome to nginx!

Show nginx configuration

    $ sudo less /etc/nginx/sites-available/default

Inside that file:

```
root /var/www/html <------- base directory for requests

# HTML defaults
# Add index.php to the list if you are using PHP
index index.html index.htm index.nginx-debian.html;

server_name _;

# location block
location / {
    # First attempt to serve request as file, then
    # as directory, then fall back to displaying a 404.
    try_files $uri $uri/ =404;
}
# try_files is a directive
```

Let's try it! Create index.html and add some HTML to it.

    $ sudo vi /var/www/html/index.html

Then navigate to your domain name. Instead of the nginx message, you should see
your HTML!

### NodeJS

Install NodeJS and npm

    $ sudo apt install nodejs npm

Install git

    $ sudo apt install git

## Part 4: Master of the Stack

- Application Architecture
- Process Manager
- Version Control

### Application Architecture

Change ownership of the www directory to the current user

    $ sudo chown -R $USER:$USER /var/www

Create application directory

    $ mkdir /var/www/app

Move into app directory and initialize empty git repo

    $ cd /var/www/app && git init

Create directories

    $ mkdir -p ui/js ui/html ui/css

Create empty app file

    $ touch app.js

Initialize project

    $ npm init

Install express

    $ npm i express --save

Edit app

    $ vi app.js

Create a server using Express. Use the [Hello World starter app](https://expressjs.com/en/starter/hello-world.html)

```js
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

Run the application

    $ node app.js

Back to Nginx

    domain ---> IP ---> Nginx --?-> Express

Modify the location block:

    location / {
      proxy_pass URL_TO_PROXY_TO;
    }

Edit nginx config

    $ sudo vi /etc/nginx/sites-available/default

    location / {
      proxy_pass http://127.0.0.1:3000/;
    }

### Static Files

From AI: `express.static()` is a built-in middleware function in Express used to
serve static files, such as HTML, CSS, JavaScript, images, and other assets. It
simplifies the process of making these files accessible to clients directly from
a specified directory. When a client requests a static file, Express will look
for it in the designated directory and serve it if found.

To use express.static(), you call it with the path to the directory containing
your static files as an argument, and then mount the resulting middleware
function on a route using app.use().

For example, the code below serves static files from a directory named "public"
located in the same directory as the server file:

    app.use(express.static(path.join(__dirname, 'public')));

For our project, serve static files from the `ui` directory:

    app.use(express.static('ui'))

### Process Manager

- Keeps your application running
- Handles errors and restarts
- Can handle logging and clustering

Install PM2

    $ sudo npm i -g pm2

Start PM2

    $ pm2 start app.js

Setup auto restart

    $ pm2 save
    $ pm2 startup

### Version Control

Version control: Record changes to a file system to preserve the history

- Git
- Subversion
- Mercurial

Git:

1. Create local git repository

- Initialize an NPM project
- Add .gitignore so you don't commits node_modules et al
- Build your app, committing as you go

2. Create SSH key on local system
3. Add SSH key to Github
4. Add remote repo

   ```
   $ git remote add origin https://github.com/OWNER/REPOSITORY.git
   $ git remote -v
   ```

5. Push local repository to Github

## Further exploration (do these things)

Install Fail2ban

https://www.techrepublic.com/article/how-to-install-fail2ban-on-ubuntu-server-18-04/

ExpressJS performance tips

https://expressjs.com/en/advanced/best-practice-performance.html
