// ─────────────────────────────────────────────────────────────
// 1. SRP — Single Responsibility Principle
//    Antes: AssistenteOmniIA roteava requisições, gerava
//           conteúdo E cobrava o usuário na mesma classe.
//    Depois: ServicoCobranca cuida exclusivamente do
//            faturamento. Cada gerador cuida só do seu tipo.
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// 2. DIP — Dependency Inversion Principle
//    Antes: registrarCobranca() instanciava SistemaCobrancaStripe
//           diretamente, impossibilitando troca de gateway.
//    Depois: ServicoCobranca depende de IGatewayPagamento
//            (abstração) injetada pelo chamador.
// ─────────────────────────────────────────────────────────────
 
interface IGatewayPagamento {
  cobrar(usuarioId: string, valor: number): void;
}
 
class GatewayStripe implements IGatewayPagamento {
  cobrar(usuarioId: string, valor: number): void {
    console.log(`[Stripe] Cobrando R$${valor} do usuário ${usuarioId}`);
  }
}
 
class GatewayPayPal implements IGatewayPagamento {
  cobrar(usuarioId: string, valor: number): void {
    console.log(`[PayPal] Cobrando R$${valor} do usuário ${usuarioId}`);
  }
}
 
class GatewayPix implements IGatewayPagamento {
  cobrar(usuarioId: string, valor: number): void {
    console.log(`[Pix] Cobrando R$${valor} do usuário ${usuarioId}`);
  }
}
class ServicoCobranca {
  constructor(private readonly gateway: IGatewayPagamento) {}

  registrar(usuarioId: string, valor: number): void {
    this.gateway.cobrar(usuarioId, valor);
  }
}

// ─────────────────────────────────────────────────────────────
// 3. ISP — Interface Segregation Principle
//    Antes: IModelosIA obrigava toda IA a implementar texto,
//           imagem e áudio — mesmo sem suportar todos.
//    Depois: interfaces menores e coesas; cada modelo implementa
//            apenas o que realmente oferece.
// ─────────────────────────────────────────────────────────────
 
interface IGeradorTexto {
  gerarTexto(prompt: string): string;
}
 
interface IGeradorImagem {
  gerarImagem(prompt: string): string;
}
 
interface IGeradorAudio {
  gerarAudio(prompt: string): string;
}
 
interface IGeradorVideo {
  gerarVideo(prompt: string): string;
}
 
