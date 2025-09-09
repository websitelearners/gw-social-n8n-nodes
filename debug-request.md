# Debugging Steps for Mixpost n8n Package

## How to Debug the Request

### 1. Check n8n Console Output
After the modification, when you run the workflow:
- Open terminal where n8n is running
- You'll see the exact request being sent
- Compare it with your working curl

### 2. Expected Request Format
Based on your working curl, the request body should look like:
```json
{
  "date": "2025-05-28",
  "time": "15:00",
  "timezone": "Europe/Chisinau",
  "schedule": true,
  "schedule_now": false,
  "queue": false,
  "accounts": [62],
  "tags": [],
  "versions": [
    {
      "account_id": 0,
      "is_original": true,
      "content": [
        {
          "body": "This is the content",
          "media": [89]
        }
      ],
      "options": {
        "mastodon": {
          "sensitive": false
        }
      }
    }
  ]
}
```

### 3. Check Server Logs
On your Mixpost server:
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Apache/Nginx logs (if applicable)
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log
```

### 4. Test with Alternative Approach
If still getting 500 error, let's bypass the node completely and use HTTP Request node with exact curl format.