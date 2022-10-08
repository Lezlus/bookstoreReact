import { Publisher } from "../models";

class PublisherDAO {
  async getPublisherById(id: number): Promise<Publisher> {
    const publisher = await Publisher.query().findById(id)
      .withGraphFetched('products');
    
    if (!publisher) {
      throw new Error('Publisher Not Found')
    }
    return publisher
  }

  async getPublisherByName(name: string): Promise<Publisher> {
    const publisher = await Publisher.query().findOne({name});
    if (!publisher) {
      throw new Error('Publisher Not Found')
    }
    return publisher
  }

}

export const publisherDAO = new PublisherDAO();