function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f5f5f5;
      color: #333;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      padding: 40px 32px;
      max-width: 440px;
      width: 100%;
      text-align: center;
    }
    .icon {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 22px;
      margin-bottom: 12px;
      color: #222;
    }
    p {
      font-size: 16px;
      color: #555;
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      padding: 14px 32px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
      width: 100%;
      max-width: 300px;
    }
    .btn-danger {
      background: #e53e3e;
      color: #fff;
    }
    .btn-danger:hover {
      background: #c53030;
    }
    .btn-secondary {
      background: #e2e8f0;
      color: #4a5568;
    }
    .btn-secondary:hover {
      background: #cbd5e0;
    }
    .success-icon { color: #38a169; }
    .error-icon { color: #e53e3e; }
  </style>
</head>
<body>
  <div class="card">
    ${body}
  </div>
</body>
</html>`;
}

export function renderUnsubscribePage(token: string): string {
  const safeToken = token.replace(/[^a-zA-Z0-9._\-]/g, '');
  return layout(
    'Cancelar inscricao',
    `
    <div class="icon">📩</div>
    <h1>Cancelar inscricao</h1>
    <p>Deseja deixar de receber nossas mensagens por WhatsApp?</p>
    <form method="POST" action="/?token=${safeToken}">
      <button type="submit" class="btn btn-danger">Sim, cancelar inscricao</button>
    </form>
    `,
  );
}

export function renderSuccessPage(token: string): string {
  const safeToken = token.replace(/[^a-zA-Z0-9._\-=]/g, '');
  return layout(
    'Inscricao cancelada',
    `
    <div class="icon success-icon">&#10003;</div>
    <h1>Inscricao cancelada</h1>
    <p>Voce nao recebera mais nossas mensagens.</p>
    <p style="font-size:14px; color:#888;">Clicou sem querer? Clique abaixo para voltar a receber.</p>
    <form method="POST" action="/?token=${safeToken}&action=resubscribe">
      <button type="submit" class="btn btn-secondary">Quero me reinscrever</button>
    </form>
    `,
  );
}

export function renderResubscribedPage(): string {
  return layout(
    'Reinscricao confirmada',
    `
    <div class="icon success-icon">&#10003;</div>
    <h1>Reinscricao confirmada</h1>
    <p>Voce voltara a receber nossas mensagens.</p>
    `,
  );
}

export function renderErrorPage(message?: string): string {
  return layout(
    'Erro',
    `
    <div class="icon error-icon">&#10007;</div>
    <h1>Algo deu errado</h1>
    <p>${message || 'Este link e invalido ou expirou. Por favor, entre em contato conosco para mais informacoes.'}</p>
    `,
  );
}
