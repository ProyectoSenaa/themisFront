const UserService = {
  async createUser({ data }: any) {
    return Promise.resolve({ data: { success: true } });
  },
  async getPersonById(id: number) {
    return Promise.resolve({ 
      data: { 
        data: { 
          id, 
          name: 'Test User', 
          lastname: 'Test LastName', 
          email: 'test@example.com', 
          phone: 1234567890,
          document: '12345678',
          roleList: [{ name: 'User' }]
        } 
      } 
    });
  },
  // Métodos movidos desde PersonService
  async createPerson({ data }: any) {
    return Promise.resolve({ data: { success: true, data: { id: Date.now() } } });
  },
  async getPersonByEmail(email: string) {
    return Promise.resolve({ data: { data: { id: 123, email } } });
  },
  async deletePerson(id: number) {
    return Promise.resolve({ data: { success: true } });
  }
};

export default UserService;
