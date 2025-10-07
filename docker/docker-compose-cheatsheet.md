# Docker-Compose Cheat Sheet

## Most Used Command
```bash
docker-compose up
```
Runs containers defined in `docker-compose.yml`.

### Variants
- `docker-compose up -d` → Run in **detached mode** (background).
- `docker-compose down` → Stop and remove containers, networks, and volumes.
- `docker-compose ps` → List running containers.
- `docker-compose logs -f` → Follow logs from containers.

## Other Useful Commands
- `docker-compose build` → Build or rebuild services.
- `docker-compose restart` → Restart all services.
- `docker-compose exec <service> <command>` → Run a command in a running container.
- `docker-compose stop` → Stop services without removing them.
- `docker-compose rm` → Remove stopped containers.
