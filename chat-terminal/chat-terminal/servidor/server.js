import WebSocket, { WebSocketServer } from "ws";
import chalk from "chalk";

const wss = new WebSocketServer({ port: 3000 });
const clients = [];

wss.on("connection", (ws) => {
  console.log(chalk.gray("Un nuevo cliente se ha conectado"));

  clients.push(ws);

  // Asignar un color aleatorio para cada cliente
  const userColor = chalk.hex(
    `#${Math.floor(Math.random() * 16777215).toString(16)}`
  );

  ws.on("message", (data) => {
    const message = data.toString().trim();

    if (!ws.username) {
      ws.username = message;
      console.log(chalk.green(`Usuario "${ws.username}" se ha unido al chat`));
      broadcast(
        chalk.yellow(
          `[Servidor]: El usuario "${ws.username}" se ha unido al chat.`
        )
      );
    } else {
      // Mostrar mensaje en la terminal del servidor, cliente en su color
      console.log(`${userColor(ws.username)}: ${chalk.white(message)}`);
      broadcast(`${ws.username}: ${message}`); // El mensaje que envía el cliente
    }
  });

  ws.on("close", () => {
    const username = ws.username || "Desconocido";
    console.log(chalk.gray(`El usuario "${username}" se ha desconectado`));
    broadcast(
      chalk.yellow(`[Servidor]: El usuario "${username}" ha salido del chat.`)
    );
    clients.splice(clients.indexOf(ws), 1);
  });
});

function broadcast(message) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message); // Los mensajes se envían sin color al cliente
    }
  });
}

console.log(chalk.blue("Servidor WebSocket en ws://localhost:3000"));
