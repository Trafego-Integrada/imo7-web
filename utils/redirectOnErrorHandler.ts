// utils/redirectOnError.js
import { NextApiHandler } from 'next';
import { parse } from 'url';

export const redirectOnError: (handler: NextApiHandler) => NextApiHandler = (
  handler
) => async (req, res) => {
  try {
    // Execute o manipulador original
    await handler(req, res);
  } catch (error) {
    // Verifique se estamos em ambiente de produção
    const isProduction = process.env.NODE_ENV === 'production';

    // Redirecione para a página de erro apenas em produção
    if (isProduction) {
      console.error('Error in API handler:', error);

      // Redirecionar para a página de erro
      res.writeHead(302, { Location: '/error' });
      res.end();
      return;
    }

    // Se não estiver em produção, envie a mensagem de erro como resposta
    res.status(500).json({ error: (error as Error).message });
  }
};
