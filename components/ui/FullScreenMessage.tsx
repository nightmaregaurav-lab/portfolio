import React from 'react';

function FullScreenLoading(
  {children}: {children: React.ReactNode}
) {
  return (
    <div className={"fixed inset-0 flex flex-col items-center justify-center bg-secondary bg-opacity-50 z-50"}>
      {children}
    </div>
  );
}

export default FullScreenLoading;
