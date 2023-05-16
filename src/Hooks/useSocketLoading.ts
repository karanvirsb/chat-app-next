import { useEffect, useState } from "react";

import socket from "@/Sockets";
interface ISocketLoading<T> {
  socketEvent: string;
  errorEvent: string;
  successCB?: (data: T) => void;
  errorCB?: (err: unknown) => void;
}

export function useSocketLoading<T>({
  socketEvent,
  errorEvent,
  successCB,
  errorCB,
}: ISocketLoading<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    socket.on(socketEvent, (data: T) => {
      setLoading(false);
      setSuccess(true);
      setError(null);
      setData(data);
      if (successCB) successCB(data);
    });

    socket.on(errorEvent, (err: unknown) => {
      setLoading(false);
      setSuccess(false);
      setError(err);
      if (errorCB) errorCB(err);
    });
  }, [errorCB, errorEvent, socketEvent, successCB]);

  return { loading, error, success, setLoading, data };
}
