export default defineEventHandler(() => ({
  status: "ok",
  service: "frontend",
  timestamp: new Date().toISOString(),
}))
