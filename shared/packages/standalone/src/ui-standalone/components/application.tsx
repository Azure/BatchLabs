import * as React from "react";
import { CertificateDisplay } from "@batch/ui-react";
import { Customizer, Fabric } from "@fluentui/react";
import { AzureCustomizationsLight } from '@uifabric/azure-themes';
import { Header } from "./layout/header";
import { Main } from "./layout/main";
import { Footer } from "./layout/footer";

const CUSTOMIZATIONS = AzureCustomizationsLight;

export const Application: React.FC = props => {
    return (
        <Fabric>
            <Customizer {...CUSTOMIZATIONS}>
                <Header/>
                <Main>
                    <CertificateDisplay/>
                </Main>
                <Footer/>
            </Customizer>
        </Fabric>
    );
};
