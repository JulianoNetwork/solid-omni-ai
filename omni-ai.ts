// ─────────────────────────────────────────────────────────────
// 1. SRP — Single Responsibility Principle
//    Antes: AssistenteOmniIA roteava requisições, gerava
//           conteúdo E cobrava o usuário na mesma classe.
//    Depois: ServicoCobranca cuida exclusivamente do
//            faturamento. Cada gerador cuida só do seu tipo.
// ─────────────────────────────────────────────────────────────
class ServicoCobranca {
  constructor(private readonly gateway: IGatewayPagamento) {}

  registrar(usuarioId: string, valor: number): void {
    this.gateway.cobrar(usuarioId, valor);
  }
}
