import { getUser } from "@/lib/authStorage";

const ProfilePage = () => {
  const data = getUser();
  console.log("user apa", data);
  return <div className="">ini profile page</div>;
};

export default ProfilePage;
