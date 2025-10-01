import { useMutation, useQuery } from "@tanstack/react-query";
import Loader from "components/modules/Loader";
import { getCategory, removeCategory } from "services/admin";

import styles from "./CategoryList.module.css";

function CategoryList() {
  const { data, isLoading } = useQuery({
    queryKey: ["get-categories"],
    queryFn: getCategory,
  });
  console.log({ data, isLoading });

  const { mutate, isPending } = useMutation({
    mutationFn: removeCategory,
    onSuccess: () => {
      // 3. When deletion is successful, invalidate the categories query to refetch data
      queryClient.invalidateQueries({ queryKey: ["get-categories"] });
    },
  });

  const removeHandler = (id) => {
    mutate(id);
  };

  return (
    <div className={styles.list}>
      {isLoading ? (
        <Loader />
      ) : (
        data.data.map((i) => (
          <div key={i._id}>
            <img src={`${i.icon}.svg`} />
            <h5>{i.name}</h5>
            <p>slug : {i.slug}</p>
            <button onClick={() => removeHandler(i._id)} disabled={isPending}>
              حذف
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default CategoryList;
