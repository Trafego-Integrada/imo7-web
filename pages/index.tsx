import { ModalContato } from "@/components/Modals/ModalContato";
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
import { WhatsApp } from "@/components/WhatsApp";
import { NextPage } from "next";
import { useRef } from "react";

const Index: NextPage = () => {
    const modalContato = useRef();
    return (
        <LayoutSite>
            <Header />
            <ComoFunciona2 modal={modalContato} />
            <ComoFunciona3 modal={modalContato} />
            <ComoFunciona modal={modalContato} />
            <PraQuem modal={modalContato} />
            <FichasCadastrais modal={modalContato} />
            <Tribunal modal={modalContato} />
            <ValidacaoFacial modal={modalContato} />
            <Clientes />
            <Planos />
            <Footer />
            <WhatsApp/>
            <ModalContato ref={modalContato} />
        </LayoutSite>
    );
};

export default Index;
