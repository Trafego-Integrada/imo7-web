import { Box, Grid } from "@chakra-ui/react";

export const Filtro = ({ filtroAvancado }) => {
    return (
        <Grid
            bg="white"
            p={4}
            gridTemplateColumns={{
                base: "repeat(1,1fr)",
                md: "repeat(3,1fr)",
                lg: "repeat(4,1fr)",
                xl: "repeat(5,1fr)",
            }}
            gap={4}
        >
            {filtroAvancado}
        </Grid>
    );
};
