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
 
// ─────────────────────────────────────────────────────────────
// 4. LSP — Liskov Substitution Principle
//    Antes: ModeloFocadoEmTexto herdava AssistenteOmniIA e
//           lançava exceções em gerarImagem() e gerarAudio(),
//           quebrando qualquer código que esperasse o contrato
//           da classe pai.
//    Depois: cada modelo implementa apenas as interfaces que
//            pode cumprir — nenhuma subclasse promete o que
//            não entrega.
// ─────────────────────────────────────────────────────────────
 
/** Modelo especializado em texto — não promete imagem nem áudio. */
class ModeloChatGPT implements IGeradorTexto {
  gerarTexto(prompt: string): string {
    return `[ChatGPT-4] Texto gerado para: ${prompt}`;
  }
}
 
/** Modelo especializado em imagem. */
class ModeloDallE implements IGeradorImagem {
  gerarImagem(prompt: string): string {
    return `[DALL-E] URL da imagem gerada para: ${prompt}`;
  }
}
 
/** Modelo especializado em áudio. */
class ModeloWhisper implements IGeradorAudio {
  gerarAudio(prompt: string): string {
    return `[Whisper] Arquivo de áudio gerado para: ${prompt}`;
  }
}
 
/** Modelo especializado em vídeo — adicionado sem tocar em nada existente. */
class ModeloSora implements IGeradorVideo {
  gerarVideo(prompt: string): string {
    return `[Sora] URL do vídeo gerado para: ${prompt}`;
  }
}
 
/** Modelo multimodal que cumpre todos os contratos que assina. */
class ModeloGeminiUltra implements IGeradorTexto, IGeradorImagem, IGeradorAudio {
  gerarTexto(prompt: string): string {
    return `[Gemini Ultra] Texto gerado para: ${prompt}`;
  }
  gerarImagem(prompt: string): string {
    return `[Gemini Ultra] Imagem gerada para: ${prompt}`;
  }
  gerarAudio(prompt: string): string {
    return `[Gemini Ultra] Áudio gerado para: ${prompt}`;
  }
}

// ─────────────────────────────────────────────────────────────
// 5. OCP — Open/Closed Principle
//    Antes: processarRequisicaoUsuario() usava if/else para
//           cada tipo, exigindo modificação a cada novo modelo.
//    Depois: ProcessadorRequisicao recebe qualquer gerador que
//            implemente a interface correta. Adicionar vídeo
//            (ModeloSora) não toca em nenhuma linha existente.
// ─────────────────────────────────────────────────────────────
 
type TipoGerador =
  | IGeradorTexto
  | IGeradorImagem
  | IGeradorAudio
  | IGeradorVideo;
 
/**
 * Orquestra a requisição sem conhecer os detalhes de cada modelo.
 * Aberto para extensão (novos geradores), fechado para modificação.
 */
class ProcessadorRequisicao {
  constructor(private readonly cobranca: ServicoCobranca) {}
 
  processar(usuarioId: string, prompt: string, gerador: TipoGerador): void {
    console.log(`\nProcessando requisição do usuário ${usuarioId}...`);
 
    let resultado: string | undefined;
 
    if ("gerarTexto" in gerador) resultado = gerador.gerarTexto(prompt);
    else if ("gerarImagem" in gerador) resultado = gerador.gerarImagem(prompt);
    else if ("gerarAudio" in gerador) resultado = gerador.gerarAudio(prompt);
    else if ("gerarVideo" in gerador) resultado = gerador.gerarVideo(prompt);
 
    console.log(resultado);
    this.cobranca.registrar(usuarioId, 1.50);
  }
}
 
// ─────────────────────────────────────────────────────────────
// Exemplo de uso — compõe as dependências pelo chamador
// ─────────────────────────────────────────────────────────────
 
const cobrancaStripe = new ServicoCobranca(new GatewayStripe());
const processador = new ProcessadorRequisicao(cobrancaStripe);
 
processador.processar("user_001", "Explique SOLID", new ModeloChatGPT());
processador.processar("user_002", "Gato astronauta", new ModeloDallE());
processador.processar("user_003", "Leia este texto", new ModeloWhisper());
processador.processar("user_004", "Cachorro surfando", new ModeloSora());
 
// Troca de gateway sem alterar ProcessadorRequisicao:
const cobrancaPix = new ServicoCobranca(new GatewayPix());
const processadorPix = new ProcessadorRequisicao(cobrancaPix);
processador.processar("user_005", "Resuma este artigo", new ModeloGeminiUltra());
 
