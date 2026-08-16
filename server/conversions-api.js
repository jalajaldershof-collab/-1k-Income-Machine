// Simple server for handling conversion tracking webhooks
// Run with: node server/conversions-api.js

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Simple in-memory storage for demo purposes
// In production, use a real database
let conversions = [];

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Route: GET /conversions - Get all conversions
    if (req.method === 'GET' && req.url === '/conversions') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: conversions }));
        return;
    }

    // Route: POST /conversions - Track a conversion
    if (req.method === 'POST' && req.url === '/conversions') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const conversion = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
                    ...data,
                    timestamp: new Date().toISOString()
                };
                conversions.push(conversion);
                
                // Log to console for debugging
                console.log(`✅ Conversion tracked: ${conversion.event_name}`);
                console.log(`   Value: $${conversion.custom_data?.value || 0}`);
                console.log(`   Timestamp: ${conversion.timestamp}`);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: conversion }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
        });
        return;
    }

    // Route: GET /conversions/stats - Get summary stats
    if (req.method === 'GET' && req.url === '/conversions/stats') {
        const totalValue = conversions.reduce((sum, c) => {
            return sum + (c.custom_data?.value || 0);
        }, 0);
        
        const stats = {
            totalConversions: conversions.length,
            totalValue: totalValue,
            events: conversions.reduce((acc, c) => {
                const name = c.event_name || 'unknown';
                acc[name] = (acc[name] || 0) + 1;
                return acc;
            }, {})
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: stats }));
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Not found' }));
});

server.listen(PORT, () => {
    console.log(`🚀 Conversion API running on http://localhost:${PORT}`);
    console.log(`   GET  /conversions       - View all conversions`);
    console.log(`   POST /conversions       - Track a conversion`);
    console.log(`   GET  /conversions/stats - View summary stats`);
});

// Save conversions to file periodically
setInterval(() => {
    const filePath = path.join(__dirname, 'conversions-data.json');
    fs.writeFile(filePath, JSON.stringify(conversions, null, 2), (err) => {
        if (err) console.error('Failed to save conversions:', err);
    });
}, 30000); // Every 30 seconds

// Load saved data on startup
const dataFile = path.join(__dirname, 'conversions-data.json');
if (fs.existsSync(dataFile)) {
    try {
        const data = fs.readFileSync(dataFile, 'utf-8');
        conversions = JSON.parse(data);
        console.log(`📊 Loaded ${conversions.length} saved conversions`);
    } catch (err) {
        console.log('No saved data found, starting fresh');
    }
}