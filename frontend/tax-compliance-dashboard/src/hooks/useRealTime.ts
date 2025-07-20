import { useEffect, useState } from 'react';
import { websocketService } from '../services/websocket';

export const useRealTime = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    const handleMetricsUpdate = (data: any) => setLiveData(data);

    websocketService.on('connect', handleConnect);
    websocketService.on('disconnect', handleDisconnect);
    websocketService.on('metrics_update', handleMetricsUpdate);
    websocketService.on('document_processed', handleMetricsUpdate);
    websocketService.on('compliance_update', handleMetricsUpdate);

    // Start connection
    websocketService.connect();

    return () => {
      websocketService.off('connect', handleConnect);
      websocketService.off('disconnect', handleDisconnect);
      websocketService.off('metrics_update', handleMetricsUpdate);
      websocketService.off('document_processed', handleMetricsUpdate);
      websocketService.off('compliance_update', handleMetricsUpdate);
    };
  }, []);

  return { isConnected, liveData };
};
