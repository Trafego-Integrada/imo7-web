type User = {
    permissoes: string[];
    cargos: string[];
};
type ValidadeUserPermissions = {
    user: User;
    permissoes?: string[];
    cargos?: string[];
};
export function validadeUserPermissions({
    user,
    permissoes,
    cargos,
}: ValidadeUserPermissions) {
    if (permissoes && permissoes?.length > 0) {
        const hasAllPermissions = permissoes?.every((permissao) => {
            return user.permissoes.includes(permissao);
        });
        if (!hasAllPermissions) {
            return false;
        }
    }
    if (cargos && cargos?.length > 0) {
        const hasAllRoles = cargos?.some((cargo) => {
            return user.cargos.includes(cargo);
        });
        if (!hasAllRoles) {
            return false;
        }
    }
    return true;
}
