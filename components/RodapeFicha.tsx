import { Grid, GridItem, Image, Link, Text } from "@chakra-ui/react";

export function RodapeFicha(){
    return (
        <Grid>
            <GridItem>
                <Link target="_blank" display='flex' alignItems='center' justifyContent='center' href="https://www.imo7.com.br">
                    <Text>Plataforma Produzido e gerenciada por:</Text>  <Image width={20} src="/img/LOGO-IMO7-FUNDO-CLARO 1.png" />
                </Link>
            </GridItem>
        </Grid>
    )
}