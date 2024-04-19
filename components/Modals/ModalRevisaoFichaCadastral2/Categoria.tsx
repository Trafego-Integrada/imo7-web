import { useRef, useState } from "react";
import {
    removerCaracteresEspeciais,
    verificarExtensaoImagem,
} from "@/helpers/helpers";
import { isDisplayed } from "@/utils/registerFormFieldsAuxiliar";
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
    Link,
    Tag,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { AnaliseCampo } from "../ModalRevisaoFichaCadastral/AnaliseCampo";
import { Consultas } from "./Consultas";
import { ModalPreviewDaImagem } from "./PreviewDaImagem/Modal";
import { GrFormView } from "react-icons/gr";
import { FiDownload } from "react-icons/fi";
import { ModalTribunalJustica } from "./TribunalJustica/Modal";
import { formatarParaDataBR } from "@/utils/formatarParaDataBR";
import { validarData } from "@/utils/validarData";

export const Categoria = ({
    categoria,
    modeloFicha,
    ficha,
    buscarFicha,
}: any) => {
    const [open, setOpen] = useState(false);
    const modalPreviewDaImagem = useRef();
    const modalPreviewPDF = useRef();

    const dadosPreenchimentoCampo = (codigo: string) =>
        ficha.preenchimento.find(
            (p: any) => p.campoFichaCadastralCodigo == codigo
        );

    const ViewValor = (campo: any, valor: any) => {
        function abrirPreviewDaImagem(i: string) {
            modalPreviewDaImagem?.current?.onOpen({
                data: i,
            });
        }

        function abrirPreviewPDF(i: string) {
            modalPreviewPDF?.current?.onOpen(i);
        }

        if (valor) {
            if (["image"].includes(campo.tipoCampo)) {
                return JSON.parse(valor).map((i: any) => (
                    <Flex direction="column" key={i}>
                        <Image
                            key={i}
                            src={i}
                            w={32}
                            h={32}
                            rounded={8}
                            alt="Image"
                            onClick={() => abrirPreviewDaImagem(i)}
                            style={{
                                cursor: "pointer",
                            }}
                        />
                        <Flex alignItems="center" gap={2}>
                            <GrFormView
                                size={20}
                                onClick={() => abrirPreviewDaImagem(i)}
                                style={{
                                    cursor: "pointer",
                                }}
                            />
                            <Link
                                href={i}
                            >
                                <FiDownload
                                    size={20}
                                    style={{
                                        cursor: "pointer",
                                    }}
                                />
                            </Link>
                        </Flex>
                    </Flex>
                ));
            } else if (["file", "files"].includes(campo.tipoCampo)) {
                return (
                    <Flex flexDir="row" gap={2} wrap="wrap">
                        {JSON.parse(valor).map((i: string) => {
                            if (verificarExtensaoImagem(i).eImagem) {
                                return (
                                    <Flex direction="column" key={i}>
                                        <Image
                                            src={i}
                                            w={24}
                                            h={24}
                                            rounded="lg"
                                            aria-label="Arquivo"
                                            cursor="pointer"
                                            onClick={() =>
                                                abrirPreviewDaImagem(i)
                                            }
                                        />
                                        <Flex alignItems="center" gap={2}>
                                            <GrFormView
                                                size={20}
                                                onClick={() =>
                                                    abrirPreviewDaImagem(i)
                                                }
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            />
                                            <Link href={i}>
                                                <FiDownload
                                                    size={20}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Link>
                                        </Flex>
                                    </Flex>
                                );
                            } else {
                                return (
                                    <Flex direction="column" key={i}>
                                        <Flex
                                            align="center"
                                            justify="center"
                                            w={24}
                                            h={24}
                                            bg="gray.200"
                                            rounded="lg"
                                            onClick={() => verificarExtensaoImagem(i)
                                                .extensao.includes('pdf') && abrirPreviewPDF(i)}
                                        >
                                            <Text>
                                                {
                                                    verificarExtensaoImagem(i)
                                                        .extensao
                                                }
                                            </Text>
                                        </Flex>

                                        <Flex alignItems="center" gap={2}>
                                            {verificarExtensaoImagem(
                                                i
                                            ).extensao.includes("pdf") && (
                                                    <GrFormView
                                                        size={20}
                                                        onClick={() =>
                                                            abrirPreviewPDF(i)
                                                        }
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    />
                                                )}
                                            <Link href={i}>
                                                <FiDownload
                                                    size={20}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                />
                                            </Link>
                                        </Flex>
                                    </Flex>
                                );
                            }
                        })}
                    </Flex>
                );
            } else {
                return campo.codigo.includes("Data") ? formatarParaDataBR(valor) : valor;
            }
        }
    };

    return (
        <>
            <Accordion
                allowToggle
                display="flex"
                flexDir="column"
                gap={2}
                onChange={() => setOpen(!open)}
            >
                <AccordionItem key={categoria.id} bg="white" rounded="xl" p={4}>
                    <AccordionButton onClick={() => setOpen(!open)}>
                        {categoria?.nome}
                        <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel pb={4}>
                        <Consultas
                            ficha={ficha}
                            cpf={removerCaracteresEspeciais(
                                dadosPreenchimentoCampo(
                                    categoria.campos.find(
                                        (c: any) => c.tipoCampo == "cpf"
                                    )?.codigo
                                )?.valor
                            )}
                            cnpj={removerCaracteresEspeciais(
                                dadosPreenchimentoCampo(
                                    categoria.campos.find(
                                        (c: any) => c.tipoCampo == "cnpj"
                                    )?.codigo
                                )?.valor
                            )}
                            dataNascimento={removerCaracteresEspeciais(
                                dadosPreenchimentoCampo(
                                    categoria.campos.find(
                                        (c: any) => c.tipoCampo == "date"
                                    )?.codigo
                                )?.valor
                            )}
                            campoFichaCadastralCodigo={
                                dadosPreenchimentoCampo(
                                    categoria.campos.find(
                                        (c: any) => c.tipoCampo == "cpf"
                                    )?.codigo
                                )?.campoFichaCadastralCodigo
                            }
                        />

                        <Grid
                            marginTop={4}
                            gridTemplateColumns={{
                                base: "repeat(1,1fr)",
                                lg: "repeat(5,1fr)",
                            }}
                            gap={4}
                        >
                            {categoria.campos
                                .filter((i: any) => isDisplayed(i, modeloFicha))
                                .map((campo: any) => (
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
                                                    label={`Motivo da reprovação: ${dadosPreenchimentoCampo(
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
                                            {ficha.preenchimento.find(
                                                (p: any) =>
                                                    p.campoFichaCadastralCodigo ==
                                                    campo.codigo
                                            )?.valor && (
                                                    <AnaliseCampo
                                                        campoCodigo={campo?.codigo}
                                                        fichaId={ficha?.id}
                                                        buscarFicha={buscarFicha}
                                                    />
                                                )}
                                        </Flex>
                                        <Text fontWeight="bold">
                                            {ViewValor(
                                                campo,
                                                ficha.preenchimento.find(
                                                    (p: any) =>
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
            </Accordion>
            <ModalPreviewDaImagem ref={modalPreviewDaImagem} />
            <ModalTribunalJustica ref={modalPreviewPDF} />
        </>
    );
};
