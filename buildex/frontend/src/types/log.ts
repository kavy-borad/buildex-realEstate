export interface ApiLog {
    _id: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
    status: number;
    responseTime: number;
    ip: string;
    userAgent: string;
    timestamp: string;
}

export interface LogStats {
    totalRequests: number;
    successRequests: number;
    errorRequests: number;
    avgResponseTime: number;
}

export interface LogsResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    totalPages: number;
    data: ApiLog[];
}

export interface LiveLogsResponse {
    success: boolean;
    count: number;
    data: ApiLog[];
    serverTime: string;
}
