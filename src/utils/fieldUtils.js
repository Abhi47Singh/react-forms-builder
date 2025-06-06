export function withFreshIds(fields) {
  return fields.map((f, i) => ({
    ...f,
    id: `${f.type}-${Date.now()}-${Math.floor(Math.random() * 10000)}-${i}`,
  }));
}