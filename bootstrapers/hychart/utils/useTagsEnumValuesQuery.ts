import { gql, useQuery } from "@apollo/client";

const GET_ENUM_VALUES = gql`
  query GetEnumValues($id: Int!) {
    enumValues(id: $id) {
      enumId
      id
      value
    }
  }
`;

const useTagsEnumValuesQuery = (enumId: number) => {
  // @ts-ignore
  const { data } = useQuery(GET_ENUM_VALUES, {
    variables: { id: enumId },
  });

  return { enumValues: data ? data.enumValues : null };
};

export default useTagsEnumValuesQuery;
