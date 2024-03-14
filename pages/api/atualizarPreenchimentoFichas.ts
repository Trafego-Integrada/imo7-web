import prisma from "@/lib/prisma";

export default async function RodarAtualizacao(req, res) {
    const fichas = await prisma.fichaCadastral.findMany({
        include: {
            modelo: true,
            preenchimento: true,
        },
    });

    let concluidas = 0;

    for await (const ficha of fichas) {
        // Atualizar Porcentagem de Preenchimento
        const campos = await prisma.campoFichaCadastral.findMany({
            include: {
                dependencia: true,
            },
        });
        const camposObrigatorios = Object.entries(ficha.modelo.campos).filter(
            (i) => {
                if (
                    i[1].obrigatorio &&
                    campos.find((c) => c.codigo == i[0])?.dependenciaId != null
                ) {
                    const campoAtual = campos.find((c) => c.codigo == i[0]);
                    const codigoCampoDependente = campos.find(
                        (c) => c.codigo == i[0]
                    )?.dependencia?.codigo;
                    const preenchimentoDoCampoDependente =
                        ficha.preenchimento.find(
                            (i) =>
                                i.campoFichaCadastralCodigo ==
                                codigoCampoDependente
                        );
                    if (
                        campoAtual?.dependenciaValor?.includes(
                            preenchimentoDoCampoDependente?.valor
                        )
                    ) {
                        return true;
                    }

                    //return true;
                } else if (i[1].obrigatorio) {
                    return true;
                }
                return false;
            }
        );

        const porcentagemPreenchimento =
            (camposObrigatorios.filter((c) => {
                const preenchimento = ficha.preenchimento.find(
                    (i) => i.campoFichaCadastralCodigo == c[0]
                );
                if (
                    preenchimento?.valor != null &&
                    preenchimento?.valor != ""
                ) {
                    return true;
                }
            }).length /
                18) *
            100;
        await prisma.fichaCadastral.update({
            where: {
                id: ficha.id,
            },
            data: {
                porcentagemPreenchimento,
            },
        });
        concluidas++;
        console.log(`Concluiu ${concluidas} de ${fichas.length}`);
    }

    res.send("ok");
}
