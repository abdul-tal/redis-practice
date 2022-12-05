const express = require('express');
const axios = require('axios');
const Redis = require('redis');
const redisClient = Redis.createClient();

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();
const app = express();

app.get('/photos', async (req, res) => {
    const albumId = req.query.albumId;
    console.log('sdcadcadc')

    // redisClient.get(`photos?albumId=${albumId}`, async (error, photos) => {
    //     console.log('xxxxxxx')
    //     if(error) console.error(error);
    //     if(photos != null) {
    //         console.log('Cache Hit');
    //         res.json(JSON.parse(photos));
    //     } else {
    //         console.log('Cache Missed');
    //         const { data } = await axios('https://jsonplaceholder.typicode.com/photos', { params: albumId});
    //         redisClient.set(`photos?albumId=${albumId}`, JSON.stringify(data));
    //         res.json(data);
    //     }
    // })

    const photos = await redisClient.get(`photos?albumId=${albumId}`);
    if (photos == null) {
        console.log('Cache Missed');
        const { data } = await axios('https://jsonplaceholder.typicode.com/photos', { params: {albumId}});
        redisClient.set(`photos?albumId=${albumId}`, JSON.stringify(data));
        res.json(data);
    } else {
        console.log('Cache Hit');
        res.json(JSON.parse(photos));
    }
})

app.listen(3000, () => console.log('server running on 3000'));