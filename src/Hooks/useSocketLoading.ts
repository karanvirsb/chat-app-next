import React, { useEffect, useState } from "react";

import socket from "@/Sockets";
interface ISocketLoading {
  socketEvent: string;
  errorEvent: string;
  successCB: () => void;
  errorCB?: () => void;
}

export function useSocketLoading({
  socketEvent,
  errorEvent,
  successCB,
  errorCB,
}: ISocketLoading) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    socket.on(socketEvent, () => {
      setLoading(false);
      setSuccess(true);
      setError(null);
      successCB();
    });

    socket.on(errorEvent, (err: unknown) => {
      setLoading(false);
      setSuccess(false);
      setError(err);
      if (errorCB) errorCB();
    });

    return () => {
      socket.off(socketEvent);
      socket.off(errorEvent);
    };
  }, [errorCB, errorEvent, socketEvent, successCB]);

  return { loading, error, success, setLoading };
}
