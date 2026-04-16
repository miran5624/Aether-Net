import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
    if (socket) {
        // If already connected with SAME token, just return
        if (socket.auth?.token === token && socket.connected) {
            return socket;
        }
        // If different token, disconnect and re-init
        socket.disconnect();
    }

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5002', {
        autoConnect: false,
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
    });

    socket.connect();

    socket.on('connect_error', (err) => {
        console.error('Socket connect error:', err.message);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;
