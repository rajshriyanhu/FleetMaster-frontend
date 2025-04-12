// permissions.ts
export enum Role {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
  CREATOR = "CREATOR", // new role
}

export const permissions = {
  vehicle: {
    view: [Role.ADMIN, Role.EDITOR, Role.VIEWER, Role.CREATOR],
    create: [Role.ADMIN, Role.EDITOR, Role.CREATOR],
    edit: [Role.ADMIN, Role.EDITOR],
    delete: [Role.ADMIN],
  },
  expense: {
    view: [Role.ADMIN, Role.EDITOR, Role.VIEWER, Role.CREATOR],
    create: [Role.ADMIN, Role.EDITOR, Role.CREATOR],
    edit: [Role.ADMIN, Role.EDITOR],
    delete: [Role.ADMIN],
  },
  trips: {
    view: [Role.ADMIN, Role.EDITOR, Role.VIEWER, Role.CREATOR],
    create: [Role.ADMIN, Role.EDITOR, Role.CREATOR],
    edit: [Role.ADMIN, Role.EDITOR],
    delete: [Role.ADMIN],
  },
  customers: {
    view: [Role.ADMIN, Role.EDITOR, Role.VIEWER, Role.CREATOR],
    create: [Role.ADMIN, Role.EDITOR, Role.CREATOR],
    edit: [Role.ADMIN, Role.EDITOR],
    delete: [Role.ADMIN],
  },
  drivers: {
    view: [Role.ADMIN, Role.EDITOR, Role.VIEWER, Role.CREATOR],
    create: [Role.ADMIN, Role.EDITOR, Role.CREATOR],
    edit: [Role.ADMIN, Role.EDITOR],
    delete: [Role.ADMIN],
  },
  users: {
    create: [Role.ADMIN],
    edit: [Role.ADMIN],
    view: [Role.ADMIN, Role.VIEWER],
    delete: [Role.ADMIN],
  },
  // ...more modules
};

export const hasPermission = (
  module: keyof typeof permissions,
  action: keyof (typeof permissions)[keyof typeof permissions],
  role: Role
): boolean => {
  return permissions[module]?.[action]?.includes(role) ?? false;
};
