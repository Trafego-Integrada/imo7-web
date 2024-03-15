import {
    removerCaracteresEspeciais,
    verificarExtensaoImagem,
} from "@/helpers/helpers";
import {
    isDependencyValid2,
    isDisplayed,
} from "@/utils/registerFormFieldsAuxiliar";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Flex,
    Grid,
    GridItem,
    Image,
    Tag,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { AnaliseCampo } from "../ModalRevisaoFichaCadastral/AnaliseCampo";
import { Consultas } from "./Consultas";

export const Categorias = ({
    categorias,
    modeloFicha,
    preenchimentos,
    ficha,
    buscarFicha,
}) => {
    const dadosPreenchimentoCampo = (codigo) =>
        preenchimentos.find((p) => p.campoFichaCadastralCodigo == codigo);
    return (
        <Accordion
            allowToggle
            defaultIndex={0}
            display="flex"
            flexDir="column"
            gap={2}
        >
            {categorias
                ?.filter((categoria) =>
                    categoria?.campos?.find((campo) =>
                        isDependencyValid2(
                            campo,
                            campo.dependenciaValor,
                            modeloFicha,
                            preenchimentos
                        )
                    )
                )
                .map((categoria) => (
                    <AccordionItem
                        key={categoria.id}
                        bg="white"
                        rounded="xl"
                        p={4}
                    >
                        <AccordionButton>
                            {categoria?.nome}
                            <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel pb={4}>
                            <Consultas
                                ficha={ficha}
                                // Preencher com os valores preenchidos na ficha
                                cpf={removerCaracteresEspeciais(
                                    dadosPreenchimentoCampo(
                                        categoria.campos.find(
                                            (c) => c.tipoCampo == "cpf"
                                        )?.codigo
                                    )?.valor
                                )}
                                cnpj={removerCaracteresEspeciais(
                                    dadosPreenchimentoCampo(
                                        categoria.campos.find(
                                            (c) => c.tipoCampo == "cnpj"
                                        )?.codigo
                                    )?.valor
                                )}
                            />
                            <Grid
                                gridTemplateColumns={{
                                    base: "repeat(1,1fr)",
                                    lg: "repeat(5,1fr)",
                                }}
                                gap={4}
                            >
                                {categoria.campos
                                    .filter((i) => isDisplayed(i, modeloFicha))
                                    .map((campo) => (
                                        <GridItem
                                            key={campo.key}
                                            colSpan={{ lg: campo.colSpan }}
                                        >
                                            <Flex>
                                                <Text>{campo.nome}</Text>
                                                {dadosPreenchimentoCampo(
                                                    campo.codigo
                                                )?.aprovado ? (
                                                    <Tag
                                                        colorScheme="green"
                                                        size="sm"
                                                    >
                                                        Aprovado
                                                    </Tag>
                                                ) : dadosPreenchimentoCampo(
                                                      campo.codigo
                                                  )?.motivoReprovacao ? (
                                                    <Tooltip
                                                        label={`Motivo da reprovação: ${
                                                            dadosPreenchimentoCampo(
                                                                campo.codigo
                                                            )?.motivoReprovacao
                                                        }`}
                                                        bg="red"
                                                        color="white"
                                                        hasArrow
                                                    >
                                                        <Tag
                                                            colorScheme="red"
                                                            size="sm"
                                                        >
                                                            Reprovado{" "}
                                                        </Tag>
                                                    </Tooltip>
                                                ) : (
                                                    ""
                                                )}
                                                <AnaliseCampo
                                                    campoCodigo={campo?.codigo}
                                                    fichaId={ficha?.id}
                                                    buscarFicha={buscarFicha}
                                                />
                                            </Flex>
                                            <Text fontWeight="bold">
                                                {ViewValor(
                                                    campo,
                                                    preenchimentos.find(
                                                        (p) =>
                                                            p.campoFichaCadastralCodigo ==
                                                            campo.codigo
                                                    )?.valor
                                                )}
                                            </Text>
                                        </GridItem>
                                    ))}
                            </Grid>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
        </Accordion>
    );
};

const ViewValor = (campo, valor) => {
    if (valor) {
        if (["image"].includes(campo.tipoCampo)) {
            return JSON.parse(valor).map((i) => (
                <Image key={i} src={i} w={32} h={32} rounded={99} />
            ));
        } else if (["file", "files"].includes(campo.tipoCampo)) {
            return (
                <Flex flexDir="row" gap={2} wrap="wrap">
                    {JSON.parse(valor).map((i) => {
                        if (verificarExtensaoImagem(i).eImagem) {
                            return (
                                <Image
                                    key={i}
                                    src={i}
                                    w={24}
                                    h={24}
                                    rounded="lg"
                                    aria-label="Arquivo"
                                />
                            );
                        } else {
                            return (
                                <Flex
                                    key={i}
                                    align="center"
                                    justify="center"
                                    w={24}
                                    h={24}
                                    bg="gray.200"
                                    rounded="lg"
                                >
                                    <Text>
                                        {verificarExtensaoImagem(i).extensao}
                                    </Text>
                                </Flex>
                            );
                        }
                    })}
                </Flex>
            );
        } else {
            return valor;
        }
    }
};
