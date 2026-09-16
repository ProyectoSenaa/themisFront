// NoveltyService: real implementation using apollo client and existing GraphQL documents
import client from '@/lib/apollo-provider';
import { UPDATE_NOVELTY, GET_NOVELTY_BY_ID } from '@/app/graphqlServices/noveltyGraphql';

const NoveltyService = {
  /**
   * Update the novelty using the UPDATE_NOVELTY mutation.
   * newStatus should match the GraphQL API expected input shape (NoveltyDto).
   */
  async updateStateNovelty(id: number, newStatus: any) {
    try {
  const variables = { id: String(id), input: newStatus?.data ? newStatus.data : newStatus };
  // Debug: log what we will send to the backend
  // eslint-disable-next-line no-console
  console.debug('NoveltyService.updateStateNovelty - variables:', variables);
      const { data } = await client.mutate({
        mutation: UPDATE_NOVELTY,
        variables,
      });
      // Ensure queries that list novelties are refreshed in Apollo cache
      try {
        // 'AllNovelties' is the operation name defined in the GET_NOVELTY document
        await client.refetchQueries({ include: ['AllNovelties'] });
      } catch (e) {
        // best-effort: if refetch fails, continue and return mutation result
        // eslint-disable-next-line no-console
        console.debug('NoveltyService.refetchQueries failed', e);
      }
      return data.updateNovelty;
    } catch (err) {
      // Re-throw to let callers handle errors
      throw err;
    }
  },

  async getNoveltyById(id: number) {
    try {
      const { data } = await client.query({
        query: GET_NOVELTY_BY_ID,
        variables: { id: String(id) },
        fetchPolicy: 'no-cache',
      });
      return data.noveltyById;
    } catch (err) {
      throw err;
    }
  },
};

export default NoveltyService;
