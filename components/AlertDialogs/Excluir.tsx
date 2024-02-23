import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const AlertBase = ({ titulo, onDelete }, ref) => {
  const [id, setId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  useImperativeHandle(ref, () => ({
    onOpen: (idDelete) => {
      //console.log(idDelete);
      setId(idDelete);
      onOpen();
    }
  }));
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {titulo}
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir? Esta operação não poderá ser
              desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onDelete(id);
                  onClose();
                }}
                ml={3}
              >
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export const Excluir = forwardRef(AlertBase);
