
# UTM Campaign Manager

A simple application for creating and managing UTM links for marketing campaigns.

## Features

- Create and manage marketing campaigns
- Generate UTM links with customizable parameters
- Save and organize UTM links by campaign
- Copy links to clipboard

## Deployment with Coolify

This application can be easily deployed using [Coolify](https://coolify.io/) and Docker.

### Prerequisites

- [Coolify](https://coolify.io/) installed on your server
- Docker and Docker Compose

### Steps to deploy

1. Clone this repository to your Coolify server or connect it to your GitHub repository
2. In Coolify dashboard, create a new service
3. Select "Docker" as the deployment method
4. Point to the repository location
5. Use the included `Dockerfile` and `docker-compose.yml`
6. Set the port to 8080 (or adjust if needed)
7. Deploy the application

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Development

```bash
# Build the Docker image
docker build -t utm-manager .

# Run the container
docker run -p 8080:80 utm-manager

# Using Docker Compose
docker-compose up -d
```

## License

MIT
