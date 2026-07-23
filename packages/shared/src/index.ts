// 前后端共享类型 / 常量 / DTO 的入口。

export const API_PREFIX = "/api" as const;

// 后端 GET /api/health 的响应结构，前端也可以直接引用做类型标注。
export interface HealthCheckResponse {
  status: "ok";
  timestamp: string;
  uptime: number;
}
