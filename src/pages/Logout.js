import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Logout() {
  const { unsetUser } = useContext(UserContext);

  useEffect(() => {
    unsetUser();
  }, [unsetUser]);

  return (
    <>
      <p className="text-center mt-5">Logging out...</p>
      <Navigate to="/login" />
    </>
  );
}
