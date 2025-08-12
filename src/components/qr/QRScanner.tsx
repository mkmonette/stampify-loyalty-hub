import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import workerUrl from 'qr-scanner/qr-scanner-worker.min?url';

QrScanner.WORKER_PATH = workerUrl;

export default function QRScanner({ onDecode }: { onDecode: (text: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        onDecode(result.data);
      },
      { returnDetailedScanResult: true }
    );
    scannerRef.current = scanner;
    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [onDecode]);

  const start = async () => {
    try {
      await scannerRef.current?.start();
      setActive(true);
    } catch (e) {
      console.error(e);
      setActive(false);
    }
  };

  const stop = async () => {
    await scannerRef.current?.stop();
    setActive(false);
  };

  return (
    <div className="space-y-3">
      <div className="aspect-video w-full overflow-hidden rounded-md border border-border bg-muted">
        <video ref={videoRef} className="h-full w-full object-cover" muted />
      </div>
      <div className="flex gap-2">
        {!active ? (
          <button onClick={start} className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-primary-foreground hover:opacity-90 transition">
            Start Scanner
          </button>
        ) : (
          <button onClick={stop} className="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-secondary-foreground hover:opacity-90 transition">
            Stop Scanner
          </button>
        )}
      </div>
    </div>
  );
}
