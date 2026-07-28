"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

export interface UseEntitySelectionResult<T> {
  selectedId: string | null;
  selectedEntity: T | null;
  selectEntity: (id: string | null) => void;
  clearSelection: () => void;
}

export function useEntitySelection<T extends { id: string }>(
  paramKey: string,
  entities: T[]
): UseEntitySelectionResult<T> {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const paramVal = searchParams?.get(paramKey);
  const selectedId = paramVal && paramVal.trim() !== "" ? paramVal : null;

  const selectedEntity = useMemo(() => {
    if (!selectedId) return null;
    return entities.find((entity) => entity.id === selectedId) ?? null;
  }, [entities, selectedId]);

  const selectEntity = useCallback(
    (id: string | null) => {
      const currentParams = searchParams
        ? new URLSearchParams(searchParams.toString())
        : new URLSearchParams();
      const hasParam = searchParams ? searchParams.has(paramKey) : false;

      if (id === null || id === "") {
        currentParams.delete(paramKey);
      } else {
        currentParams.set(paramKey, id);
      }

      const queryString = currentParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      if (hasParam) {
        router.replace(newUrl, { scroll: false });
      } else {
        router.push(newUrl, { scroll: false });
      }
    },
    [paramKey, searchParams, pathname, router]
  );

  const clearSelection = useCallback(() => {
    selectEntity(null);
  }, [selectEntity]);

  return {
    selectedId,
    selectedEntity,
    selectEntity,
    clearSelection,
  };
}
