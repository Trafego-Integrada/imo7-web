import { Clientes } from "@/components/Site/Clientes";
import { ComoFunciona } from "@/components/Site/ComoFunciona";
import { ComoFunciona2 } from "@/components/Site/ComoFunciona2";
import { ComoFunciona3 } from "@/components/Site/ComoFunciona2 copy";
import { FichasCadastrais } from "@/components/Site/FichasCadastrais";
import { Tribunal } from "@/components/Site/FichasCadastrais copy";
import { Footer } from "@/components/Site/Footer";
import { Header } from "@/components/Site/Header";
import { LayoutSite } from "@/components/Site/Layout";
import { Planos } from "@/components/Site/Planos";
import { PraQuem } from "@/components/Site/PraQuem";
import { ValidacaoFacial } from "@/components/Site/ValidacaoFacial";
import { NextPage } from "next";

const Index: NextPage = () => {
    return (
        <LayoutSite>
            <Header />
            <ComoFunciona2 />
            <ComoFunciona3 />
            <ComoFunciona />
            <PraQuem />
            <FichasCadastrais />
            <Tribunal />
            <ValidacaoFacial />
            <Clientes />
            <Planos />
            <Footer />
        </LayoutSite>
    );
};

export default Index;
