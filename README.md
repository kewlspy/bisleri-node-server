# Bisleri Node Server

Backend API for the Bisleri customer/delivery apps.

## Deployment

Runs on the VPS via Docker Compose, behind nginx. Pushing to `main` triggers
`.github/workflows/deploy.yml`, which SSHes into the VPS and runs:

```
git pull origin main
docker compose up -d --build
```

Secrets (`app.env`) live only on the server and are never committed.
