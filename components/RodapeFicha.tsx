import { Grid, GridItem, Image, Text } from "@chakra-ui/react";

export function RodapeFicha(){
    return (
        <Grid>
            <GridItem display='flex' alignItems='center' justifyContent='end'>
            <Text>Plataforma Produzido e gerenciada por:</Text> <Image width={24} src="/img/LOGO-IMO7-FUNDO-CLARO 1.png" />
            </GridItem>
        </Grid>
    )
}