import { isDependencyValid2 } from "@/utils/registerFormFieldsAuxiliar";

import { Categoria } from "./Categoria";
import { Flex } from "@chakra-ui/react";

export const Categorias = ({ categorias, modeloFicha, ficha, buscarFicha }) => {
    const preenchimentos = ficha.preenchimento;

    return (
        <Flex flexDir="column" gap={2}>
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
                ?.map((categoria) => (
                    <Categoria
                        key={categoria.id}
                        categoria={categoria}
                        modeloFicha={modeloFicha}
                        ficha={ficha}
                        buscarFicha={buscarFicha}
                    />
                ))}
        </Flex>
    );
};
