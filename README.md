### Alternative UI for [Pocket](https://getpocket.com)

This is a React app which provides different UI for [Pocket](https://getpocket.com).
Compared with the original website, this app displays more articles and provides easier way to manage them.
It uses client-side caching, optimistic updates and (naive) virtualization to make sure everything works fast.

Currently, it's not hosted publicly anywhere but it's available as Docker image.
If you want to run it, you need to register your own application on https://getpocket.com/developer/apps/new and obtain a consumer key.
Then you can run it as follows:

```
docker run -p 3020:80 --env CONSUMER_KEY=<YOUR CONSUMER KEY> takemyoxygen/alt-pocket
```
