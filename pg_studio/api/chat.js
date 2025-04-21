// import { Server } from "socket.io";

// export default function handler(req, res) {
//   // Configura o Socket.IO
//   if (!res.socket.server.io) {
//     console.log("Iniciando Socket.IO...");
//     const io = new Server(res.socket.server);
    
//     io.on("connection", (socket) => {
//       console.log("Usuário conectado:", socket.id);
      
//       // Recebe mensagens
//       socket.on("mensagem", (msg) => {
//         io.emit("mensagem", msg); // Envia para todos
//       });
      
//       // Desconecta
//       socket.on("disconnect", () => {
//         console.log("Usuário desconectado:", socket.id);
//       });
//     });

//     res.socket.server.io = io;
//   }
//   res.end();
// }