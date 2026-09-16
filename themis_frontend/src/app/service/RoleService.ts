const RoleService = {
  async getAllRoles() {
    return Promise.resolve({ data: { data: [{ id: 1, name: 'Admin' }, { id: 2, name: 'Aprendiz' }] } });
  }
};

export default RoleService;
