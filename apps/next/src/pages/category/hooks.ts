"use client";

import { CategoryRepository } from "$infrastructure/repositories/category.repository";
import { CategoryEntity } from "@eshop/business/domain/entities";
import { GetAllCategoriesUseCase } from "@eshop/business/domain/usecases/category";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const useCategoryList = (): {
  categories: CategoryEntity[];
  loading: boolean;
  setCategoriess: Dispatch<SetStateAction<CategoryEntity[]>>;
} => {
  const [categories, setCategoriess] = useState<CategoryEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategoriess() {
      setLoading(true);

      const categoryRepository = new CategoryRepository();

      const getAllCategoriessUseCase = new GetAllCategoriesUseCase(
        categoryRepository
      );

      const res = await getAllCategoriessUseCase.execute();

      setCategoriess(res);
      setLoading(false);
    }

    fetchCategoriess();
  }, []);

  return { categories, loading, setCategoriess };
};
