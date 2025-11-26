import BackgroundCarousel from '@/components/BackgroundCarousel';
import LoginForm from '@/components/LoginForm';

const Index = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <BackgroundCarousel />
      <div className="relative z-10 px-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;
