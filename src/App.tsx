import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { queryClient } from './lib/query-client';
import router from './routes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-center' id='global' />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
