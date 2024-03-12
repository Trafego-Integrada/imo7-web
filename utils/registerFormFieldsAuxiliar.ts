export const isDisplayed = (campo: any, modelo: any) => {
    const codigo = campo.codigo;
    const displayedField = modelo && modelo.campos && modelo?.campos[codigo]?.exibir;

    if (modelo && modelo.campos && modelo?.campos[codigo]?.exibir) {
        console.log(JSON.stringify({
            codigo,
            displayedField
        }))
    }
    return displayedField
};

export const isRequired = (campo: any, modelo: any) => {
    const codigo = campo.codigo;
    const requiredField = modelo && modelo.campos && !!modelo?.campos[codigo]?.obrigatorio;

    return requiredField
};

export const isDependencyValid = (campo: any, dependenciaValor: any, modelo: any, watch: any) => {
    const dependencia = campo.dependencia;

    const isCampoExibido = isDisplayed(campo, modelo);

    if (isCampoExibido) {
        if (!campo.dependencia && !dependenciaValor) {
            return true;
        }

        if (dependencia?.codigo) {
            const dependenciaCodigo = dependencia.codigo;

            if (!dependenciaValor) {
                return watch(`preenchimento.${dependenciaCodigo}`);
            }

            const dependenciaValues = JSON.parse(dependenciaValor);
            return dependenciaValues.includes(
                watch(`preenchimento.${dependenciaCodigo}`)
            );
        }
    }

    return false;
};

export const totalFields = (campos: any, modelo: any, watch: any) => {
    const totalFields = campos.filter((item: any) => {
        const hasDisplayedField = item.campos.some((campo: any) => {
            const displayed = isDisplayed(campo, modelo);
            console.log(JSON.stringify({
                displayed
            }))
            return displayed
        });
        
        console.log(JSON.stringify({
            hasDisplayedField
        }))

        const hasValidDependency = item.campos.some((campo: any) => {
            return isDependencyValid(campo, item.dependenciaValor, modelo, watch);
        });

        return hasDisplayedField && hasValidDependency;
    })
    return totalFields
};

export const totalRequiredFields = (campos: any, modelo: any, watch: any) => {
    const totalRequiredFields = campos.filter((item: any) => {
        const hasDisplayedAndRequiredField = item.campos.some((campo: any) => {
            return isDisplayed(campo, modelo) && isRequired(campo, modelo);
        });

        const hasValidDependency = item.campos.some((campo: any) => {
            return isDependencyValid(campo, item.dependenciaValor, modelo, watch);
        });

        return hasDisplayedAndRequiredField && hasValidDependency;
    })
    return totalRequiredFields
};