import WebSocket from "ws";
import readline from "readline";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ws = new WebSocket("ws://localhost:3000");

let username = "";

ws.on("open", () => {
  rl.question("Por favor, ingresa tu nombre de usuario: ", (name) => {
    username = name.trim();
    ws.send(username); // Enviar nombre al servidor
    console.log(chalk.green(`Conectado al servidor como "${username}"...`));

    // Escuchar lo que el usuario escribe y enviarlo al servidor
    rl.on("line", (input) => {
      ws.send(input);
    });
  });
});

// Mostrar los mensajes que llegan del servidor
ws.on("message", (data) => {
  console.log(chalk.blue(data.toString()));
});

// Manejar cierre de conexión
ws.on("close", () => {
  console.log(chalk.red("Desconectado del servidor."));
  process.exit(0);
});

// Manejar errores
ws.on("error", (error) => {
  console.error(chalk.red("Error en la conexión:"), error.message);
});
