import { FormInput } from "@/components/Form/FormInput";
import { FormMultiSelect } from "@/components/Form/FormMultiSelect";
import { FormSelect } from "@/components/Form/FormSelect";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { useAuth } from "@/hooks/useAuth";
import { listarContratos } from "@/services/models/contrato";
import { listarDepartamentos } from "@/services/models/departamento";
import { listarImoveis } from "@/services/models/imovel";
import { listarPessoas } from "@/services/models/pessoa";
import { listarTagsTarefa } from "@/services/models/tagTarefa";

import {
    atualizarTarefa,
    buscarTarefa,
    cadastrarTarefa,
} from "@/services/models/tarefa";
import { listarUsuarios } from "@/services/models/usuario";
import { queryClient } from "@/services/queryClient";
import {
    Button,
    Grid,
    GridItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import {
    forwardRef,
    KeyboardEventHandler,
    useImperativeHandle,
    useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import * as yup from "yup";

const schema = yup.object({
    titulo: yup.string().required("Campo Obrigatório"),

    status: yup.string().required("Campo Obrigatório"),

    prioridade: yup.string().required("Campo Obrigatório"),
});
const createOption = (label: string) => ({
    label,
    value: label,
});
const ModalBase = ({ chamadoId }, ref) => {
    const [inputValue, setInputValue] = useState("");
    const { usuario } = useAuth();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        control,
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const buscar = useMutation(buscarTarefa, {
        onSuccess: (data) => {
            reset({
                ...data,
                dataVencimento: data.dataVencimento
                    ? moment(data.dataVencimento).format("YYYY-MM-DD HH:mm")
                    : null,
                dataEntrega: data.dataEntrega
                    ? moment(data.dataEntrega).format("YYYY-MM-DD HH:mm")
                    : null,
            });
            onOpen();
        },
    });
    const cadastrar = useMutation(cadastrarTarefa, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tarefas"]);
            toast({ title: "Cadastrado com sucesso", status: "success" });
            onClose();
        },
    });
    const atualizar = useMutation(atualizarTarefa, {
        onSuccess: () => {
            queryClient.invalidateQueries(["tarefas"]);
            toast({ title: "Atualizado com sucesso", status: "success" });
            onClose();
        },
    });

    const onSubmit = async (data) => {
        console.log(data);
        try {
            if (data.id) {
                await atualizar.mutateAsync(data);
            } else {
                await cadastrar.mutateAsync({ ...data, chamadoId });
            }
        } catch (error) {
            console.log(error);
            toast({ title: "Ocorreu um erro", status: "error" });
        }
    };

    useImperativeHandle(ref, () => ({
        onOpen: async (id = null) => {
            if (id) {
                await buscar.mutateAsync(id);
            } else {
                reset({});
                onOpen();
            }
        },
    }));
    const { data: responsaveis } = useQuery(
        ["responsaveis", { admImobiliaria: true, status: true }],
        listarUsuarios
    );
    const { data: departamentos } = useQuery(
        ["departamentos", {}],
        listarDepartamentos
    );
    const { data: tags } = useQuery(["tags", {}], listarTagsTarefa);
    const { data: contratos } = useQuery(["contratos", {}], listarContratos);
    const { data: imoveis } = useQuery(["imoveis", {}], listarImoveis);
    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (!watch("tags")) return;
        switch (event.key) {
            case "Enter":
            case "Tab":
                setValue("tags", [...watch("tags"), createOption(inputValue)]);
                setInputValue("");
                event.preventDefault();
        }
    };
    // console.log(watch());
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        Tarefa <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <Grid
                            as="form"
                            id="formPessoa"
                            onSubmit={handleSubmit(onSubmit)}
                            gridTemplateColumns={{
                                sm: "repeat(1, 1fr)",
                                md: "repeat(3, 1fr)",
                            }}
                            gap={2}
                        >
                            <GridItem colSpan={{ md: 2 }}>
                                <Grid gap={5}>
                                    <GridItem>
                                        <FormInput
                                            size="sm"
                                            label="Titulo"
                                            placeholder="Dê um título para a tarefa"
                                            {...register("titulo")}
                                            error={errors.titulo?.message}
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <FormTextarea
                                            size="sm"
                                            rows={15}
                                            label="Descrição"
                                            placeholder="O que deve ser feito?"
                                            {...register("descricao")}
                                            error={errors.descricao?.message}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FormTextarea
                                            size="sm"
                                            label="Conclusão"
                                            placeholder="O que foi feito?"
                                            {...register("conclusao")}
                                            error={errors.conclusao?.message}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Controller
                                            control={control}
                                            name="tags"
                                            render={({ field }) => (
                                                <FormMultiSelect
                                                    create
                                                    size="sm"
                                                    label="Tags"
                                                    placeholder="Tags"
                                                    isMulti
                                                    options={tags?.data?.data}
                                                    getOptionLabel={(e) =>
                                                        e.nome
                                                            ? e.nome
                                                            : e.label
                                                    }
                                                    getOptionValue={(e) =>
                                                        e.id ? e.id : e.value
                                                    }
                                                    {...field}
                                                    onChange={(e) => {
                                                        if (!e.target) {
                                                            field.onChange(e);
                                                        }
                                                    }}
                                                    onInputChange={(newValue) =>
                                                        setInputValue(newValue)
                                                    }
                                                    formatCreateLabel={(e) =>
                                                        `Nova tag: ${e}`
                                                    }
                                                />
                                            )}
                                        />
                                    </GridItem>
                                </Grid>
                            </GridItem>
                            <GridItem bg="gray.50" p={2}>
                                <Grid gap={5}>
                                    <GridItem>
                                        <Controller
                                            control={control}
                                            name="departamento"
                                            render={({ field }) => (
                                                <FormMultiSelect
                                                    size="sm"
                                                    label="Departamento"
                                                    placeholder="Qual departamento?"
                                                    options={
                                                        departamentos?.data
                                                            ?.data
                                                    }
                                                    getOptionLabel={(e) =>
                                                        e.titulo
                                                    }
                                                    getOptionValue={(e) => e.id}
                                                    error={
                                                        errors.departamento
                                                            ?.message
                                                    }
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Controller
                                            control={control}
                                            name="responsaveis"
                                            render={({ field }) => (
                                                <FormMultiSelect
                                                    size="sm"
                                                    label="Responsáveis"
                                                    placeholder="Responsáveis"
                                                    isMulti
                                                    options={
                                                        responsaveis?.data?.data
                                                    }
                                                    getOptionLabel={(e) =>
                                                        e.nome
                                                    }
                                                    getOptionValue={(e) => e.id}
                                                    error={
                                                        errors.responsaveis
                                                            ?.message
                                                    }
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <Controller
                                            control={control}
                                            name="contrato"
                                            render={({ field }) => (
                                                <FormMultiSelect
                                                    size="sm"
                                                    label="Contrato"
                                                    placeholder="Ref. Contrato"
                                                    options={
                                                        contratos?.data?.data
                                                    }
                                                    getOptionLabel={(e) =>
                                                        `${e.codigo} - ${e.imovel?.endereco}`
                                                    }
                                                    getOptionValue={(e) => e.id}
                                                    error={
                                                        errors.contrato?.message
                                                    }
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <Controller
                                            control={control}
                                            name="imovel"
                                            render={({ field }) => (
                                                <FormMultiSelect
                                                    size="sm"
                                                    label="Imovel"
                                                    placeholder="Ref. Imovel"
                                                    options={
                                                        imoveis?.data?.data
                                                    }
                                                    getOptionLabel={(e) =>
                                                        `${e.codigo} - ${e.endereco}`
                                                    }
                                                    getOptionValue={(e) => e.id}
                                                    error={
                                                        errors.imovel?.message
                                                    }
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <Controller
                                            control={control}
                                            name="membros"
                                            render={({ field }) => (
                                                <FormMultiSelect
                                                    size="sm"
                                                    label="Membros"
                                                    placeholder="Selecione os membros"
                                                    isMulti
                                                    options={
                                                        responsaveis?.data?.data
                                                    }
                                                    getOptionLabel={(e) =>
                                                        e.nome
                                                    }
                                                    getOptionValue={(e) => e.id}
                                                    error={
                                                        errors.responsaveis
                                                            ?.message
                                                    }
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <FormSelect
                                            size="sm"
                                            label="Prioridade"
                                            placeholder="Qual a prioridade?"
                                            {...register("prioridade")}
                                            error={errors.prioridade?.message}
                                        >
                                            <option value="Baixa">Baixa</option>
                                            <option value="Media">Média</option>
                                            <option value="Alta">Alta</option>
                                            <option value="Urgente">
                                                Urgente
                                            </option>
                                        </FormSelect>
                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            type="datetime-local"
                                            size="sm"
                                            label="Vencimento"
                                            placeholder="..."
                                            {...register("dataVencimento")}
                                            error={
                                                errors.dataVencimento?.message
                                            }
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <FormInput
                                            type="datetime-local"
                                            size="sm"
                                            label="Data da Entrega"
                                            placeholder="..."
                                            {...register("dataEntrega")}
                                            error={errors.dataEntrega?.message}
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <FormSelect
                                            size="sm"
                                            label="Status"
                                            placeholder="Qual status atual?"
                                            {...register("status")}
                                            error={errors.status?.message}
                                        >
                                            <option value="aberta">
                                                Aberta
                                            </option>
                                            <option value="finalizada">
                                                Finalizada
                                            </option>
                                        </FormSelect>
                                    </GridItem>
                                </Grid>
                            </GridItem>
                        </Grid>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Fechar
                        </Button>
                        <Button
                            colorScheme="blue"
                            mr={3}
                            type="submit"
                            isLoading={isSubmitting}
                            form="formPessoa"
                        >
                            Confirmar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export const ModalTarefa = forwardRef(ModalBase);
