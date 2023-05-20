
# Chatter

Chatter is a chat tool that allows you to quickly and easily connect with your friends, family, and coworkers. You can create and join channels for various themes, as well as send and receive messages. 


## Demo

Insert gif or link to demo


## Run Locally

Clone the project

```bash
  git clone https://github.com/karanvirsb/chat-app-next.git
```

Go to the project directory

```bash
  cd chat-app-next
```

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm run dev
```


## Docker
```yaml
version: "3.8"

services:
    container_name: chatApp_postgres_container
    image: "postgres:14.5"
    environment:
        POSTGRES_USER: chatAppUser
        POSTGRES_PASSWORD: [Your Password]
        POSTGRES_DB: chat_app_test
        PGDATA: /var/lib/postgresql/data
    ports:
        - 5432:5432
    networks:
        - chat_app_network
    restart: unless-stopped
    healthcheck:
        test: ["CMD", "pg_isready -U chatAppUser"]
        interval: 5s
        timeout: 5s
        retries: 5
    volumes:
        - db-data:/var/lib/postgresql/data
    pgadmin:
        container_name: pgadmin4_container
        image: dpage/pgadmin4
        restart: always
        networks:
            - chat_app_network
        environment:
            PGADMIN_DEFAULT_EMAIL: admin@admin.com
            PGADMIN_DEFAULT_PASSWORD: [YOUR PASSWORD]
            PGADMIN_LISTEN_PORT: 80
        ports:
            - "8080:80"
        volumes:
            - pgadmin-data:/var/lib/pgadmin
volumes:
    db-data:
    pgadmin-data:
networks:
    chat_app_network:
        driver: bridge
```
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

 These environment variables are given by https://sightengine.com  <br />
`SANITIZE_API_USER` <br />
`SANITIZE_API_SECRET`  <br />

`PGUSER` - Should match dockers `POSTGRES_USER`  <br />
`PGHOST` - The host name such as 'localhost'  <br />
`PGPASSWORD` - Should match dockers `POSTGRES_PASSWORD`  <br />
`PGDATABASE` - Should match dockers - `POSTGRES_DB`  <br />
`PGPORT` - Should match dockers `ports`  <br />
`TEST_DATABASE` - Name of test data should match `POSTGRES_DB`  <br />

`API_DOMAIN`=http://examples:port/api  <br /> 
`WEBSITE_DOMAIN`=http://examples:port <br /> 

`NEXTAUTH_SECRET` - You need to generate this!  <br />
`NEXTAUTH_URL`=http://examples:port  <br />

## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express


## Roadmap
- [x] Add Users to Group
- [x] Add Group Channels
- [x] Add Group Messages
- [ ] Add Notifications
- [ ] Add Custom Status
- [ ] Add Private Messages 
- [ ] Add Updating Email and Password



## How To

### Create A Group
- Go to the + button
- Type in the group name

### How to message
- Click on the send message
- Type in a message you would like to send.
- Then press enter to send the message.

### Invite users
- Go to the drop down with the group name to invite users
## Optimizations

What optimizations did you make in your code? E.g. refactors, performance improvements, accessibility


## Screenshots

### Group Page

![image](https://github.com/karanvirsb/chat-app-next/assets/71354242/3e1618ec-a239-4497-92cd-00e1015b74b8)

![image](https://github.com/karanvirsb/chat-app-next/assets/71354242/84d84c02-bab1-4b8f-a4c4-f7d70617aa8e)


