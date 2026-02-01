const io = require('socket.io-client');

const SOCKET_URL = 'ws://192.168.1.102:3000';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5N2U4NjM4ODQwOTczMTY0NmJmODQ3YyIsInBob25lIjoiNTM1NTU1NTUiLCJpYXQiOjE3Njk4OTk1NzYsImV4cCI6MTc3MDI0NTE3Nn0.tIuEWRMpqdwGVssvjt5weKLq7vJjlAb_0uxfU5dDb7s';

console.log('Connecting to WebSocket server at:', SOCKET_URL);

const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    withCredentials: true,
    extraHeaders: {
        access_token: ACCESS_TOKEN
    }
});

socket.on('connect', () => {
    console.log('✅ Connected to WebSocket server');
    console.log('Socket ID:', socket.id);

    // Simular goOnDuty
    console.log('\n📡 Emitting goOnDuty event...');
    socket.emit('goOnDuty', {
        latitude: 25.6866,
        longitude: -100.3161,
        heading: 45
    });
});

socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error.message);
});

socket.on('disconnect', (reason) => {
    console.log('🔌 Disconnected:', reason);
});

// Listen for all events to see what the server responds
socket.onAny((eventName, ...args) => {
    console.log(`\n📨 Received event: "${eventName}"`, args);
});

// Listen specifically for onDuty related events
socket.on('captainStatusChanged', (data) => {
    console.log('\n✅ captainStatusChanged received:', data);
    if(data.status === 'onDuty'){
        console.log('✅ Captain is now ON DUTY');
    }else if(data.status === 'offDuty'){
        console.log('✅ Captain is now OFF DUTY');
    }
});

socket.on('error', (error) => {
    console.log('\n❌ Error event received:', error);
});

// Timeout after 10 seconds
setTimeout(() => {
    console.log('\n⏱️ Timeout - disconnecting...');
    socket.disconnect();
    process.exit(0);
}, 10000);
