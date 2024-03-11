# Introduction

This is a simple Dashboard project to display the web performance of the website. The project is built using AstroJS & NodeJS.

## Getting Started

To run the project, you need to have [Docker](https://www.docker.com/) installed on your machine. Once you have Docker installed, you can run the following command to build the project:

```bash
docker compose up --build
```

This will build the project and run it on port 3000. You can access the project on [http://localhost:3000](http://localhost:3000). The project will also run the API server on port 8080. You can access the API server on [http://localhost:8080](http://localhost:8080).

Note that if the ports are already in use, you can change the ports in the `docker-compose.yml` file if needed.

## Project Structure

The project is structured as follows:

```bash
🛬
├── 💧 server
│   └── **/*.json                        # Satic data sources for REST etc.
│
└── src
    │
    ├── 🧱 app
    │   └── **/*.astro                   # Application-wide components
    │
    ├── 🌠 assets
    │   └── **/*.{svg,…}                 # Transformable assets
    │
    ├── 🧱 components
    │   └── **/*.astro                   # Simple, atomic UI elements
    │
    ├── 📚 lib
    │   └── **/*.ts                      # Utilities (Databases, APIs…)
    │
    ├── 🧱 modules
    │   └── **/*.astro                   # Complex views made of elements
    │
    ├── 📑 pages
    │   ├── **/*.astro                   # File-based client routes
    │   │
    │   └── 🌐 api
    │        └── [...entities].ts        # Catch-all endpoint for CRUD ops.
    │
    ├── 🚀 services
    │   └── *.ts                         # Server-side CRUD operations
    │
    └── 📐 types
        └── *.ts                         # Data entities typings
```
