type User = {
  permissions: string[];
  roles: string[];
};
type ValidadeUserPermissions = {
  user: User;
  permissions?: string[];
  roles?: string[];
};
export function validadeUserPermissions({
  user,
  permissions,
  roles
}: ValidadeUserPermissions) {
  if (permissions && permissions?.length > 0) {
    const hasAllPermissions = permissions?.every((permission) => {
      return user.permissions.includes(permission);
    });
    if (!hasAllPermissions) {
      return false;
    }
  }
  if (roles && roles?.length > 0) {
    const hasAllRoles = roles?.some((role) => {
      return user.roles.includes(role);
    });
    if (!hasAllRoles) {
      return false;
    }
  }
  return true;
}
