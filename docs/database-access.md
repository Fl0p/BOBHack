# Database Access

## External Database Access via Cloudflare Tunnel

The backend PostgreSQL database can be accessed externally through Cloudflare Tunnel for development purposes.

**⚠️ Warning**: This configuration is for development only and should not be used in production environments.

### Configuration

The database is exposed via Cloudflare Tunnel at:
- **Hostname**: `db.aignite.pl`
- **Service**: `tcp://backend-db:5432`

### Client Setup

To connect to the database from your local machine, you need to install and configure `cloudflared` client.

#### 1. Install cloudflared

**macOS:**
```bash
brew install cloudflare/cloudflare/cloudflared
```

**Linux:**
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared
```

**Windows:**
Download from: https://github.com/cloudflare/cloudflared/releases

#### 2. Start TCP Proxy

Run the following command to create a local tunnel:

```bash
cloudflared access tcp --hostname db.aignite.pl --url localhost:5432
```

This will forward `db.aignite.pl` to your local `localhost:5432`.

#### 3. Connect to Database

Use any PostgreSQL client with the following credentials:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: See `BACKEND_DB_NAME` in `.env` (default: `bobhack`)
- **User**: See `BACKEND_DB_USER` in `.env` (default: `bobhack`)
- **Password**: See `BACKEND_DB_PASSWORD` in `.env`

### Example Connections

**psql:**
```bash
psql -h localhost -p 5432 -U bobhack -d bobhack
```

**Connection String:**
```
postgresql://bobhack:YOUR_PASSWORD@localhost:5432/bobhack
```

**DBeaver / pgAdmin:**
- Host: `localhost`
- Port: `5432`
- Database: `bobhack`
- Username: `bobhack`
- Password: `YOUR_PASSWORD`

### Running as Background Service

To keep the tunnel running in the background:

**macOS/Linux:**
```bash
nohup cloudflared access tcp --hostname db.aignite.pl --url localhost:5432 > /dev/null 2>&1 &
```

**systemd service (Linux):**

Create `/etc/systemd/system/cloudflared-db.service`:

```ini
[Unit]
Description=Cloudflare Tunnel for Database Access
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/cloudflared access tcp --hostname db.aignite.pl --url localhost:5432
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable cloudflared-db
sudo systemctl start cloudflared-db
```

### Security Notes

- This access method requires Cloudflare authentication
- Keep your database credentials secure
- Do not expose database ports directly to the internet
- Use strong passwords for database users
- Consider using SSH tunnels or VPNs for additional security in production

### Troubleshooting

**Connection refused:**
- Ensure `cloudflared access tcp` is running
- Check that the tunnel hostname is correct
- Verify the backend-db service is running in Docker

**Authentication failed:**
- Verify credentials from `.env` file
- Check `BACKEND_DB_USER` and `BACKEND_DB_PASSWORD`

**Timeout errors:**
- Ensure Cloudflare Tunnel container is running
- Check Docker network connectivity
- Verify `backend-db` service is healthy

