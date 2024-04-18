import { isDependencyValid2 } from "@/utils/registerFormFieldsAuxiliar";

import { Categoria } from "./Categoria";
import { Flex } from "@chakra-ui/react";

export const Categorias = ({
    categorias,
    modeloFicha,
    ficha,
    buscarFicha,
}: any) => {
    const preenchimentos = ficha.preenchimento;

    return (
        <Flex flexDir="column" gap={2}>
            {categorias
                ?.filter((categoria: any) =>
                    categoria?.campos?.find((campo: any) =>
                        isDependencyValid2(
                            campo,
                            campo.dependenciaValor,
                            modeloFicha,
                            preenchimentos
                        )
                    )
                )
                ?.map((categoria: any) => (
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
