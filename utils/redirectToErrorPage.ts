// utils/redirectUtils.js
export const redirectToErrorPage = (ctx: any) => {
    if (process.env.NODE_ENV === 'production') {
      // Em produção, redirecione para a página de erro
      return {
        props: {},
        redirect: {
          destination: '/error',
          permanent: false,
        },
      };
    } else {
      // Em desenvolvimento, retorne null para permitir a exibição de erros na tela
      return {
        props: {}
      };
    }
};
  