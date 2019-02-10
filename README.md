# Deadletter Drop

Anonymous sharing of temporary files. 
Upload file(s), receive and share temporary URL.
URL valid for 5 days, then files are deleted.

## Install

```cd api && ./buildDockerImages.sh && cd ../client && npm install```

## End-to-end Development

End to end development with hot reload of both client and server.

Open two terminal windows.

In one 
```
cd api
./runDev.sh && ./tailLogs.sh
```

in the other
```
cd client
npx gulp watch_install # close the browser window that pops up
```

The page is available at http://localhost:3000

