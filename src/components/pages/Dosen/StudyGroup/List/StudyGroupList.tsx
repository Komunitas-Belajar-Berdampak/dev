import { useParams } from 'react-router-dom';

const StudyGroupList = () => {
  const { id } = useParams<{ id: string }>();

  return <div>{id}</div>;
};

export default StudyGroupList;
