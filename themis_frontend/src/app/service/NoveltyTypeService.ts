// Minimal stub for NoveltyTypeService
// Replace with real Apollo/GraphQL calls to backend

const NoveltyTypeService = {
  async getNoveltyTypeById(id: number) {
    return Promise.resolve({ data: { data: { id, nameNovelty: 'Demo Type' } } });
  },
};

export default NoveltyTypeService;
