import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Utilities: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to utilities management page
    navigate('/panel/utilities-management', { replace: true });
  }, [navigate]);

  return null;
};

export default Utilities;
