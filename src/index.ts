import type { Env } from './token';
import { verifyAndExtract } from './token';
import { addToDnc, removeFromDnc } from './mautic';
import {
  renderUnsubscribePage,
  renderSuccessPage,
  renderResubscribedPage,
  renderErrorPage,
} from './html';

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export default {
  async fetch(
    request: Request,
    env: Env,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== '/') {
      return htmlResponse(renderErrorPage('Pagina nao encontrada.'), 404);
    }

    const token = url.searchParams.get('token');
    if (!token) {
      return htmlResponse(renderErrorPage(), 400);
    }

    const contactId = await verifyAndExtract(token, env.HMAC_SECRET);
    if (!contactId) {
      return htmlResponse(renderErrorPage(), 400);
    }

    if (request.method === 'GET') {
      return htmlResponse(renderUnsubscribePage(token));
    }

    if (request.method === 'POST') {
      const action = url.searchParams.get('action');

      if (action === 'resubscribe') {
        const result = await removeFromDnc(contactId, env);
        if (result.success) {
          return htmlResponse(renderResubscribedPage());
        }
        return htmlResponse(
          renderErrorPage('Ocorreu um erro ao processar sua solicitacao. Por favor, tente novamente mais tarde.'),
          500,
        );
      }

      const result = await addToDnc(contactId, env);
      if (result.success) {
        return htmlResponse(renderSuccessPage(token));
      }
      return htmlResponse(
        renderErrorPage('Ocorreu um erro ao processar sua solicitacao. Por favor, tente novamente mais tarde.'),
        500,
      );
    }

    return new Response('Method Not Allowed', { status: 405 });
  },
} satisfies ExportedHandler<Env>;
