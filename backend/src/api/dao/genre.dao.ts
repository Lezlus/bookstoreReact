import { Genre } from '../models/genre.model';

class GenreDAO {
  async getGenreByName(name: string): Promise<Genre> {
    const genre = await Genre.query().findOne({name})
      .withGraphFetched('products')
    
    if (!genre) {
      throw new Error("Genre Not Found")
    }
    return genre
  }

  async getGenreById(id: number): Promise<Genre> {
    const genre = await Genre.query().findById(id)
      .withGraphFetched('products')
    
    if (!genre) {
      throw new Error("Genre Not Found")
    }
    return genre
  }
}

export const genreDAO = new GenreDAO();