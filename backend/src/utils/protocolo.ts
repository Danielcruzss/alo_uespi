export function gerarProtocolo(): string {
  const data = new Date();
  const ano = data.getFullYear();
  const numero = Math.floor(100000 + Math.random() * 900000);
  return `ALO-${ano}-${numero}`;
}
