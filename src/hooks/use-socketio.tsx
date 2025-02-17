import { useEffect, useState } from "react";
import socket from "@/utils/socket";

const useSocket = <T,>(eventName: string) => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado al servidor");
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor");
    });

    socket.on(eventName, (newData) => {
      setData(newData);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(eventName);
    };
  }, [eventName]);

  return data;
};

export default useSocket;
