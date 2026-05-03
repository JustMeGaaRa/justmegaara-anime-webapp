import TopBar from '@/components/TopBar';
import DetailView from '@/components/DetailView';
import Toast from '@/components/Toast';

export default async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <TopBar />
      <DetailView animeId={id} />
      <Toast />
    </>
  );
}
