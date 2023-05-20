
# Chatter

Chatter is a chat tool that allows you to quickly and easily connect with your friends, family, and coworkers. You can create and join channels for various themes, as well as send and receive messages. 


## Demo

### Creating Group

https://github.com/karanvirsb/chat-app-next/assets/71354242/86483529-0922-4752-b866-196cba13c9a0

### Sending Message

https://github.com/karanvirsb/chat-app-next/assets/71354242/8fb9697b-7311-4eef-9d48-4478c7f6e555

### Editing Message

https://github.com/karanvirsb/chat-app-next/assets/71354242/273a6dcc-3748-4e29-92fb-2c3bed36f0d1

### Deleting Message

https://github.com/karanvirsb/chat-app-next/assets/71354242/4b3efa9a-be30-49ed-bd11-e88a70f1d431

### Deleting Group

https://github.com/karanvirsb/chat-app-next/assets/71354242/9d2e67db-e774-4fc3-b117-79cfbcc011b3

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

**Client:** React.js, Next.js, Redux Toolkit, TailwindCSS, DaisyUI, Socket.io

**Server:** PostgreSQL, Docker, Socket.IO, NextAuth.js, Jest


## Roadmap
- [x] Add Users to Group
- [x] Add Group Channels
- [x] Add Group Messages
- [ ] Add Notifications
- [ ] Add Custom Status
- [ ] Add Private Messages 
- [ ] Add Updating Email and Password
- [ ] User Group Roles



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

## Screenshots

### SignIn

![image](https://github.com/karanvirsb/chat-app-next/assets/71354242/2a2e2c1f-9314-43ac-ab8b-2d158eca2eee)

### SignUp

![image](https://github.com/karanvirsb/chat-app-next/assets/71354242/50db056f-f22e-40db-8fdf-d8d5a560be8d)

### Group Page

![image](https://github.com/karanvirsb/chat-app-next/assets/71354242/3e1618ec-a239-4497-92cd-00e1015b74b8)

![image](https://github.com/karanvirsb/chat-app-next/assets/71354242/c3e2ac87-b7cb-4647-be87-66a9cc3dccba)

### Add Group Modal

![image](https://github.com/karanvirsb/chat-app-next/assets/71354242/9354d26a-1e3c-4c78-b7e7-b5a116ffe4fd)

### Settings
![image](https://github.com/karanvirsb/chat-app-next/assets/71354242/33e387f4-40f3-4cda-9f82-149751327470)

### Me Page
![image](https://github.com/karanvirsb/chat-app-next/assets/71354242/f9315f8c-2337-4701-b61a-a9666acb7848)


### Mobile Sidebar
![image](https://github.com/karanvirsb/chat-app-next/assets/71354242/c401a2cd-4f9a-4e2f-925f-755fc4086042)


