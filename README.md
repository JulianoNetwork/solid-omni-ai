# Refatoração SOLID — Plataforma OmniAI
 
Refatoração de um sistema legado de geração de conteúdo com IA aplicando os cinco princípios SOLID em TypeScript.
 
## Princípios aplicados
 
### SRP — Single Responsibility Principle
A classe `AssistenteOmniIA` original acumulava roteamento de requisições, geração de conteúdo e faturamento na mesma estrutura.
Foi extraída a classe `ServicoCobranca`, responsável exclusivamente pelo faturamento, e cada modelo de IA passou a cuidar apenas do seu tipo de geração.
 
### OCP — Open/Closed Principle
O método `processarRequisicaoUsuario()` usava if/else para decidir o tipo de geração, exigindo modificação a cada novo modelo.
Substituído pelo `ProcessadorRequisicao`, que recebe qualquer gerador via injeção — adicionar o `ModeloSora` (vídeo) não tocou em nenhuma linha existente.
 
### LSP — Liskov Substitution Principle
`ModeloFocadoEmTexto` herdava `AssistenteOmniIA` e lançava exceções em `gerarImagem()` e `gerarAudio()`, quebrando qualquer código que esperasse o comportamento da classe pai.
Cada modelo agora implementa apenas as interfaces que pode cumprir: `ModeloChatGPT` implementa só `IGeradorTexto`; `ModeloDallE` implementa só `IGeradorImagem`. Nenhuma subclasse promete o que não entrega.
 
### ISP — Interface Segregation Principle
A interface `IModelosIA` obrigava toda IA a implementar texto, imagem e áudio, mesmo sem suportar todos os tipos.
Segregada em quatro interfaces coesas: `IGeradorTexto`, `IGeradorImagem`, `IGeradorAudio` e `IGeradorVideo`. Cada modelo implementa apenas o contrato relevante.
 
### DIP — Dependency Inversion Principle
O método `registrarCobranca()` instanciava `SistemaCobrancaStripe` diretamente, impossibilitando a troca de gateway de pagamento.
Introduzida a abstração `IGatewayPagamento` injetada no construtor de `ServicoCobranca`. Trocar para PayPal ou Pix é questão de passar outra implementação na construção, sem alterar nenhuma regra de negócio.
 
## Tecnologia
 
- TypeScript
## Como executar
 
```bash
npx ts-node omni-ai-solid.ts
```
 
## Estrutura do repositório
 
```
├── omni-ai-legado.ts   ← código original com os problemas
├── omni-ai-solid.ts    ← refatoração aplicando SOLID
└── README.md
```
