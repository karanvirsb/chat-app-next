
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

 These environment variables are given by https://sightengine.com
`SANITIZE_API_USER`
`SANITIZE_API_SECRET`

`PGUSER` - Should match dockers `POSTGRES_USER`
`PGHOST` - The host name such as 'localhost'
`PGPASSWORD` - Should match dockers `POSTGRES_PASSWORD`
`PGDATABASE` - Should match dockers - `POSTGRES_DB`
`PGPORT` - Should match dockers `ports`
`TEST_DATABASE` - Name of test data should match `POSTGRES_DB`


`API_DOMAIN`=http://examples:port/api
`WEBSITE_DOMAIN`=http://examples:port

`NEXTAUTH_SECRET` - You need to generate this!
`NEXTAUTH_URL`=http://examples:port

## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express


## Roadmap

[ ] Add Notifications
[ ] Add Custom Status
[ ] Add Private Messages 



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

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

