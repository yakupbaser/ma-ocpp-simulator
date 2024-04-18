import React, { useEffect, useState } from 'react';
import AppContent from '../../components/content';

const HomeScreen: React.FC<any> = () => {
  const [readme, setReadme] = useState<string>('');
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getReadmeContent();
  }, []);
  const getReadmeContent = async () => {
    const response = await fetch('https://raw.githubusercontent.com/MuhammedAlmaz/ma-ocpp-simulator/main/README.md');
    setReadme(await response.text());
  };
  return (
    <AppContent title="Home">
      <article dangerouslySetInnerHTML={{ __html: readme }} />
    </AppContent>
  );
};

export default HomeScreen;
