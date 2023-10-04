import { Clientes } from "@/components/Site/Clientes";
import { ComoFunciona } from "@/components/Site/ComoFunciona";
import { FichasCadastrais } from "@/components/Site/FichasCadastrais";
import { Footer } from "@/components/Site/Footer";
import { Header } from "@/components/Site/Header";
import { LayoutSite } from "@/components/Site/Layout";
import { PraQuem } from "@/components/Site/PraQuem";
import { ValidacaoFacial } from "@/components/Site/ValidacaoFacial";
import { NextPage } from "next";

const Index: NextPage = () => {
    return (
        <LayoutSite>
            <Header />
            <ComoFunciona />
            <PraQuem />
            <FichasCadastrais />
            <ValidacaoFacial />
            <Clientes />
            <Footer />
        </LayoutSite>
    );
};

export default Index;
