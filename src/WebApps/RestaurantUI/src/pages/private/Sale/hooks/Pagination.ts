import { ItemReadDto } from "@/core/models";
import { useState } from "react";

function usePagination(data: Array<ItemReadDto>, itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  function next() {
    setCurrentPage(currentPage => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
  }

  function jump(page: number) {
    const pageNumber = Math.max(1, page);
    setCurrentPage(currentPage => {
      console.log(currentPage)
      return Math.min(pageNumber, maxPage)
    });
  }

  return { next, prev, jump, currentData, currentPage, maxPage };
}

export default usePagination;
