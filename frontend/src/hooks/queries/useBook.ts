import ProductService from "../../services/productService/productService";
import { useQuery } from "@tanstack/react-query";
import { bookKeys } from "../../components/booksComponents/queries";

const getBook = async (name: string) => {
  console.log(name)
  const res = await ProductService.getBySlug(name);
  return res;
}

export const useBook = (name: string) => useQuery(bookKeys.detail(name), () => getBook(name)); 