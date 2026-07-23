import { Controller, Get } from "@nestjs/common";
import type { HealthCheckResponse } from "@ai-platform/shared";

@Controller("health")
export class HealthController {
  @Get()
  check(): HealthCheckResponse {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
