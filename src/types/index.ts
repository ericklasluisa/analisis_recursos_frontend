export interface MetricasCPU {
  cpu_percent: number;
  cpu_count: number;
  cpu_count_logical: number;
  cpu_freq_min: string;
  cpu_freq_max: number;
  cpu_freq_current: number;
  cpu_user: number;
  cpu_system: number;
  cpu_idle: number;
  cpu_irq: number | null;
  cpu_softirq: number | null;
  cpu_temp: string;
}

export interface MetricasRAM {
  memory_percent: number;
  memory_total: number;
  memory_available: number;
  memory_used: number;
  memory_buffers: string;
  memory_cached: string;
  memory_shared: string;
}

export interface NetworkConnection {
  is_up:                boolean;
  ip_address:           string;
  mac_address:          string;
  speed:                number;
  network_sent:         number;
  network_recv:         number;
  network_sent_packets: number;
  network_recv_packets: number;
  network_sent_errs:    number;
  network_recv_errs:    number;
  network_dropin:       number;
  network_dropout:      number;
}
